import express from 'express';
import { getAllArticles } from '../../controller/Articles/getArticlesCtrl';
import categoriesRouter from "../Categories/categoriesRoute";

const router = express.Router();

router.use(categoriesRouter);

// getAllArticles by page and limit query
router.get("/all", getAllArticles);


export default router;