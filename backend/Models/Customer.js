import { DataTypes } from "sequelize";

class Customer {
    static init (sequelize){
        return sequelize.define("Customers", {
            customerID: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            creditCardNumber: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            })
    }
}
export default Customer;