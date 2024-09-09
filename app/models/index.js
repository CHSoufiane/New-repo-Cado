import Event from "./Event.js";
import User from "./User.js";
import Event_user from "./Event_user.js";
import Draw from "./Draw.js";

User.hasMany(Event, {
  foreignKey: "organizer_id",
  as: "events"
});

User.belongsToMany(Event, {
  as: "participations",
  through: Event_user,
  foreignKey: "user_id",
  otherKey: "event_id"
});

User.hasMany(Event_user, {
  foreignKey: 'user_id',
  as: 'users'
});

User.hasMany(Draw, {
  foreignKey: "giver_id",
  as: "givenDraws"
});

User.hasMany(Draw, {
  foreignKey: "receiver_id",
  as: "receivedDraws"
});

Event.belongsTo(User, {
  foreignKey: "organizer_id",
  as: "user"
});

Event.belongsToMany(User, {
  as: "participants",
  through: Event_user,
  foreignKey: "event_id",
  otherKey: "user_id"
});

Event.hasMany(Draw, {
  foreignKey: "event_id",
  as: "draws"
});

Draw.belongsTo(User, {
  as: "giver",
  foreignKey: "giver_id"
});

Draw.belongsTo(User, {
  as: "receiver",
  foreignKey: "receiver_id"
});

Draw.belongsTo(Event, { 
  foreignKey: "event_id",
  as: "event"
});

export { Event, User, Event_user, Draw };