import { DataTypes } from "sequelize";

class User {
  static init(sequelize) {
    return sequelize.define("Users", {
      userID: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      session: {
        type: DataTypes.STRING,
      },
      expiry: {
        type: DataTypes.DATE,
      },
      userType: {
        type: DataTypes.ENUM('admin', 'customer'),
        allowNull: false,
      },
      customerID: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'Customers',
          key: 'customerID',
        },
      },
      creditCardNumber: {
        type: DataTypes.STRING,
        allowNull: true, // Only required for 'customer' userType
      },
      status: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ['active', 'deleted'],
        defaultValue: 'active',
      },
    }, {
      hooks: {
        beforeCreate: (user) => {
          if (user.userType === 'customer') {
            if (!user.creditCardNumber) {
              throw new Error("Credit card number is required for customer type");
            }
          } else {
            user.customerID = null; // Ensure customerID is only set for customer users
            user.creditCardNumber = null; // Ensure creditCardNumber is only set for customer users
          }
        },
      },
    });
  }
}

export default User;
