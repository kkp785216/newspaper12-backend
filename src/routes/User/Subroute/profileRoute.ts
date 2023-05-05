import express from "express";
import { getProfile, updateProfile } from "../../../controller/userCtrl";
import { authMiddleware } from "../../../middlewares/authMiddleware";

const router = express.Router();

// request and route for get user Profile
router.get("/", authMiddleware, getProfile);

// request and route for update user profile
router.put("/", authMiddleware, updateProfile);

export default router;
