import express from "express";
import controller from "../controllers/user.controller.js";

const router = express.Router();

router.get("/users", controller.getUsers);
router.post("/users", controller.createUser);
router.get("/users/:id", controller.getUser);
router.patch("/users/:id", controller.updateUser);
router.delete("/users/:id", controller.deleteUser);
router.get("/", (req, res) => {
    res.send("Hello World");
});

export default router;
