import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/client-sequelize.js';
import User from './User.js';
import Event from './Event.js';

class Event_user extends Model {
    static init(sequelize) {
        super.init(
            {
                event_id: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    references: {
                        model: Event,
                        key: 'id',
                      },
                },
                user_id: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    references: {
                        model: Event,
                        key: 'id',
                      },
                },
            },
                
            {
                sequelize,
                modelName: 'Event_User',
                tableName: 'event_User'
            }
        );
        
    }
}

User.belongsToMany(Event, { through: Event_user, foreignKey: 'user_Id' });
Event.belongsToMany(User, { through: Event_user, foreignKey: 'event_Id' });

Event_user.init(sequelize);

export default Event_user;