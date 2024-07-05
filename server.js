import 'dotenv/config'; 
import express from "express";
import cors from 'cors';
import user_router from './app/routers/user.router.js';
import auth_router from './app/routers/auth.router.js';
import event_router from './app/routers/event.router.js';

const app = express();

app.use(express.urlencoded());

app.use(
    cors({
        origin: [
            'http://localhost',
            'http://localhost:5173',
            'http://127.0.0.1:5173',
            'http://localhost:5174',
            'http://127.0.0.1:5174',
            'http://127.0.0.1:5500',
            'http://localhost:5500'
            
        ],
        credentials: true,
    })
);

app.use(express.json());
app.use(user_router);
app.use(auth_router);
app.use(event_router);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on ${process.env.BASE_URL}:${process.env.PORT}`);
});