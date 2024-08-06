import async from 'async';
import { Consts } from '../lib/Consts.js';
import bcrypt from 'bcryptjs';
import Utils from '../lib/Utils.js';
import DatabaseManager from '../lib/DatabaseManager.js';

class UserLogic {
  static create(body, callback) {
    async.waterfall(
      [
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
          if (Utils.isEmpty(body.password)) {
            done('Password is required');
            return;
          }

          DatabaseManager.user
            .findOne({
              where: {
                email: body.email,
              },
            })
            .then((res) => {
              if (res != undefined) {
                done('User with similar details already exists');
                return;
              }
              done(null);
            })
            .catch((err) => {
              done(err);
            });
        },
        function (done) {
          var params = {
            name: body.name,
            phone: body.phone,
            email: body.email,
            password: bcrypt.hashSync(body.password, 8),
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
            status: Consts.httpCodeSeverError,
            message: 'Failed to create user',
            error: err,
          });
        }

        return callback({
          status: Consts.httpCodeSuccess,
          message: 'User created successfully',
          data: data,
        });
      }
    );
  }
}

export default UserLogic;
