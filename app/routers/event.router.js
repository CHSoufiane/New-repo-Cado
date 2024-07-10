import express from 'express';

import eventController from '../controllers/event.controller.js';

const router = express.Router();

router.get('/events', eventController.getEvents);
router.post('/events', eventController.createEvent);

router.get('/events/:id', eventController.getOneEvent);
router.put('/events/:id', eventController.updateEvent);
router.delete('/events/:id', eventController.deleteEvent);

router.get('/events/:id/Draw', eventController.eventDraw);


export default router;