import Event from "./Event.js";
import User from "./User.js";

User.hasMany(Event, {
    foreignKey: 'organizer_id',
    as: 'events'
});

Event.belongsTo(User, {
    foreignKey: 'organizer_id',
    as: 'user'
});

export default { Event, User };