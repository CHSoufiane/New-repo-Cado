import { Model, DataTypes } from "sequelize";
import sequelize from "../db/client-sequelize.js";

class Draw extends Model {
  static init(sequelize) {
    super.init(
      {
        event_id: {
          type: DataTypes.INTEGER,
          references: {
            model: "Event",
            key: "id",
          },
          allowNull: false,
        },
        giver_id: {
          type: DataTypes.INTEGER,
          references: {
            model: "User",
            key: "id",
          },
          allowNull: false,
        },
        receiver_id: {
          type: DataTypes.INTEGER,
          references: {
            model: "User",
            key: "id",
          },
          allowNull: true,


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
