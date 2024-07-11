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

  async eventDraw(req, res) {
    const eventId = req.params.id;

    try {
      const event = await Event.findByPk(eventId, {
        include: {
          model: User,
          as: "participants",
          through: { attributes: [] },
          attributes: ["name"],
        },
      });

      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      const participantsNames = event.participants.map((user) => user.name);

      const drawResult = draw(participantsNames);
      return res.status(200).json({ drawResult });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }

    function draw(participantsNames) {
      if (participantsNames.length < 2) {
        throw new Error(
          "désolé, il doit y avoir au minimum 2 personnes pour faire un tirage"
        );
      }

      let givers = [...participantsNames]; // Spread Syntax
      let receivers = shuffle([...participantsNames]);

      // No one can give a gift to himself
      for (let i = 0; i < givers.length; i++) {
        if (givers[i] === receivers[i]) {
          return draw(participantsNames);
        }
      }

      // 2 participants can't give a gift to each other
      for (let i = 0; i < givers.length; i++) {
        for (let j = 0; j < receivers.length; j++) {
          if (givers[i] === receivers[j] && givers[j] === receivers[i]) {
            return draw(participantsNames);
          }
        }
      }

      // configure a pair of giver and receiver
      let pairs = {};
      for (let i = 0; i < givers.length; i++) {
        pairs[givers[i]] = receivers[i];
      }

      return pairs;
    }
  },
};

export default eventController;
