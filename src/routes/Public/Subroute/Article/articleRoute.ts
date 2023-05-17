import express from "express";
import { getSingleArticle } from "../../../../controller/Article/getArticlesCtrl/getSingleArticle";

const router = express.Router();

// getSingleArticles by slug
router.get("/:slug", getSingleArticle);

export default router;
