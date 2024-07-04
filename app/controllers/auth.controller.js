import 'dotenv/config'; 
import jwt from 'jsonwebtoken';

// Import necessary modules

// Register a new user
export default {
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
            const generateToken = jwt.sign({ username, password }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'});
            res.json({generateToken: generateToken});

            // Return the token
            res.status(201).json({ accessToken });
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

            // Authenticate the user with token
            if (user) {
                jwt.sign({ username, password }, process.env.REFRESH_TOKEN_SECRET)};

            // Generate refresh token
            const refreshToken = jwt.sign({ username, password }, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'});
            res.json({refreshToken: refreshToken});

            // Return the token
            res.status(200).json({ token });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async token (req, res) {
        const token = req.body.token;
        if(!token) {
            return  res.status(401).json({ message: 'Invalid token' });
        }

        const accessToken = await generateToken({ username, password });
        res.json({ accessToken });
    }
};