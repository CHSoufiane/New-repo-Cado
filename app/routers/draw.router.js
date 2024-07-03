import express from 'express';

import drawController from '../controllers/drawController.js';

const router = express.Router();

router.get('/draws', drawController.getDraws);
router.post('/draws', drawController.createDraw);

router.get('/draws/:id', drawController.getOneDraw);
router.put('/draws/:id', drawController.updateDraw);
router.delete('/draws/:id', drawController.deleteDraw);



export default router;