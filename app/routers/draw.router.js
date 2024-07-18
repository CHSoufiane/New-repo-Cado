import express from 'express';
import drawController from '../controllers/draw.controller.js';
import { makeDraw } from '../utils/draw.js';

const router = express.Router();

router.get('/draws', drawController.getDraws);
router.post('/events/:id/draw', makeDraw );
router.get('/draws/user/:id', drawController.getReceiverFromAnEvent)

router.get('/draws/:id', drawController.getOneDraw);
router.delete('/draws/:id', drawController.deleteDraw);

export default router;