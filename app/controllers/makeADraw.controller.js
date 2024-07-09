import User from "../models/user";
import Event from "../models/event";

export default {
  async getEvents(req, res) {
    try {
      const allEvents = await Event.findAll({
        include: {
          model: User,
          as: "participants",
          through: { attributes: [] },
          attributes: ["name"],
        },
      });
      const getUsersNames = allEvents.map((event) => {
        const participants = event.participants.map((user) => ({
          name: user.name,
        }));
        return {
          ...event.toJSON(),
          participants,
        };
      });

      return res.status(200).json(getUsersNames);
    } catch (error) {}
    res.status(500).json({ message: "Internal server error" });
  },
};

function shuffle(_participants) {
  for (let i = _participants.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [_participants[i], _participants[j]] = [_participants[j], _participants[i]];
  }
  return _participants;
}

// be sure to have a minimum of users
function draw(allEvents) {
    if (allEvents.length < 2) {
    throw new Error(
      "désolé, il doit y avoir au minimum 2 personnes pour faire un tirage"
    );
  }

  let givers = [...participants]; // Spread Syntax
  let receivers = shuffle([...participants]);

  // No one can give a gift to himself
  for (let i = 0; i < givers.length; i++) {
    if (givers[i].name === receivers[i].name) {
      return draw(allEvents);
    }
  }

  // 2 users can't give a gift to each other
  for (let i = 0; i < givers.length; i++) {
    for (let j = 0; j < receivers.length; j++) {
      if (
        givers[i].name === receivers[j].name &&
        givers[j].name === receivers[i].name
      ) {
        return draw(allEvents);
      }
    }
  }
  // configure a pair of giver and receiver
  let pairs = {};
  for (let i = 0; i < givers.name; i++) {
    pairs[givers[i].name] = receivers[i].name;
  }

  return pairs;
};
