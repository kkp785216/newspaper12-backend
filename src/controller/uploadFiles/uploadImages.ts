import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import multer, { FileFilterCallback } from "multer";
import sharp from "sharp";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../lib/firebase";
import convertTitleToSlug from "../../utils/formatSlug";

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
const uploadFiles = upload.array("image", 10);

/** uploadFile middleware with error handler */
const uploadImages = (req: Request, res: Response, next: NextFunction) => {
  uploadFiles(req, res, (error) => {
    if (error) {
      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_UNEXPECTED_FILE")
          return next(new Error("Too many files uploaded! Max 10 allowed"));
        else return next(new Error(error as unknown as string));
      }
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
const resizeImages = expressAsyncHandler(
  async (
    req: Request<
      unknown,
      unknown,
      { image: Buffer[]; images: ImagesResponse[] }
    >,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.files) return next(new Error("Image Buffer not found on server"));

    const tempImages: ImagesResponse[] = [];
    await Promise.all(
      ((): Express.Multer.File[] => req.files as Express.Multer.File[])().map(
        async (file) => {
          const uniqueSuffix =
            convertTitleToSlug(file.originalname.replace(/\.[^/.]+$/, "")) +
            "-" +
            Date.now().toString() +
            "-" +
            Math.round(Math.random() * 1e9).toString() +
            ".webp";
          try {
            const filePromises = [
              // Original size
              { name: uniqueSuffix, buffer: file.buffer },
              // 150x150
              {
                name: `${uniqueSuffix}-150x150.webp`,
                buffer: await imageResizer(file, 150, 150),
              },
              // 485x360
              {
                name: `${uniqueSuffix}-485x360.webp`,
                buffer: await imageResizer(file, 485, 360),
              },
              // 218x150
              {
                name: `${uniqueSuffix}-218x150.webp`,
                buffer: await imageResizer(file, 218, 150),
              },
              // 696xauto
              {
                name: `${uniqueSuffix}-696xauto.webp`,
                buffer: await imageResizer(file, 696, null),
              },
            ];
            const images: { name: string; downloadURL: string }[] = [];
            const path = "images";
            const fileUploadPromises = filePromises.map(
              async ({ name, buffer }) => {
                const storageRef = ref(storage, `${path}/` + name);
                await uploadBytes(storageRef, buffer);
                const downloadURL = await getDownloadURL(storageRef);
                images.push({ name, downloadURL });
              }
            );
            await Promise.all(fileUploadPromises);
            tempImages.push({
              success: `File ${uniqueSuffix} uploaded successfully.`,
              path,
              filename: uniqueSuffix,
              fullpath: `${path}/${uniqueSuffix}`,
              images,
            });
          } catch (error) {
            next(new Error("Something went wrong"));
          }
        }
      )
    );
    req.body.images = tempImages;
    next();
  }
);

/** Get upload image metadata */
const getResults = expressAsyncHandler(
  (
    req: Request<unknown, unknown, { images: ImagesResponse[] }>,
    res: Response
  ) => {
    if (!req.body.images) throw new Error("Internal Server error");
    res.send({
      ...req.body.images,
    });
  }
);

export { uploadImages, resizeImages, getResults };
