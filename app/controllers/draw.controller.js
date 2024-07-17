import { Event, User, Draw } from "../models/index.js";

const drawController = {
  
  async getReceiverByGiverAndEvent(req, res) {
    const giverId = req.params.user_id;
    const eventId = req.params.event_id;

    try {
      // Récupérer l'événement pour obtenir les noms des participants
      const event = await Event.findByPk(eventId, {
        include: {
          model: User,
          as: "participants",
          attributes: ["id", "name"], // Assurez-vous de sélectionner les attributs nécessaires
        },
      });

      if (!event) {
        return res.status(404).json({ message: "Événement non trouvé" });
      }

      // Récupérer les noms des participants à partir de l'événement
      const participantsNames = event.participants.map(
        (participant) => participant.name
      );

      // Recherche des tirages en fonction du donneur (giverId) et de l'événement (eventId)
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

// Extract MakeDraw vers un fichier séparé

// extraire les infos du receveur en fonction d'un giver dans un event précis
