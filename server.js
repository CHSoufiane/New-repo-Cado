import fs from 'fs';
import https from 'https';
import 'dotenv/config'; 
import express from "express";
import cors from 'cors';
import user_router from './app/routers/user.router.js';
import auth_router from './app/routers/auth.router.js';
import event_router from './app/routers/event.router.js';
import draw_router from './app/routers/draw.router.js';
import cookieParser from 'cookie-parser';

const privateKey = fs.readFileSync('/etc/letsencrypt/live/cado.zapto.org/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/cado.zapto.org/fullchain.pem', 'utf8');

const credentials = {
    key: privateKey,
    cert: certificate
};


const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // Ajoutez ici l'origine de votre front-end
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Ensure credentials are included in requests
}));


app.use(cookieParser());
app.use(express.json());
app.use(user_router);
app.use(auth_router);
app.use(event_router);
app.use(draw_router);

const httpsServer = https.createServer(credentials, app);


httpsServer.listen(443, () => {
    console.log(`HTTPS Server is running on https://165.227.232.51`);
});

const http = express();

http.get('*', (req, res) => {
    res.redirect(`https://${req.headers.host}${req.url}`);
});