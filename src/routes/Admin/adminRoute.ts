import express from "express";
import articleRouter from "./Subroute/articleRoute";
import profileRouter from "./Subroute/profileRoute";
import categoryRouter from "./Subroute/categoryRoute";
import { createUserByAdmin, loginAdmin } from "../../controller/authCtrl";
import { authMiddleware, isAdmin } from "../../middlewares/authMiddleware";
import tagRouter from "./Subroute/tagRoute";
import uploadRouter from "./Subroute/uploadRoute";

const router = express.Router();

// request and route for get user Profile
router.use("/article", articleRouter);

// request and route for get user Profile
router.use("/profile", profileRouter);

// request and route for get user Profile
router.post("/register", authMiddleware, isAdmin, createUserByAdmin);

// request and route for get user Profile
router.use("/category", categoryRouter);

// request and route for get user tags - create, update, delete
router.use("/tag", tagRouter);

// request and route for get user Profile
router.post("/login", loginAdmin);

// request and route for get user Profile
router.use("/upload", uploadRouter);

export default router;
