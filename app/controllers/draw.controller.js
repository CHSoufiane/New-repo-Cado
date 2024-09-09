import { Event, User } from "../models/index.js";
import Draw from "../models/Draw.js";
import { Event, User, Draw } from '../models/index.js';

const drawController = {
  async getReceiverFromAnEvent(req, res) {

    const eventId = req.params.id;
    const giverId = req.params.id;
    try {
      const event = await Event.findByPk(req.params.id, {
        include: {
          model: User,
          as: "participants",
          through: { attributes: [] },
          attributes: ["name"],
        },
      });

      const participants = event.participants.map(participant => participant.name);


      if (!event) {
        return res.status(404).json({ message: "Événement non trouvé" });
      }

      const participants = event.participants.map(
        (participant) => participant.name
      );

      const getReceiver = await Draw.findAll({
        where: { giver_id: giverId, event_id: eventId },
        include: [
          { model: User, as: "receiver", attributes: ["name", "email"] },
          { model: Event, as: "event", attributes: ["name", "date"] },
        ],
      });

      return res.status(200).json(getReceiver);
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ message: "Erreur interne du serveur" });
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
  async getDrawPair(req, res) {
    try {
      const token = req.params.token;
      const user = await User.findOne({ where: { token } });
  
      if (!user) {
        return res.status(404).json({ message: "User not found or token invalid" });
      }
  
      const drawPair = await Draw.findOne({ where: { giver_id: user.id } });
  
      if (!drawPair) {
        return res.status(404).json({ message: "Draw pair not found" });
      }
  
      // Récupérer les informations du receiver
      const receiverUser = await User.findByPk(drawPair.receiver_id);
  
      if (!receiverUser) {
        return res.status(404).json({ message: "Receiver not found" });
      }
  
      // Retourner les informations du pair et du receiver
      return res.json({
        giver: user.name,
        receiver: receiverUser.name,
        event_id: drawPair.event_id
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

export default drawController;
