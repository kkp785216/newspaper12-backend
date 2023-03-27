import express from 'express';
import { getAllArticles } from '../../controller/Articles/getArticlesCtrl';

const router = express.Router();

// getAllArticles by page and limit query
router.get("/all", getAllArticles);


export default router;