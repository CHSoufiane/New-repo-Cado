import { Event, User } from "../models/index.js";
import Draw from "../models/Draw.js";


const drawController = {




  async makeDraw(req, res) {


    
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



// Extract MakeDraw vers un fichier séparé 

// extraire les infos du receveur en fonction d'un giver dans un event précis 