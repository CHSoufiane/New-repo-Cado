import Event from "./Event.js";
import User from "./User.js";

User.hasMany(Event, {
    foreignKey: 'user_id',
    as: 'events'
});

Event.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

export default { Event, User };