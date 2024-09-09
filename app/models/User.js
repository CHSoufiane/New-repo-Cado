import { Model, DataTypes } from 'sequelize';
import sequelize from './db/client-sequelize.js';

class User extends Model {
    static init(sequelize) {
        super.init(
            {
                // Define the model attributes
                name: {
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
                },
                is_registered: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: false
                },
                token: {
                    type: DataTypes.STRING,
                    allowNull: false
                }
            },
            {
                sequelize,
                modelName: 'User',
                tableName: 'user'
            }
        );
    }
}

User.init(sequelize);

export default User;