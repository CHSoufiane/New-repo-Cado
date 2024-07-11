import express from 'express';
import drawController from '../controllers/draw.controller.js';

const router = express.Router();

router.get('/draws', drawController.getDraws);
router.post('/events/:id/draw', drawController.makeDraw);
router.get('/draws/user/:id', drawController.getDrawByUser)

router.get('/draws/:id', drawController.getOneDraw);
router.delete('/draws/:id', drawController.deleteDraw);

export default router;