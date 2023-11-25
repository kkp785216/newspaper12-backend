import { Request, Response } from "express";
import Category from "../models/categoryModels";
import expressAsyncHandler from "express-async-handler";
import type { CategoryRequestBody } from "../constants/types";
import convertTitleToSlug from "../utils/formatSlug";

// add new Category
const getAllCategories = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const categories = await Category.find();
      res.status(200).json(categories);
    } catch (error) {
      throw new Error(error as string);
    }
  }
);

const getSingleCategory = expressAsyncHandler(
  async (
    req: Request<{ slug: string }, unknown, unknown, unknown>,
    res: Response
  ) => {
    const slug = req.params.slug;
    try {
      const category = await Category.findOne({ slug });
      res.status(200).json(category);
    } catch (error) {
      throw new Error(error as string);
    }
  }
);

// add new Category
const addNewCategory = expressAsyncHandler(
  async (
    req: Request<unknown, unknown, CategoryRequestBody>,
    res: Response
  ) => {
    // taking value from req.body
    const { name, slug, description } = req.body;

    // error handling
    const errArray = [];
    if (!name) errArray.push("name not provided");
    if (!slug) errArray.push("slug not provided");
    if (errArray.length > 0) throw new Error(errArray.join(", "));
    if (slug !== convertTitleToSlug(slug))
      throw new Error("slug is not in the right format");

    try {
      // creating new category instanse
      const category = new Category({
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

export { getAllCategories, getSingleCategory, addNewCategory };
