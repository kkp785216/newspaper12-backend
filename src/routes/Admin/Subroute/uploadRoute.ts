import express from "express";
import {
  uploadImage,
  resizeImage,
  getResult,
} from "../../../controller/uploadFiles/uploadImage";
import ckUpload from "../../../controller/uploadFiles/ckUploadImage";
import {
  uploadImages,
  resizeImages,
  getResults,
} from "../../../controller/uploadFiles/uploadImages";

const router = express.Router();

router.post("/image", uploadImage, resizeImage, getResult);
router.post(
  "/ckimage",
  ckUpload.uploadImage,
  ckUpload.resizeImage,
  ckUpload.getResult
);
router.post("/images", uploadImages, resizeImages, getResults);

export default router;
