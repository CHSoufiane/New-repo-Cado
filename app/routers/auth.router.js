import express from "express";
import controller from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", controller.register);


export default router;
