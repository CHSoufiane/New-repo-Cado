import { Event, User, Draw } from '../models/index.js';


const drawController = {
  async getParticipantsFromAnEvent(req, res) {
    try {
      const event = await Event.findByPk(req.params.id,{
        include: {
          model: User,
          as: "participants",
          through: { attributes: [] },
          attributes: ["name"],
        },
      });
      const participants = event.participants.map(participant => participant.name);

      return res.json(participants);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  },
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