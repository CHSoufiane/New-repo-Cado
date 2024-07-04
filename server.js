import 'dotenv/config'; 
import express from "express";
import user_router from './app/routers/user.router.js';
import auth_router from './app/routers/auth.router.js';
import event_router from './app/routers/event.router.js';

const app = express();

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(user_router);
app.use(auth_router);
app.use(event_router);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on ${process.env.BASE_URL}:${process.env.PORT}`);
});