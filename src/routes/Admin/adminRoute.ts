import express from "express";
import articleRouter from "./Subroute/articleRoute";
import profileRouter from "./Subroute/profileRoute";

const router = express.Router();

// request and route for get user Profile
router.use("/article", articleRouter);

// request and route for get user Profile
router.use("/profile", profileRouter);

export default router;
