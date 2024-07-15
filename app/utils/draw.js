import Draw from "../models/Draw.js";
import { Event, User } from "../models/index.js";

function draw(participantsNames) {
  function shuffle(participantsNames) {
    for (let i = participantsNames.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [participantsNames[i], participantsNames[j]] = [
        participantsNames[j],
        participantsNames[i],
      ];
    }
    return participantsNames;
  }
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

async function makeDraw(participantsNames) {
  const eventId = req.params.id;

  try {
    const event = await Event.findByPk(eventId, {
      include: {
        model: User,
        as: "participants",
        through: { attributes: [] },
        attributes: ["id", "name"],
      },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const participantsNames = event.participants.map((user) => user.name);

    const drawResult = draw(participantsNames);

    const transaction = await sequelize.transaction();

    try {
      for (const [giverName, receiverName] of Object.entries(drawResult)) {
        const giver = event.participants.find(
          (user) => user.name === giverName
        );
        const receiver = event.participants.find(
          (user) => user.name === receiverName
        );

        if (giver && receiver) {
          await Draw.create(
            {
              event_id: eventId,
              giver_id: giver.id,
              receiver_id: receiver.id,
            },
            { transaction }
          );
        } else {
          throw new Error(
            `User not found for giver: ${giverName} or receiver: ${receiverName}`
          );
        }
      }
      await transaction.commit();
      console.log("Draw successfully inserted");
      return res.status(200).json({ drawResult });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


export { draw, makeDraw };