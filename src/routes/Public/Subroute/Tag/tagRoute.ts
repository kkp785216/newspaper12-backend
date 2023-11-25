import express from "express";
import { getSingleTag } from "../../../../controller/tagCtrl";

const router = express.Router();

// getAllArticles by page and limit query
router.get("/:slug", getSingleTag);

export default router;
