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
   
    // listRestaurantLogic.js
    static list(params, callback) {
        const offset = params.start ? parseInt(params.start) : 0;
        const limit = params.length ? parseInt(params.length) : 20;

        // Updated filter to include both Active and Deleted statuses
        const filter = {
            status: {
                [Op.in]: ['Active', 'Deleted']
            }
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
                        'restaurantID', 'name', 'location', 'phone', 'status'
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

            // Refresh database to ensure the list reflects current status
            DatabaseManager.restaurant.findAll({
                attributes: [
                    'restaurantID', 'name', 'location', 'phone', 'status'
                ],
                where: {
                    status: {
                        [Op.in]: ['Active', 'Deleted']
                    }
                },
                order: [['name', 'ASC']]
            })
            .then(refreshedRestaurants => {
                return callback({
                    status: Consts.httpCodeSuccess,
                    data: refreshedRestaurants,
                    recordsTotal: totalRecords,
                    recordsFiltered: totalRecords,
                });
            })
            .catch(err => {
                return callback({
                    status: Consts.httpCodeServerError,
                    message: 'Failed to refresh restaurant list',
                    error: err,
                    data: [],
                    recordsTotal: 0,
                    recordsFiltered: 0,
                });
            });
        });
    }


    // RestaurantUpdateLogic.js
    static async update(body, callback = (result) => {}) {
        try {
            async.waterfall([
                function (done) {
                    // Validation logic
                    if (Utils.isEmpty(body.restaurantID)) {
                        return done("Restaurant ID is required");
                    }
                    if (Utils.isEmpty(body.name)) {
                        return done("Name is required and should be in characters.");
                    }
                    if (Utils.isEmpty(body.location) || !validator.isLength(body.location, { min: 1 })) {
                        return done("Location is required.");
                    }
                    if (Utils.isEmpty(body.phone) || !validator.isNumeric(`${body.phone}`, { min: 1 })) {
                        return done("Phone is required.");
                    }
                    done(null);
                },
                function (done) {
                    // Validate the restaurant exists
                    DatabaseManager.restaurant.findOne({
                        where: { restaurantId: body.restaurantID },
                    }).then(restaurant => {
                        if (Utils.isEmpty(restaurant)) {
                            return done('Restaurant not found');
                        }
                        done(null, restaurant);
                    }).catch(err => done(err));
                },
                function (restaurant, done) {
                    // Update the restaurant
                    DatabaseManager.restaurant
                        .update({
                            name: body.name,
                            location: body.location,
                            phone: body.phone,
                            status: body.status,
                        }, {
                            where: { restaurantId: body.restaurantID }
                        })
                        .then(() => done(null, restaurant))
                        .catch(err => done(err));
                }
            ], function (err, restaurant) {
                if (err) {
                    return callback({
                        status: Consts.httpCodeServerError, // Ensure this value exists
                        message: 'Error in updating restaurant',
                        error: err,
                    });
                }

                return callback({
                    status: Consts.httpCodeSuccess, // Ensure this value exists
                    message: "Restaurant updated successfully",
                    data: restaurant,
                });
            });

        } catch (err) {
            console.error("Error in updating restaurant:", err);
            return callback({
                status: Consts.httpCodeServerError, // Ensure this value exists
                message: "Failed to update restaurant",
                error: err.message,
            });
        }
    }

// deleteRestaurantLogic.js
static deleteById(restaurantID, callback) {
    async.waterfall([
        function (done) {
            DatabaseManager.restaurant.findByPk(restaurantID)
                .then(restaurant => {
                    if (!restaurant) {
                        // Restaurant not found
                        return done(new Error("Restaurant not found for ID: " + restaurantID));
                    }
                    if (restaurant.status === "Deleted") {
                        // Restaurant already deleted
                        return done(new Error("Restaurant already deleted for ID: " + restaurantID));
                    }
                    // Proceed with deletion
                    done(null, restaurant);
                })
                .catch(err => done(err));
        },
        function (restaurant, done) {
            // Update the status to 'Deleted'
            restaurant.update({ status: "Deleted" })
                .then(updatedRestaurant => {
                    // Confirm that the status has been updated correctly
                    console.log('Updated Restaurant:', updatedRestaurant);
                    done(null, updatedRestaurant);
                })
                .catch(err => done(err));
        }
    ], function (err, updatedRestaurant) {
        if (err) {
            return callback({
                status: Consts.httpCodeServerError,
                message: err.message || 'Failed to mark restaurant as deleted',
                error: err.message || err,
            });
        }

        return callback({
            status: Consts.httpCodeSuccess,
            message: "Restaurant status updated to 'Deleted'",
            data: updatedRestaurant,
        });
    });
}


}

export default RestaurantLogic;







