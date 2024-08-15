import { Event, User, Draw } from "../models/index.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";
import { findSecretSantaMatch }  from "../utils/draw.js";

export default {
  async createEvent(req, res) {
    const { name, date, organizer_id } = req.body;
    try {
      const event = await Event.create({
        name,
        date,
        organizer_id,
      });
      return res.status(201).json(event);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  async createEventWithParticipants(req, res) {
    const { name, date, participants, organizer_id } = req.body;
    try {
      const event = await Event.create({ name, date, organizer_id });
  
      // Add participants to the event
      let eventUsers = [];
      for (const participant of participants) {
        let user = await User.findOne({ where: { email: participant.email } });
  
        if (!user) {
          const token = jwt.sign({ email: participant.email }, `${process.env.JWT_SECRET}`);
          user = await User.create({
            name: participant.name,
            email: participant.email,
            is_registered: false,
            token: token
          });
        }
  
        // Link user to the Event
        await event.addParticipants(user);
        const signedLink = `http://localhost:5173/view/${user.token}`;
        const subject = "Vous avez été invité à participer sur Cad'O";
        const html = `Bonjour ${user.name}, tu as été invité à participer sur Cad'O! ! Clique sur le lien pour voir le résultat du tirage au sort ${signedLink}`;
        sendEmail(user.email, subject, html);
      }
  
      res
        .status(201)
        .json({
          message: "Event and participants created successfully",
          event,
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  async getEvents(req, res) {
    try {
      const allEvents = await Event.findAll({
        include: {
          model: User,
          as: "participants",
          through: { attributes: [] },
          attributes: ["name", "email"],
        },
      });

      const formattedEvents = allEvents.map((event) => {
        const eventData = event.toJSON();
        const { participants, createdAt, updatedAt, ...rest } = eventData;
        return {
          ...rest,
          participants,
          createdAt,
          updatedAt,
        };
      });
      return res.status(200).json(formattedEvents);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async getOneEvent(req, res) {
    try {
      const event = await Event.findByPk(req.params.id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      return res.status(200).json(event);
    } catch (error) {
      res.status(404).json({ message: "Event not found" });
    }
  },

  async updateEvent(req, res) {
    const { id } = req.params;
    const { name, date, organizer_id } = req.body;
    try {
      const event = await Event.findByPk(id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      await event.update({
        name,
        date,
        organizer_id,
      });
      return res.status(200).json({ message: "Event updated", event });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async deleteEvent(req, res) {
    try {
      const event = await Event.findByPk(req.params.id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      await event.destroy();
      return res.json({
        message: ` Event: ${event.id} / ${event.name} deleted`,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async getResults(req, res){
    const { token } = req.params;

    try {
      const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);
      const email = decoded.email;
  
      // Assuming you have a method to find the Secret Santa match
      const match = await findSecretSantaMatch(email);
  
      res.json((match));
    } catch (error) {
      console.error(error.message)
      res.status(400).send('Invalid or expired token');
    }
  },
};

// Assuming this function is implemented elsewhere

