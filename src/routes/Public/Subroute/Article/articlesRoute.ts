import express from 'express';
import { getAllArticles } from '../../../../controller/Article/getArticlesCtrl';

const router = express.Router();

// getAllArticles by page and limit query
router.get("/all", getAllArticles);


export default router;