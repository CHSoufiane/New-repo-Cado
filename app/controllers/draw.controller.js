import { Event, User } from "../models/index.js";
import Draw from "../models/Draw.js";
import draw from "../utils/draw.js";

const drawController = {

  async makeDraw(req, res) {
    const eventId = req.params.id;

    try {
      const event = await Event.findByPk(eventId, {
        include: {
          model: User,
          as: "participants",
          through: { attributes: [] },
          attributes: ["id", "name"],
        },
      });

      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      const participantsNames = event.participants.map((user) => user.name);

      const drawResult = draw(participantsNames);

      const transaction = await sequelize.transaction();

      try {
        for (const [giverName, receiverName] of Object.entries(drawResult)) {
          const giver = event.participants.find(
            (user) => user.name === giverName
          );
          const receiver = event.participants.find(
            (user) => user.name === receiverName
          );

          if (giver && receiver) {
            await Draw.create(
              {
                event_id: eventId,
                giver_id: giver.id,
                receiver_id: receiver.id,
              },
              { transaction }
            );
          } else {
            throw new Error(
              `User not found for giver: ${giverName} or receiver: ${receiverName}`
            );
          }
        }
        await transaction.commit();
        console.log("Draw successfully inserted");
        return res.status(200).json({ drawResult });
      } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Internal server error" });
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async getDrawByUser(req, res) {
    const user = req.params.id;

    try {
      const userAsGiverDraws = await Draw.findAll({
        where: { giver_id: user },
        include: [
          { model: User, as: "receiver", attributes: ["name", "email"] },
          { model: Event, as: "event", attributes: ["name", "date"] },
        ],
      });

      const userAsReceiverDraws = await Draw.findAll({
        where: { receiver_id: user },
        include: [
          { model: User, as: "giver", attributes: ["name", "email"] },
          { model: Event, as: "event", attributes: ["name", "date"] },
        ],
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ userAsGiverDraws, userAsReceiverDraws });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Internal server error" });
    }

  },

  async getDraws(req, res) {
    try {
      const allDraws = await Draw.findAll({
        include: [
          {
            model: User,
            as: "giver",
            attributes: ["name"],
          },
          {
            model: User,
            as: "receiver",
            attributes: ["name"],
          },
        ],
      });
      return res.status(200).json(allDraws);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async getOneDraw(req, res) {
    try {
      const draw = await Draw.findByPk(req.params.id, {
        include: [
          {
            model: User,
            as: "giver",
            attributes: ["name"],
          },
          {
            model: User,
            as: "receiver",
            attributes: ["name"],
          },
        ],
      });
      if (!draw) {
        return res.status(404).json({ message: "Draw not found" });
      }
      return res.status(200).json(draw);
    } catch (error) {
      res.status(404).json({ message: "Draw not found" });
    }
  },

  async deleteDraw(req, res) {
    try {
      const draw = await Draw.findByPk(req.params.id);
      if (!draw) {
        return res.status(404).json({ message: "Draw not found" });
      }
      await draw.destroy();
      return res.json({ message: ` Draw: ${draw.id} / ${draw.name} deleted` });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

export default drawController;

// try {
//   const user = await User.findByPk(req.params.id, {
//     include: [
//       {
//         model: Draw,
//         as: "draws",
//         attributes: ["id"],
//         include: [
//           {
//             model: User,
//             as: "giver",
//             attributes: ["name"],
//           },
//           {
//             model: User,
//             as: "receiver",
//             attributes: ["name"],
//           },
//         ],
//       },
//     ],
//   });
