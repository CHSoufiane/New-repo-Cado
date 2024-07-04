import 'dotenv/config'; 
import Jwt from "jsonwebtoken";


function authenticateToken(req, res, next) {
    
   const authHeader = req.headers['authorization'];
   const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.status(401);

    Jwt.verify(token, process.env.ACCESS_TOEN_SECRET, (err, user) => {
        if (err) return res.status(403);
    })
    req.user = user;
    next()

}

// function invalidToken(req, res, next) {
    
    // Jwt.verify(token, )
    // return res.status(401).json({ message: 'Invalid token' });
// }

export default authenticateToken;