import express from 'express';
import { addNewCategory, getSingleCategory } from '../../controller/Categories/categoriesCtrl';

const router = express.Router();

// getAllArticles by page and limit query
router.get("/:id", getSingleCategory);

// getAllArticles by page and limit query
router.post("/", addNewCategory);


export default router;