import User from "../models/User.js";
import Event from "../models/Event.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";

export default {
  async createUser(req, res) {
    const { name, email } = req.body;
    if (!name || !email) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    try {
      const existingUser = await User.findOne({ where: { email } });

      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Generate a JWT token linked to the email
      const token = jwt.sign({ email: email }, `${process.env.JWT_SECRET_KEY}`);

      // Use the token to create a new user w/o password
      // Used to register invited users
      const user = await User.create({
        name,
        email,
        is_registered: false,
        token: token,
      });

      // Send an email to the new user
      const subject = "Vous avez été invité à participer sur Cad'O";
      const html = `Bonjour ${user.name}, tu as été invité à participer sur Cad'O! ! Clique sur le lien pour voir le résultat du tirage au sort`;
      sendEmail(user.email, subject, html);

      return res.status(201).json(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  async getUser(req, res) {
    const { id } = req.params;

    try {
      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.json(user);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  async getUsers(req, res) {
    try {
      const users = await User.findAll();
      return res.json(users);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async updateUser(req, res) {
    const { id } = req.params;
    const { name, email, password } = req.body;

    try {
      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.name = name;
      user.email = email;
      user.password = password;

      await user.save();

      return res.json(user);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async deleteUser(req, res) {
    const { id } = req.params;

    try {
      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await user.destroy();

      return res
        .status(200)
        .json({
          message: `User : ${user.id} / ${user.name} successfully deleted`,
        });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};
