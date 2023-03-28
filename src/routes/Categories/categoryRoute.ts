import express from 'express';
import { addNewCategory, getSingleCategory } from '../../controller/Categories/categoriesCtrl';
import { authMiddleware, isAdmin } from '../../middlewares/authMiddleware';

const router = express.Router();

// getAllArticles by page and limit query
router.get("/:id", getSingleCategory);

// getAllArticles by page and limit query
router.post("/", authMiddleware, isAdmin, addNewCategory);


export default router;