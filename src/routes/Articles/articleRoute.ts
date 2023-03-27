import express from 'express';
import { getSingleArticle } from '../../controller/Articles/getArticlesCtrl';
import { addNewArticle } from '../../controller/Articles/addArticleCtrl';

const router = express.Router();

// getSingleArticles by slug
router.get("/:slug", getSingleArticle);

// request and route for delete user profile
router.post("/", addNewArticle);


export default router;