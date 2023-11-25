import express from "express";
import { getAllTags } from "../../../controller/tagCtrl";

const router = express.Router();

router.get("/", getAllTags);

export default router;
