import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/client-sequelize.js';

class Event extends Model {
    static init(sequelize) {
        super.init(
            {
                name: {
                    type: DataTypes.STRING,
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
                    onDelete: 'CASCADE'
                },
                max_price: {
                    type: DataTypes.INTEGER,
                    allowNull: true
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
