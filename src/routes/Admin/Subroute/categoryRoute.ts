import express from "express";
import {
  addNewCategory,
  getSingleCategory,
} from "../../../controller/categoryCtrl";
import { authMiddleware, isAdmin } from "../../../middlewares/authMiddleware";

const router = express.Router();

// getAllArticles
router.get("/:slug", getSingleCategory);

// getAllArticles
router.post("/", authMiddleware, isAdmin, addNewCategory);

export default router;
