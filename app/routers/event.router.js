import express from 'express';

import eventController from '../controllers/event.controller.js';

const router = express.Router();

router.get('/events', eventController.getEvents);
router.post('/events', eventController.createEvent);
router.post('/create-event/:id', eventController.addParticipants);

router.get('/events/:id/participants', eventController.getParticipants);

router.get('/events/:id', eventController.getOneEvent);
router.put('/events/:id', eventController.updateEvent);
router.delete('/events/:id', eventController.deleteEvent);



export default router;