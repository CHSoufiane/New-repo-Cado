function shuffle(eventUser) {
  for (let i = eventUser.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [eventUser[i], eventUser[j]] = [eventUser[j], eventUser[i]];
  }
  return eventUser;
}

  // Être sur d'avoir au moins deux participants
function draw(eventUser) {
  if (eventUser.length < 2) {
      throw new Error
      ("désolé, il doit y avoir au minimum 2 participants");
  }

  let givers = [...eventUser];
  let receivers = shuffle([...eventUser]);

  // Un utilisateur ne peut pas s'offrir de cadeau
  for (let i = 0; i < givers.length; i++) {
      if (givers[i] === receivers[i]) {
          return draw(eventUser);
      }
  }

  // 2 utilisateurs ne peuvent pas s'offrir de cadeaux
  for (let i = 0; i < givers.length; i++) {
      for (let j = 0; j < receivers.length; j++) {
          if (givers[i] === receivers[j] && givers[j] === receivers[i]) {
              return draw(eventUser);
          }
      }
  }
  // Créer les paires donneurs / receveurs
  let pairs = {};
  for (let i = 0; i < givers.length; i++) {
      pairs[givers[i]] = receivers[i];
  }

  return pairs;
}

export { draw, shuffle };