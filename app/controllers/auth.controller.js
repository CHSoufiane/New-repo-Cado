import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";
import Joi from "joi";

// Register a new user
export default {
  async register(req, res) {
    try {
      // Extract user data from request body
      const schema = Joi.object({
        name: Joi.string()
          .min(3) // min length 3 char
          .max(30) // maximum length 30 char
          .pattern(new RegExp('^[a-zA-Z]+$')) // only letters
          .required(),
        password: Joi.string()
          .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})')) // password pattern
          .required(),
        confirmPassword: Joi.ref('password'),
        email: Joi.string()
          .email({ tlds: { allow: false } }) // valid email format 
          .required(),
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        console.log(error.details[0].message);
        return res.status(400).json(error.details[0].message);
      }

      const { name, email, password } = value;

      // Check if user already exists
      const existingUser = await User.findOne({
        where: { email },
      });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Hash the password
      const hashedPassword = await hash(password, 10);

      // Generate a JWT token linked to the email
      const token = jwt.sign({ email: email }, process.env.JWT_SECRET_KEY);

      // Create a new user
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        is_registered: true,
        token: token,
      });

      // Send an email to the new user
      const subject = "Welcome to Cad'O";
      const html = `Hello ${user.name}, welcome to Cad'O!`;
      sendEmail(user.email, subject, html);

      return res.status(201).json(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // Login an existing user
  async login(req, res) {
    try {
      const { email, password } = req.body;

      console.log("Email received:", email);
      console.log("Password received:", password);

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: "Invalid credentials" });
      }

      // Compare the provided password with the hashed password stored in the database
      const isPasswordValid = await compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // If login successful, generate a JWT
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });

      // Set the cookie with the token
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        secure: true, // Use secure cookies in production
      });

      return res.status(200).json({ message: "Login successful", user });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

