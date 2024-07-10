import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const token = req.user.token || req.headers['x-access-token'];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(error.message);
        res.status(401).json({ message: 'Invalid token' });
    }
};

export default authMiddleware;