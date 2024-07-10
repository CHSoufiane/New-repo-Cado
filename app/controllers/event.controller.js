import { Event, User } from "../models/index.js";

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
};

export default eventController;
