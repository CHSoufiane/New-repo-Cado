
import { Event, User, Draw } from "../models/index.js";
import sequelize from "../db/client-sequelize.js";



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
  function draw(participantsNames) {

  if (participantsNames.length < 2) {
    throw new Error("Sorry, we need at least 2 participants to make a draw");
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

async function makeDraw(req, res) {

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
  console.log(event);
    if (!event) {
      throw new Error("Event not found");
    }

    const participantsNames = event.participants.map((user) => user.name);

    const result = draw(participantsNames);

    const transaction = await sequelize.transaction();

    try {
      for (const [giverName, receiverName] of Object.entries(result)) {
        const giver = event.participants.find(
          (user) => user.name === giverName
        );
        const receiver = event.participants.find(
          (user) => user.name === receiverName
        );

        if (!giver || !receiver) {
          console.error(`User not found: giver - ${giverName}, receiver - ${receiverName}`);
          throw new Error(`User not found: giver - ${giverName}, receiver - ${receiverName}`);
        }

        console.log(`Creating Draw: event_id - ${eventId}, giver_id - ${giver.id}, receiver_id - ${receiver.id}`);

        await Draw.create(
          {
            event_id: eventId,
            giver_id: giver.id,
            receiver_id: receiver.id
          },
          { transaction }
        );
      }

      await transaction.commit();

      return { result, message: "Draw successful" };
    } catch (error) {
      console.error("return result", error.message);
      await transaction.rollback();
      console.error("Transaction error: ", error.message);
      throw new Error("Internal server error");
    }
  } catch (error) {
    console.error("Get draw error: ", error.message);
    throw new Error("Internal server error de ouf ");
  }
}

export { draw, makeDraw };

// import { Event, User, Draw } from "../models/index.js";
// import sequelize from "../db/client-sequelize.js";



  function shuffle(eventUser) {
    for (let i = eventUser.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [eventUser[i], eventUser[j]] = [eventUser[j], eventUser[i]];
    }
    return eventUser;
}

    // be sure to have a minimum of users
function draw(eventUser) {
    if (eventUser.length < 2) {
        throw new Error("désolé, il doit y avoir au minimum 2 personnes pour faire un tirage");
    }

    let givers = [...eventUser]; // Spread Syntax
    let receivers = shuffle([...eventUser]);

    // No one can give a gift to himself
    for (let i = 0; i < givers.length; i++) {
        if (givers[i] === receivers[i]) {
            return draw(eventUser);
        }
    }

    // 2 users can't give a gift to each other
    for (let i = 0; i < givers.length; i++) {
        for (let j = 0; j < receivers.length; j++) {
            if (givers[i] === receivers[j] && givers[j] === receivers[i]) {
                return draw(eventUser);
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

export { draw, shuffle };

