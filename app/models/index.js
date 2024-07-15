import Event from "./Event.js";
import User from "./User.js";
import Event_user from "./Event_user.js";
import Draw from "./Draw.js";

User.hasMany(Event, {
  foreignKey: "organizer_id",
  as: "events",
});

Event.belongsTo(User, {
  foreignKey: "organizer_id",
  as: "user",
});

Event.belongsToMany(User, {
  as: "participants",
  through: Event_user,
  foreignKey: "event_id",
  otherKey: "user_id",
});

User.belongsToMany(Event, {
  as: "participations",
  through: Event_user,
  foreignKey: "user_id",
  otherKey: "event_id",
});

Draw.belongsTo(User, {
  as: "giver",
  foreignKey: "giver_id",
});

Draw.belongsTo(User, {
  as: "receiver",
  foreignKey: "receiver_id",
});

Event.hasMany(Draw, {foreignKey: "event_id", as: "draws" });

Draw.belongsTo(Event, { foreignKey: "event_id", as: "event" });

User.hasMany(Event_user, { foreignKey: 'receiver_id', as: 'receivers' });

export { Event, User, Event_user, Draw };
