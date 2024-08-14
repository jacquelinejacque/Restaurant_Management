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
                    done("Phone number is required.");
                    return;
                }
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
                    status: Consts.httpCodeSeverError,
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
   
    //list restaurant
    static list(params, callback) {
        const offset = params.start ? parseInt(params.start) : 0;
        const limit = params.length ? parseInt(params.length) : 20;

        const filter = {
            status: {
                [Op.in]: ['Active']
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
                    status: Consts.httpCodeSeverError,
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
    

}

export default RestaurantLogic;







