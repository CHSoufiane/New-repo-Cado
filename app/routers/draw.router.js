import express from 'express';
import drawController from '../controllers/draw.controller.js';

const router = express.Router();

router.get('/draw/:id', drawController.getParticipantsFromAnEvent);
router.get('/resultat/:token', drawController.getDrawPair);

export default router;