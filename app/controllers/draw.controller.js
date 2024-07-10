import { Event, User } from "../models/index.js";
import Draw from "../models/Draw.js";

const drawController = {
  async createDraw(req, res) {
    const { event_id, giver_id, receiver_id } = req.body;
    try {
      const draw = await Draw.create({
        event_id,
        giver_id,
        receiver_id,
      });
      return res.status(201).json(draw);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async getDraws(req, res) {
    try {
      const allDraws = await Draw.findAll();
      return res.status(200).json(allDraws);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async getOneDraw(req, res) {
    try {
      const draw = await Draw.findByPk(req.params.id);
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
  async getParticipants(req, res) {
    try {
      const allEvents = await Event.findAll({
        include: {
          model: User,
          as: "participants",
          through: { attributes: [] },
          attributes: ["name"],
        },
      });

      const participantsNames = allEvents.flatMap((event) =>
        event.participants.map((participant) => participant.name)
      );

      return res.json(participantsNames);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  // async drawParticipants(req, res) {
    
  //   function shuffle(participantsNames) {
  //     for (let i = participantsNames.length - 1; i > 0; i--) {
  //       const j = Math.floor(Math.random() * (i + 1));
  //       [participantsNames[i], participantsNames[j]] = [
  //         participantsNames[j],
  //         participantsNames[i],
  //       ];
  //     }
  //     return participantsNames;
  //   }
    
  //   // be sure to have a minimum of users
  //   function draw(participantsNames) {
  //     if (participantsNames.length < 2) {
  //       throw new Error(
  //         "désolé, il doit y avoir au minimum 2 personnes pour faire un tirage"
  //       );
  //     }
    
  //     let givers = [...participantsNames]; // Spread Syntax
  //     let receivers = shuffle([...participantsNames]);
    
  //     // No one can give a gift to himself
  //     for (let i = 0; i < givers.length; i++) {
  //       if (givers[i] === receivers[i]) {
  //         return draw(participantsNames);
  //       }
  //     }
  //     // configure a pair of giver and receiver
  //     let pairs = {};
  //     for (let i = 0; i < givers.length; i++) {
  //       pairs[givers[i]] = receivers[i];
  //     }
    
  //     return pairs;
  //   }

  // },
};

export default drawController;




  // async updateDraw(req, res) {
  //   const { id } = req.params;
  //   const { event_id, giver_id, receiver_id } = req.body;
  //   try {
  //     const draw = await Draw.findByPk(id);
  //     if (!draw) {
  //       return res.status(404).json({ message: "Draw not found" });
  //     }

  //     await draw.update({
  //       event_id,
  //       giver_id,
  //       receiver_id,
  //     });
  //     return res.status(200).json({ message: "Draw updated", draw });
  //   } catch (error) {
  //     res.status(500).json({ message: "Internal server error" });
  //   }
  // },