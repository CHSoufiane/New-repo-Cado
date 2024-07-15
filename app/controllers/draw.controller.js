import { Event, User } from "../models/index.js";
import Draw from "../models/Draw.js";
import { getDraw } from "../utils/draw.js";

const drawController = {




  async makeDraw(req, res) {

    const event = req.params.id;
      try {

      const drawResult = await getDraw(event.participants);

      return res.status(200).json(drawResult);

    }
    catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async getDrawByGiver(req, res) {
    const user = req.params.id;

    try {
      const user = await User.findByPk(user);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const getDrawReceiver = await Draw.findAll({
        where: { giver_id: user },
        include: [
          { model: User, as: "receiver", attributes: ["name", "email"] },
          { model: Event, as: "event", attributes: ["name", "date"] },
        ],
      });

      return res.status(200).json(getDrawReceiver);
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


