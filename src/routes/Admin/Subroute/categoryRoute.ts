import express from 'express';
import { addNewCategory } from '../../../controller/categoryCtrl';
import { authMiddleware, isAdmin } from '../../../middlewares/authMiddleware';

const router = express.Router();

// getAllArticles by page and limit query
router.post("/", authMiddleware, isAdmin, addNewCategory);


export default router;