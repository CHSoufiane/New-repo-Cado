import event-Users from '../models/event_Users.model.js';

const event_usersController = {

    async event_user_list (req, res) {
    try { 
        const getAllUsers = await event_Users.findAll();
        return res.status(200).json(getAllUsers);
    }

    catch (error) { res.status(500).json({ message: 'Internal server error' });
    }
},
}