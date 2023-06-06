import { getAllAuthors } from "../../../controller/authorsCtrl";
import express from "express";

const router = express.Router();

router.get("/all", getAllAuthors);

export default router;
