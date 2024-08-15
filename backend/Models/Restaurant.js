import { DataTypes } from "sequelize";

class Restaurant {
    static init(sequelize) {
        return sequelize.define("Restaurant", {
            restaurantID: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            location: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            phone: {
                type: DataTypes.STRING,
            },
            status: {
                type: DataTypes.ENUM('active', 'inactive'),
                defaultValue: 'active',
                allowNull: false,  // This ensures that status cannot be null
            },
        });
    }
}

export default Restaurant;
