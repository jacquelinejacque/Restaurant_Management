import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import User from '../Models/User.js';
import Customer from '../Models/Customer.js';

dotenv.config();

class DatabaseManager {
  constructor() {
    this.sequelize = null;
    this.user = null;
    this.customer = null;
  }

  connect(callback) {
    try {
      const timezone = 'Africa/Nairobi';
      this.sequelize = new Sequelize(
        process.env.DATABASE_NAME,
        process.env.DATABASE_USER,
        process.env.DATABASE_PASSWORD,
        {
          host: process.env.DATABASE_HOST,
          dialect: process.env.DATABASE_DIALECT,
          logging: false,
        }
      );

      this.sequelize
        .authenticate()
        .then(() => {
          console.log('Connection has been established successfully.');
          this.initModels(() => callback(null, this.sequelize));
        })
        .catch((error) => {
          console.error('Unable to connect to the database:', error);
          callback(error, this.sequelize);
        });
    } catch (e) {
      console.error('Error in connect method:', e);
      callback(e, null);
    }
  }

  initModels(callback) {
    try {
      // Initialize models
      this.user = User.init(this.sequelize);
      this.customer = Customer.init(this.sequelize);

      // Set up relationships
      this.createRelationships();

      console.log('User and Customer models initialized:', this.user !== null, this.customer !== null);

      this.sequelize
        .sync({ alter: false })
        .then(() => {
          console.log('Tables created!');
          callback(1);
        })
        .catch((error) => {
          console.error('Unable to create tables:', error);
          callback(0);
        });
    } catch (error) {
      console.error('Error in initModels method:', error);
      callback(0);
    }
  }

  createRelationships() {
    try {
      // Define relationships
      this.user.belongsTo(this.customer, {
        as: 'customer',
        foreignKey: { name: 'customerID', allowNull: true },
      });

      this.customer.hasMany(this.user, {
        as: 'users',
        foreignKey: { name: 'customerID', allowNull: true },
      });
    } catch (error) {
      console.error('Error in createRelationships method:', error);
    }
  }
}

export default new DatabaseManager();
