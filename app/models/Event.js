import { Model, DataTypes } from 'sequelize';
import sequelize from './db/client-sequelize.js';

class Event extends Model {
    static init(sequelize) {
        super.init(
            {
                // Define the model attributes
                name: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                date: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    
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