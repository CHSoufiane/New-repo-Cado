import User from "../models/User.js";
import Event from "../models/Event.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export default {
    async getMe(req, res) {
    try {
      // Get the user and his events with teh related participants
      const user = await User.findByPk(req.user.id, {
        include: {
          model: Event,
          as: 'events',
          include: {
            model: User,
            as: 'participants',
            through: { attributes: [] }, // ignore the attributes of the join table
            attributes: ['name', 'email'], // attributes to retrieve for the participants
          },
        },
      });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
  
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.error('Error:', error.message);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },
  async updateMe(req, res) {
    try {
      const { name, email, password } = req.body;

      // get the user
      const user = await User.findByPk(req.user.id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Update the user infos
      if (name) user.name = name;
      if (email) user.email = email;
      if (password) {
        const saltRounds = 10;
        // make sure the password is hashed before saving it
        user.password = await bcrypt.hash(password, saltRounds); 
      }
      // update the infos in the database
      await user.save();

      res.json({ message: 'User updated successfully', user });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  },

  async destroyMe(req, res) {
    try {
      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      await user.destroy();
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }
};