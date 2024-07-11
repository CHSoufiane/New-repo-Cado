export default function draw(participantsNames) {
    function shuffle(participantsNames) {
      for (let i = participantsNames.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [participantsNames[i], participantsNames[j]] = [participantsNames[j], participantsNames[i]];
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
  };