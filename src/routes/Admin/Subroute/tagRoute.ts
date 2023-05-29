import express from "express";
import {
  addNewTag,
  getAllTags,
  getSingleTag,
} from "../../../controller/tagCtrl";
import { authMiddleware, isAdmin } from "../../../middlewares/authMiddleware";

const router = express.Router();

router.get("/", getAllTags);

router.get("/:id", getSingleTag);

router.post("/", authMiddleware, isAdmin, addNewTag);

export default router;
