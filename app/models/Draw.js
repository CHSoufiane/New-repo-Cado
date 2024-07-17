import { Model, DataTypes } from "sequelize";
import sequelize from "../db/client-sequelize.js";

class Draw extends Model {
  static init(sequelize) {
    super.init(
      {
        // Define the model attributes
        event_id: {
          type: DataTypes.STRING,
          references: {
            model: "Event",
            key: "id",
          },
          allowNull: false,
        },

        giver_id: {
          type: DataTypes.STRING,
          references: {
            model: "User",
            key: "id",
          },
          allowNull: false,
        },

        receiver_id: {
          type: DataTypes.STRING,
          references: {
            model: "User",
            key: "id",
          },
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "Draw",
        tableName: "draw",
      }
    );
  }
}

Draw.init(sequelize);

export default Draw;
