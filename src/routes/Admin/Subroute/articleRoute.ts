import express from "express";
import { addNewArticle } from "../../../controller/Article/addArticleCtrl";
import { deleteSingleArticle } from "../../../controller/Article/deleteArticleCtrl";
import { authMiddleware, isAdmin } from "../../../middlewares/authMiddleware";

const router = express.Router();

// request and route for delete user profile
router.post("/", authMiddleware, isAdmin, addNewArticle);

// request and route for delete user profile
router.delete("/", authMiddleware, isAdmin, deleteSingleArticle);

export default router;
