import express from "express";
import { getAllCategories } from "../../../controller/categoryCtrl";

const router = express.Router();

// getAllArticles
router.get("/", getAllCategories);

export default router;
