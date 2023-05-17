import express from "express";
import {
  addNewCategory,
  getAllCategories,
  getSingleCategory,
} from "../../../controller/categoryCtrl";
import { authMiddleware, isAdmin } from "../../../middlewares/authMiddleware";

const router = express.Router();

// getAllArticles
router.get("/", getAllCategories);

// getAllArticles
router.get("/:id", getSingleCategory);

// getAllArticles
router.post("/", authMiddleware, isAdmin, addNewCategory);

export default router;
