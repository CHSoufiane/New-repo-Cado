import { Event, User } from '../models/index.js';
import  Draw  from '../models/Draw.js';
import  draw  from '../utils/draw.js';
import sequelize from '../db/client-sequelize.js';
import jwt from 'jsonwebtoken';


const eventController = {
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
    const { name, date, participants, organizer_id} = req.body;
    try {
      const event = await Event.create({ name, date, organizer_id });
  
      // Add participants to the event
      for (const participant of participants) {
        let user = await User.findOne({ where: { email: participant.email } });
  
        if (!user) {
          const token = jwt.sign({ email: participant.email }, `${process.env.JWT_SECRET_KEY}`);
          user = await User.create({
            name: participant.name,
            email: participant.email,
            is_registered: false,
            token: token
          });
        }
  
        // Link user to the Event
        await event.addParticipants(user);
      }
      await eventController.eventDraw({ params: { id: event.id } }, res);
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
      res.status(500).json({ message: "Internal server error" });
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
        message: `Event: ${event.id} / ${event.name} deleted`,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async eventDraw(req, res) {
    const eventId = req.params.id;

    try {
      const event = await Event.findByPk(eventId, {
        include: {
          model: User,
          as: "participants",
          through: { attributes: [] },
          attributes: ["id" ,"name"],
        },
      });

      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      const participantsNames = event.participants.map((user) => user.name);

      const drawResult = draw(participantsNames);

      const transaction = await sequelize.transaction();

      try {
        for (const [giverName, receiverName] of Object.entries(drawResult)){
          const giver = event.participants.find((user) => user.name === giverName);
          const receiver = event.participants.find((user) => user.name === receiverName);

          if (giver && receiver){
            await Draw.create({
              event_id: eventId,
              giver_id: giver.id,
              receiver_id: receiver.id,
            }, { transaction });
          } else {
            throw new Error(`User not found for giver: ${giverName} or receiver: ${receiverName}`);
          }
        }
        await transaction.commit();
        console.log('Draw successfully inserted');
        return res.status(200).json({ drawResult });
      } catch(error){
        console.error(error.message);
        return res.status(500).json({ message: "Internal server error" });
      }

    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Internal server error" });
    }

  },
};

export default eventController;
