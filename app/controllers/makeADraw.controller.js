const eventUser = [anais, yoan, yanis, estelle, soufiane];
console.log(eventUser);

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