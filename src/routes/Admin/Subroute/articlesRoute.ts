import express from "express";
import { authMiddleware, isAdmin } from "../../../middlewares/authMiddleware";
import { getAllArticlesForAdmin } from "../../../controller/Article/getArticlesCtrl/getAllArticles";
import { getArticlesByCategoryForAdmin } from "../../../controller/Article/getArticlesCtrl/getArticlesByCategory";
import { getArticlesByTagForAdmin } from "../../../controller/Article/getArticlesCtrl/getArticlesByTag";

const router = express.Router();

// request and route for delete user profile
router.get("/", authMiddleware, isAdmin, getAllArticlesForAdmin);

// request and route for delete user profile
router.get(
  "/category/:slug",
  authMiddleware,
  isAdmin,
  getArticlesByCategoryForAdmin
);

// request and route for delete user profile
router.get("/tag/:slug", authMiddleware, isAdmin, getArticlesByTagForAdmin);

export default router;
