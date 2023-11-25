import express from "express";
import { addNewTag, getSingleTag } from "../../../controller/tagCtrl";
import { authMiddleware, isAdmin } from "../../../middlewares/authMiddleware";

const router = express.Router();

router.get("/:slug", getSingleTag);

router.post("/", authMiddleware, isAdmin, addNewTag);

export default router;
