import async from 'async';
import { Consts } from '../lib/Consts.js';
import Utils from '../lib/Utils.js';
import DatabaseManager from '../lib/DatabaseManager.js';

class CustomerLogic {
  static create(body, callback) {
    async.waterfall(
      [
        // Step 1: Validate input
        function (done) {
          if (Utils.isEmpty(body.name)) {
            done('Name cannot be empty');
            return;
          }
          if (Utils.isEmpty(body.phone)) {
            done('Phone number is required');
            return;
          }
          if (Utils.isEmpty(body.email)) {
            done('Email is required');
            return;
          }
          if (Utils.isEmpty(body.creditCardNumber)) {
            done('creditCardNumber is required');
            return;
          }

          DatabaseManager.customer
            .findOne({
              where: {
                email: body.email,
              },
            })
            .then((res) => {
              if (res) {
                done('customer with similar details already exists');
                return;
              }
              done(null);
            })
            .catch((err) => {
              done(err);
            });
        },

        // Step 3: Create user
        function (done) {
          const params = {
            name: body.name,
            phone: body.phone,
            email: body.email,
            creditCardNumber: body.creditCardNumber,
            
          };

          DatabaseManager.user
            .create(params)
            .then((user) => done(null, user))
            .catch((err) => done(err));
        },
      ],
      function (err, data) {
        if (err) {
          return callback({
            status: Consts.httpCodeServerError,
            message: 'Failed to create customer',
            error: err,
          });
        }

        return callback({
          status: Consts.httpCodeSuccess,
          message: 'Customer created successfully',
          data: data,
        });
      }
    );
  }

  

}

export default CustomerLogic;




