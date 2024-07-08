import event-Users from '../models/event_Users.model.js';

const event_usersController = {

    async event_user_list (req, res) {
    try { 
        const getAllUsers = await event_Users.findAll();
            }
    }
}