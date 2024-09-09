import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

// Import necessary modules

// Register a new user
export default authController = {
    async register(req, res) {
        try {
            // Extract user data from request body
            const { username, password } = req.body;

            // Check if user already exists
            const existingUser = await findOne({ username });
            if (existingUser) {
                return res.status(400).json({ message: 'Username already taken' });
            }

            // Hash the password
            const hashedPassword = await hash(password, 10);

            // Create a new user
            const newUser = new User({ username, password: hashedPassword });
            await newUser.save();

            // Generate a JWT token
            const token = sign({ userId: newUser._id }, 'your-secret-key');

            // Return the token
            res.status(201).json({ token });
        } catch (error) {
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

