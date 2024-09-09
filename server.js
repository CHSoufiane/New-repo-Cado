import 'dotenv/config'; 
import express from "express";
import cors from 'cors';
import user_router from './app/routers/user.router.js';
import auth_router from './app/routers/auth.router.js';
import event_router from './app/routers/event.router.js';
import draw_router from './app/routers/draw.router.js';
import cookieParser from 'cookie-parser';
import limiter from './app/middlewares/rateLimit.js';


const app = express();

app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Ajoutez ici l'origine de votre front-end
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Ensure credentials are included in requests
}));

app.use(limiter);
app.use(cookieParser());
app.use(express.json());
app.use(user_router);
app.use(auth_router);
app.use(event_router);
app.use(draw_router);



// Écoutez sur le port 3000 pour Express
app.listen(3000, () => {
    console.log(`Server is running on ${process.env.BASE_URL}:${process.env.PORT}`);
});
