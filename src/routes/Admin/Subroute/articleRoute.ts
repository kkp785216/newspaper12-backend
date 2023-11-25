import express from "express";
import { addNewArticle } from "../../../controller/Article/addArticleCtrl";
import { deleteSingleArticle } from "../../../controller/Article/deleteArticleCtrl";
import { authMiddleware, isAdmin } from "../../../middlewares/authMiddleware";
import { updateArticle } from "../../../controller/Article/updateArticleCtrl";
import { getSingleArticleForAdmin } from "../../../controller/Article/getArticlesCtrl/getSingleArticle";

const router = express.Router();

// request and route for delete user profile
router.get("/:slug", authMiddleware, isAdmin, getSingleArticleForAdmin);

// request and route for delete user profile
router.post("/", authMiddleware, isAdmin, addNewArticle);

// request and route for delete user profile
router.put("/:slug", authMiddleware, isAdmin, updateArticle);

// request and route for delete user profile
router.delete("/:slug", authMiddleware, isAdmin, deleteSingleArticle);

export default router;
