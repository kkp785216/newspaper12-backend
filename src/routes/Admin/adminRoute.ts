import express from "express";
import articleRouter from "./Subroute/articleRoute";
import articlesRouter from "./Subroute/articlesRoute";
import profileRouter from "./Subroute/profileRoute";
import categoryRouter from "./Subroute/categoryRoute";
import categoriesRouter from "./Subroute/categoriesRoute";
import { createUserByAdmin, loginAdmin } from "../../controller/authCtrl";
import { authMiddleware, isAdmin } from "../../middlewares/authMiddleware";
import tagRouter from "./Subroute/tagRoute";
import tagsRouter from "./Subroute/tagsRoute";
import uploadRouter from "./Subroute/uploadRoute";
import authorRouter from "./Subroute/authorsRoute";

const router = express.Router();

// request and route for get user Profile
router.use("/article", articleRouter);

// request and route for get user Profile
router.use("/articles", articlesRouter);

// request and route for get user Profile
router.use("/profile", profileRouter);

// request and route for get user Profile
router.post("/register", authMiddleware, isAdmin, createUserByAdmin);

// request and route for get user Profile
router.use("/category", categoryRouter);

// request and route for get user Profile
router.use("/categories", categoriesRouter);

// request and route for get user tags - create, update, delete
router.use("/tag", tagRouter);

// request and route for get user tags - create, update, delete
router.use("/tags", tagsRouter);

// request and route for get user Profile
router.post("/login", loginAdmin);

// request and route for get user Profile
router.use("/upload", authMiddleware, isAdmin, uploadRouter);

// request and route for get user Profile
router.use("/authors", authMiddleware, isAdmin, authorRouter);

export default router;
