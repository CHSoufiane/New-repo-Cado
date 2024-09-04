import express from 'express';

import eventController from '../controllers/event.controller.js';

const router = express.Router();

router.get('/events', eventController.getEvents);
router.post('/events', eventController.createEvent);
router.post('/create-event', eventController.createEventWithParticipantsAndDraw);

router.get('/events/:id', eventController.getOneEvent);
router.put('/events/:id', eventController.updateEvent);

router.delete('/delete-event', eventController.deleteEvent);
router.get('/view/:token', eventController.getResults);


export default router;