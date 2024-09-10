import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Access denied bc token' });
    }

    jwt.verify(token, `${process.env.JWT_SECRET_KEY}`, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = decoded; // Add decoded user data to req.user
        next();
    });
};

export default verifyToken;
