import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/client-sequelize.js';

class Event_user extends Model {
    static init(sequelize) {
      super.init(
        {
          event_id: {
            type: DataTypes.INTEGER,
            references: { model: 'Event', key: 'id' },
            allowNull: false,
          },
          user_id: {
            type: DataTypes.INTEGER,
            references: { model: 'User', key: 'id' },
            allowNull: false,
          },
          receiver_id: {
            type: DataTypes.INTEGER,
            references: { model: 'User', key: 'id' },
            allowNull: true, 
          },
        },
        {
          sequelize,
          modelName: 'Event_user',
          tableName: 'event_user',
        }
      );
    }
  }

Event_user.init(sequelize);

export default Event_user;