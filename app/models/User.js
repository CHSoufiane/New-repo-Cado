import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/client-sequelize.js';

class User extends Model {
    static init(sequelize) {
        super.init(
            {
                name: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                email: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    unique: true
                },
                password: {
                    type: DataTypes.INTEGER,
                    allowNull: true
                },
                is_registered: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: false
                },
                token: {
                    type: DataTypes.INTEGER,
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
