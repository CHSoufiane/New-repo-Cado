import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import User from '../models/User.js';
// Import necessary modules

// Register a new user
export default {
    async register(req, res) {
        try {
            // Extract user data from request body
            const { name, email, password } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ 
                where: { email } 
            });
            if (existingUser) {
                return res.status(400).json({ message: 'email already exists' });
            }

            // Hash the password
            const hashedPassword = await hash(password, 10);

            // Generate a JWT token linked to the email
            const token = jwt.sign({ email: email }, `${process.env.JWT_SECRET_KEY}`);

            // Create a new user
            const newUser = User.create({ 
                name,
                email,
                password: hashedPassword,
                is_registered: true,
                token: token
            });
            
            // Return the token
            res.status(201).json({ 
                message: 'User registered',
                user: newUser,
                token
            });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // Login an existing user
    async login(req, res) {
        try {
            // Extract user data from request body
            const { username, password } = req.body;

            // Check if user exists
            const user = await findOne({ username });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Compare passwords
            const isPasswordValid = await compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid password' });
            }

            // Generate a JWT token
            const token = sign({ userId: user._id }, 'your-secret-key');

            // Return the token
            res.status(200).json({ token });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

