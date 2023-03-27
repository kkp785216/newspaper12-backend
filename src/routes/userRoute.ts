import express from 'express';
import { deleteProfile, getProfile, updateProfile } from '../controller/userCtrl';

const router = express.Router();

// request and route for get user Profile
router.get("/profile", getProfile);

// request and route for delete user profile
router.delete("/profile", deleteProfile);

// request and route for update user profile
router.put("/profile", updateProfile);

export default router;