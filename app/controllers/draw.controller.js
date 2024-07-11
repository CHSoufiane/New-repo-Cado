import { Event, User } from '../models/index.js';
import  Draw  from '../models/Draw.js';


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
        ]
      });
      return res.status(200).json(allDraws);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async getOneDraw(req, res) {
    try {
      const draw = await Draw.findByPk(req.params.id,{
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
        ]
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
      // const participantsNames = allEvents.flatMap(event => event.participants
      //   .map(participant => participant.name));

      return res.json(participants);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

export default drawController;

// function shuffle(eventUser) {
//     for (let i = eventUser.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [eventUser[i], eventUser[j]] = [eventUser[j], eventUser[i]];
//     }
//     return eventUser;
// }

//     // be sure to have a minimum of users
// function draw(eventUser) {
//     if (eventUser.length < 2) {
//         throw new Error("désolé, il doit y avoir au minimum 2 personnes pour faire un tirage");
//     }

//     let givers = [...eventUser]; // Spread Syntax
//     let receivers = shuffle([...eventUser]);

//     // No one can give a gift to himself
//     for (let i = 0; i < givers.length; i++) {
//         if (givers[i] === receivers[i]) {
//             return draw(eventUser);
//         }
//     }

//     // 2 users can't give a gift to each other
//     for (let i = 0; i < givers.length; i++) {
//         for (let j = 0; j < receivers.length; j++) {
//             if (givers[i] === receivers[j] && givers[j] === receivers[i]) {
//                 return draw(eventUser);
//             }
//         }
//     }
//     // configure a pair of giver and receiver
//     let pairs = {};
//     for (let i = 0; i < givers.length; i++) {
//         pairs[givers[i]] = receivers[i];
//     }

//     return pairs;
// }
