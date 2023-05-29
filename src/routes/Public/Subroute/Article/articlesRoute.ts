import express from "express";
import { getAllArticles } from "../../../../controller/Article/getArticlesCtrl/getAllArticles";
import { getArticlesByCategory } from "../../../../controller/Article/getArticlesCtrl/getArticlesByCategory";
import { getArticlesByTag } from "../../../../controller/Article/getArticlesCtrl/getArticlesByTag";

const router = express.Router();

// getAllArticles by page and limit query
router.get("/all", getAllArticles);

// get articles using category
router.get("/bycategory", getArticlesByCategory);

// get articles using tag
router.get("/bytag", getArticlesByTag);

export default router;
