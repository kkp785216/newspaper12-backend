import express from "express";
import { getSingleCategory } from "../../../../controller/categoryCtrl";

const router = express.Router();

// getAllArticles by page and limit query
router.get("/:slug", getSingleCategory);

export default router;
