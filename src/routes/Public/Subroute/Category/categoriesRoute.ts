import express from "express";
import { getAllCategories } from "../../../../controller/categoryCtrl";

const router = express.Router();

// getAllArticles by page and limit query
router.get("/", getAllCategories);

export default router;
