import express from "express";
import controller from "../controllers/me.controller.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/me", verifyToken, controller.getMe);
router.patch("/me", verifyToken, controller.updateMe);

export default router;