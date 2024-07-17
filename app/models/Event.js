import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/client-sequelize.js';

class Event extends Model {
    static init(sequelize) {
        super.init(
            {
                // Define the model attributes
                name: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                date: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    
                },
                organizer_id: {
                    type: DataTypes.INTEGER,
                    references: {
                        model: 'User',
                        key: 'id'
                    },
                    allowNull: false,
                    onDelete: 'CASCADE'  // Automatically delete associated user when event is deleted
                }
            },
            {
                sequelize,
                modelName: 'Event',
                tableName: 'event'
            }
        );
    }
}

Event.init(sequelize);

export default Event;