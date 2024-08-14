import jwt from 'jsonwebtoken';
import async from 'async';
import { Consts } from '../lib/Consts.js';
import bcrypt from 'bcryptjs';
import Utils from '../lib/Utils.js';
import DatabaseManager from '../lib/DatabaseManager.js';
import { v4 as uuidv4 } from 'uuid';

class UserLogic {
  static create(body, callback) {
    if (!DatabaseManager.user || !DatabaseManager.customer) {
      callback({
        status: 500,
        message: 'Database models are not initialized properly.',
      });
      return;
    }

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
          if (Utils.isEmpty(body.password)) {
            done('Password is required');
            return;
          }
          if(body.password < 6){
            done('password must be atleast 6 characters');
            return;
          }

          DatabaseManager.user
            .findOne({
              where: {
                email: body.email,
              },
            })
            .then((res) => {
              if (res) {
                done('User with similar details already exists');
                return;
              }
              done(null);
            })
            .catch((err) => {
              done(err);
            });
        },
        // Step 2: Create Customer if UserType is Customer
        function (done) {
          if (body.userType === 'customer') {
            // Generate customerID if not provided
            const customerID = Utils.isEmpty(body.customerID) ? uuidv4() : body.customerID;

            // Create the customer in the Customers table with all necessary fields
            DatabaseManager.customer
              .create({
                customerID: customerID,
                name: body.name,  // Use the user's name for the customer
                phone: body.phone,
                email: body.email,
                creditCardNumber: body.creditCardNumber // Ensure the credit card number is provided
              })
              .then((customer) => {
                body.customerID = customer.customerID; // Set the customerID in the body to use it when creating the user
                done(null);
              })
              .catch((err) => {
                done(err);
              });
          } else {
            done(null); // Skip customer creation for non-customer user types
          }
        },
        // Step 3: Create User
        function (done) {
          const params = {
            name: body.name,
            phone: body.phone,
            email: body.email,
            password: bcrypt.hashSync(body.password, 8),
            userType: body.userType,
            customerID: body.userType === 'customer' ? body.customerID : null, // Include customerID if userType is customer
            creditCardNumber: body.userType === 'customer' ? body.creditCardNumber : null, // Include creditCardNumber if userType is customer
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

  static login(body, callback) {
    async.waterfall(
      [
        // Step 1: Find user by email
        function (done) {
          DatabaseManager.user
            .findOne({
              attributes: [
                "userID",
                "name",
                "phone",
                "email",
                "password",
                "userType",
                "customerId",
              ],
              where: {
                email: body.email,
              },
            })
            .then((user) => {
              if (!user) {
                return done("User not found with this email.");
              }
              done(null, user);
            })
            .catch((err) => {
              console.error("Error finding user by email:", err);
              done(err);
            });
        },
        // Step 2: Validate password and generate session
        function (user, done) {
          if (bcrypt.compareSync(body.password, user.password)) {
            // Generate and update a session
            const params = {
              session: Utils.randomString(40),
              expiry: Utils.addTimeToDate(0, 0, 1, 0, 0),
            };

            DatabaseManager.user
              .update(params, {
                where: {
                  email: user.email,
                },
              })
              .then(() => {
                done(null, user);
              })
              .catch((err) => {
                console.error("Error updating user session:", err);
                done(err);
              });
          } else {
            done("Invalid credentials: Incorrect password.");
          }
        },
        // Step 3: Fetch updated user and generate JWT token
        function (user, done) {
          DatabaseManager.user
            .findOne({
              attributes: [
                "userID",
                "name",
                "phone",
                "session",
                "email",
                "expiry",
                "userType",
                "customerId",
              ],
              where: {
                email: user.email,
              },
            })
            .then((updatedUser) => {
              const jwtToken = jwt.sign(
                {
                  session: updatedUser.session,
                  expiry: updatedUser.expiry,
                  name: updatedUser.name,
                  email: updatedUser.email,
                  userType: updatedUser.userType,
                },
                process.env.JWT_KEY,
                { expiresIn: process.env.JWT_EXPIRY_TIME }
              );
              done(null, jwtToken, updatedUser);
            })
            .catch((err) => {
              console.error("Error fetching updated user details:", err);
              done(err);
            });
        },
        // Step 4: Fetch customer details if userType is 'customer'
        function (token, user, done) {
          if (user.userType === "customer" && user.customerId) {
            DatabaseManager.customer
              .findOne({
                attributes: ["creditCardNumber"],
                where: {
                  customerID: user.customerId,
                },
              })
              .then((customer) => {
                user.customerDetails = customer;
                done(null, token, user);
              })
              .catch((err) => {
                console.error("Error fetching customer details:", err);
                done(err);
              });
          } else {
            done(null, token, user);
          }
        },
      ],
      // Final callback
      function (err, token, user) {
        if (err) {
          console.error("Error during login process:", err);
          return callback({
            status: Consts.httpCodeSeverError,
            message: "Failed to login",
            error: err,
          });
        }

        return callback({
          status: Consts.httpCodeSuccess,
          token: token,
          data: user,
        });
      }
    );
  }



}

export default UserLogic;







