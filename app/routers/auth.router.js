import express from "express";
import controller from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/register", controller.register);
router.post("/login", controller.login);

router.get("/me", userController.getMe);



export default router;
