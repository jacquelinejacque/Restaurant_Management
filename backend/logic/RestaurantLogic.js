import async from 'async';
import { Consts } from '../lib/Consts.js';
import { Op } from 'sequelize';
import Utils from '../lib/Utils.js';
import DatabaseManager from '../lib/DatabaseManager.js';
import validator from 'validator';

class RestaurantLogic {

    // create restaurant
    static create(body, callback) {
        async.waterfall([
            // Step 1: Validation
            function (done) {
                if (Utils.isEmpty(body.name)) {
                    return done("Name is required and should be in characters.");
                }
                if (Utils.isEmpty(body.location) || !validator.isLength(body.location, { min: 1 })) {
                    return done("Location is required.");
                }
                if (Utils.isEmpty(body.phone)) {
                    return done("Phone number is required.");
                }
                done(null);
            },

            // Step 2: Create Restaurant
            function (done) {
                body.abbrv = Utils.generateAbbrv(body.name);
                DatabaseManager.restaurant
                    .create({
                        name: body.name,
                        location: body.location,
                        phone: body.phone,
                        abbrv: body.abbrv // assuming abbrv is also stored in the database
                    })
                    .then(restaurant => done(null, restaurant))
                    .catch(err => done(err));
            }
        ], 
        // Final callback
        function (err, restaurant) {
            if (err) {
                console.error('Error creating restaurant:', err);
                return callback({
                    status: Consts.httpCodeServerError, 
                    message: 'Error in creating restaurant',
                    error: err,
                });
            }

            return callback({
                status: Consts.httpCodeSuccess,
                message: "Restaurant created successfully",
                data: restaurant,  // Correct variable name
            });
        });
    }   

    static list(params, callback) {
        const offset = params.start ? parseInt(params.start) : 0;
        const limit = params.length ? parseInt(params.length) : 20;

        // Define what is considered "recently inactivated"
        const recentDate = new Date();
        recentDate.setMonth(recentDate.getMonth() - 1); // e.g., within the last 30 days

        // Updated filter to include both Active and Inactive statuses
        const filter = {
            status: {
                [Op.in]: ['active', 'inactive']
            },
            [Op.or]: [
                { status: 'active' },
                { 
                    status: 'inactive',
                    updatedAt: {
                        [Op.gte]: recentDate
                    }
                }
            ]
        };

        if (params.name) filter.name = { [Op.like]: `%${params.name}%` };
        if (params.location) filter.location = { [Op.like]: `%${params.location}%` };
        if (params.phone) filter.phone = { [Op.like]: `%${params.phone}%` };

        async.waterfall([
            // Step 1: Count total records that match the filter
            function (done) {
                DatabaseManager.restaurant.count({ where: filter })
                    .then(totalRecords => done(null, totalRecords))
                    .catch(err => done(err));
            },
            // Step 2: Fetch paginated list of restaurants
            function (totalRecords, done) {
                DatabaseManager.restaurant.findAll({
                    attributes: [
                        'restaurantID', 'name', 'location', 'phone', 'status', 'updatedAt'
                    ],
                    where: filter,
                    offset,
                    limit,
                    order: [['name', 'ASC']]
                })
                    .then(restaurants => done(null, totalRecords, restaurants))
                    .catch(err => done(err));
            }
        ],
        // Final callback
        function (err, totalRecords, restaurants) {
            if (err) {
                return callback({
                    status: Consts.httpCodeServerError,
                    message: 'Failed to fetch restaurants',
                    error: err,
                    data: [],
                    recordsTotal: 0,
                    recordsFiltered: 0,
                });
            }

            return callback({
                status: Consts.httpCodeSuccess,
                data: restaurants,
                recordsTotal: totalRecords,
                recordsFiltered: totalRecords,
            });
        });
    }

    static async update(restaurantID, body, callback = (result) => {}) {
        try {
            async.waterfall([
                function (done) {
                    if (Utils.isEmpty(restaurantID)) {
                        return done("Restaurant ID is required");
                    }
                    if (Utils.isEmpty(body.name)) {
                        return done("Name is required.");
                    }
                    if (Utils.isEmpty(body.location)) {
                        return done("Location is required.");
                    }
                    if (Utils.isEmpty(body.phone) || !validator.isNumeric(`${body.phone}`)) {
                        return done("Phone is required and must be numeric.");
                    }
                    done(null);
                },
                function (done) {
                    DatabaseManager.restaurant.findOne({
                        where: { restaurantID: restaurantID }, // Use restaurantID
                    }).then(restaurant => {
                        if (Utils.isEmpty(restaurant)) {
                            return done('Restaurant not found');
                        }
                        done(null, restaurant);
                    }).catch(err => done(err));
                },
                function (restaurant, done) {
                    DatabaseManager.restaurant.update({
                        name: body.name,
                        location: body.location,
                        phone: body.phone,
                        status: body.status,
                    }, {
                        where: { restaurantID: restaurantID } // Use restaurantID
                    })
                    .then(() => done(null, restaurant))
                    .catch(err => done(err));
                }
            ], function (err, restaurant) {
                if (err) {
                    return callback({
                        status: Consts.httpCodeServerError,
                        message: 'Error in updating restaurant',
                        error: err,
                    });
                }

                return callback({
                    status: Consts.httpCodeSuccess,
                    message: "Restaurant updated successfully",
                    data: restaurant,
                });
            });
        } catch (err) {
            console.error("Error in updating restaurant:", err);
            return callback({
                status: Consts.httpCodeServerError,
                message: "Failed to update restaurant",
                error: err.message,
            });
        }
    }

    
    // Get restaurant by Id
    static getRestaurantById(restaurantId, callback) {
        DatabaseManager.restaurant.findOne({
            attributes: ['restaurantID', 'name', 'location', 'phone', 'status'],
            where: { restaurantID: restaurantId }
        })
        .then(restaurant => {
            if (restaurant) {
                callback({ status: Consts.httpCodeSuccess, restaurant });
            } else {
                callback({ status: Consts.httpCodeNotFound, message: 'Restaurant not found' });
            }
        })
        .catch(err => {
            console.error('Error fetching restaurant by ID:', err);
            callback({ status: Consts.httpCodeServerError, message: 'An error occurred while fetching the restaurant' });
        });
    }


    static delete(restaurantID, callback) {
        async.waterfall([
            function (done) {
                if (Utils.isEmpty(restaurantID)) {
                    return done("Restaurant ID is required.");
                }
                done(null);
            },

            // Using a transaction to ensure consistency
            function (done) {
                DatabaseManager.sequelize.transaction(t => {
                    return DatabaseManager.restaurant.findOne({
                        where: { restaurantID: restaurantID, status: 'active' },
                        transaction: t
                    }).then(restaurant => {
                        if (!restaurant) {
                            throw new Error("Restaurant not found or already inactivated.");
                        }
                        return restaurant.update({ status: 'inactive' }, { transaction: t });
                    });
                })
                .then(updatedRestaurant => done(null, updatedRestaurant))
                .catch(err => done(err));
            }
        ], 
        function (err, updatedRestaurant) {
            if (err) {
                console.error('Error inactivating restaurant:', err);
                return callback({
                    status: Consts.httpCodeServerError, 
                    message: 'Error in inactivating restaurant',
                    error: err,
                });
            }

            return callback({
                status: Consts.httpCodeSuccess,
                message: "Restaurant inactivating successfully",
                data: updatedRestaurant,
            });
        });
    }


}

export default RestaurantLogic;







