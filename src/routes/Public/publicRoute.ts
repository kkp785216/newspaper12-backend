import express from "express";
import articleRouter from "./Subroute/Article/articleRoute";
import articleRouters from "./Subroute/Article/articlesRoute";
import categoryRouter from "./Subroute/Category/categoryRoute";
import tagRouter from "./Subroute/Tag/tagRoute";
import tagsRouter from "./Subroute/Tag/tagsRoute";
import categoriesRouter from "./Subroute/Category/categoriesRoute";

const router = express.Router();

// serving article
router.use("/article", articleRouter);
router.use("/articles", articleRouters);

// serving category
router.use("/category", categoryRouter);
router.use("/categories", categoriesRouter);

// serving tags
router.use("/tag", tagRouter);
router.use("/tags", tagsRouter);

export default router;
