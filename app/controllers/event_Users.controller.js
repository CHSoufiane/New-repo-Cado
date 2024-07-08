import Event_user from '../models/event_users';

const event_usersController = {


    async event_user_list (req, res) {
    try { 
        const getAllEventUsers = await Event_user.findAll();
        return res.status(200).json(getAllEventUsers);
    }

    catch (error) { res.status(500).json({ message: 'Internal server error' });
    }
},
};

export default event_usersController;