import express from "express";
import controller from "../controllers/me.controller.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/me", verifyToken, controller.getMe);
router.patch("/me", verifyToken, controller.updateMe);
router.delete("/me", verifyToken, controller.destroyMe);

export default router;