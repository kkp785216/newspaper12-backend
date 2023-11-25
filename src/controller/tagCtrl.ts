import { Request, Response } from "express";
import TagModel from "../models/tagModels";
import expressAsyncHandler from "express-async-handler";
import type { CategoryRequestBody } from "../constants/types";
import convertTitleToSlug from "../utils/formatSlug";

// add new Category
const getAllTags = expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    const tags = await TagModel.find();
    res.status(200).json(tags);
  } catch (error) {
    throw new Error(error as string);
  }
});

const getSingleTag = expressAsyncHandler(
  async (
    req: Request<{ slug: string }, unknown, unknown, unknown>,
    res: Response
  ) => {
    const slug = req.params.slug;
    try {
      const tag = await TagModel.findOne({ slug });
      res.status(200).json(tag);
    } catch (error) {
      throw new Error(error as string);
    }
  }
);

// add new Category
const addNewTag = expressAsyncHandler(
  async (
    req: Request<unknown, unknown, CategoryRequestBody>,
    res: Response
  ) => {
    // taking value from req.body
    const { name, slug, description } = req.body;

    // error handling
    const errArray = [];
    if (!name) errArray.push("tag name not provided");
    if (!slug) errArray.push("slug not provided");
    if (errArray.length > 0) throw new Error(errArray.join(", "));
    if (slug !== convertTitleToSlug(slug))
      throw new Error("slug is not in the right format");

    try {
      // creating new category instanse
      const category = new TagModel({
        name: name,
        slug: slug,
        description: description || null,
      });
      //saving to database
      const response = await category.save();
      res.status(200).json(response);
    } catch (error) {
      throw new Error(error as string);
    }
  }
);

export { getAllTags, getSingleTag, addNewTag };
