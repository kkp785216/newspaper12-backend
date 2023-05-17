import express from "express";
import { getAllTags } from "../../../../controller/tagCtrl";

const router = express.Router();

// getAllArticles by page and limit query
router.get("/", getAllTags);

export default router;
