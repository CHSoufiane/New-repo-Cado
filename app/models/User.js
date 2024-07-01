import { Model, DataTypes } from 'sequelize';
import sequelize from './db/client-sequelize.js';

class User extends Model {
    static init(sequelize) {
        super.init(
            {
                // Define the model attributes
                userName: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                email: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true
                },
                password: {
                    type: DataTypes.STRING,
                    allowNull: true
                }
            },
            {
                sequelize,
                modelName: 'User',
                tableName: 'users'
            }
        );
    }
}

User.init(sequelize);

export default User;