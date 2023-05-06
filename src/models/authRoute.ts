import express from "express";
import { createRegularUser, loginUser } from "../controller/authCtrl";

const router = express.Router();

// route for create a new user
router.post("/register", createRegularUser);

// route for login existing user
router.post("/login", loginUser);

export default router;
