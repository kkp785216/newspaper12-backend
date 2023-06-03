import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import multer, { FileFilterCallback } from "multer";
import sharp from "sharp";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../lib/firebase";

type ImagesResponse = {
  success: string;
  path: string;
  filename: string;
  fullpath: string;
  images: {
    name: string;
    downloadURL: string;
  }[];
};

/** Upload images in memory */
const multerStorage = multer.memoryStorage();

/** Check if uploaded filetype is image */
const multerFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please provide image only!" as unknown as null, false);
  }
};

/** Creating multer instance */
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

/** uploadFile middleware */
const uploadFile = upload.single("image");

/** uploadFile middleware with error handler */
const uploadImage = (req: Request, res: Response, next: NextFunction) => {
  uploadFile(req, res, (error) => {
    if (error) {
      return next(new Error(error as string));
    }
    next();
  });
};

/** ImageResizer function */
const imageResizer = async (
  file: Express.Multer.File,
  width: number | null,
  height: number | null
) => {
  const resizedImageBuffer = await sharp(file.buffer)
    .resize(width, height, {
      fit: "cover",
      position: "center",
      withoutEnlargement: true,
    })
    .toFormat("webp")
    .webp({ quality: 90 })
    .toBuffer();

  return resizedImageBuffer;
};

/** Image Resizer and uploader middleware  */
const resizeImage = expressAsyncHandler(
  async (
    req: Request<unknown, unknown, { image: string; images: ImagesResponse }>,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.file) return next(new Error("Image Buffer not found on server"));

    const uniqueSuffix =
      Date.now().toString() +
      "-" +
      Math.round(Math.random() * 1e9).toString() +
      ".webp";

    try {
      const filePromises = [
        // Original size
        { name: uniqueSuffix, buffer: req.file.buffer },
        // 150x150
        {
          name: `${uniqueSuffix}-150x150.webp`,
          buffer: await imageResizer(req.file, 150, 150),
        },
        // 485x360
        {
          name: `${uniqueSuffix}-485x360.webp`,
          buffer: await imageResizer(req.file, 485, 360),
        },
        // 218x150
        {
          name: `${uniqueSuffix}-218x150.webp`,
          buffer: await imageResizer(req.file, 218, 150),
        },
        // 696xauto
        {
          name: `${uniqueSuffix}-696xauto.webp`,
          buffer: await imageResizer(req.file, 696, null),
        },
      ];
      const images: { name: string; downloadURL: string }[] = [];
      const path = "images";
      const fileUploadPromises = filePromises.map(async ({ name, buffer }) => {
        const storageRef = ref(storage, `${path}/` + name);
        await uploadBytes(storageRef, buffer);
        const downloadURL = await getDownloadURL(storageRef);
        images.push({ name, downloadURL });
      });
      await Promise.all(fileUploadPromises);
      req.body.images = {
        success: `File ${uniqueSuffix} uploaded successfully.`,
        path,
        filename: uniqueSuffix,
        fullpath: `${path}/${uniqueSuffix}`,
        images,
      };
      next();
    } catch (error) {
      next(new Error("Something went wrong"));
    }
  }
);

/** Get upload image metadata */
const getResult = expressAsyncHandler(
  (
    req: Request<unknown, unknown, { images: ImagesResponse }>,
    res: Response
  ) => {
    if (!req.body.images) throw new Error("Internal Server error");
    res.send({
      ...req.body.images,
    });
  }
);

export { uploadImage, resizeImage, getResult };
