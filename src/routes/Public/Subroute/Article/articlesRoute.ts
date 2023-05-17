import express from "express";
import { getAllArticles } from "../../../../controller/Article/getArticlesCtrl/getAllArticles";
import { getArticlesByCategory } from "../../../../controller/Article/getArticlesCtrl/getArticlesByCategory";

const router = express.Router();

// getAllArticles by page and limit query
router.get("/all", getAllArticles);

// get articles using category
router.get("/bycategory", getArticlesByCategory);

export default router;
