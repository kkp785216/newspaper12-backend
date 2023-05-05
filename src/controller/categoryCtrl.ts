import { Request, Response } from "express";
import Category from "../models/categoryModels";
import expressAsyncHandler from "express-async-handler";
import type { CategoryRequestBody } from "constants/types";
import convertTitleToSlug from "../utils/formatSlug";

// add new Category
const getAllCategories = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const categories = await Category.find();
      res.status(200).json(categories);
    } catch (error: any) {
      throw new Error(error);
    }
  }
);

const getSingleCategory = expressAsyncHandler(
  // eslint-disable-next-line @typescript-eslint/ban-types
  async (req: Request<{ id: string }, {}, {}, {}>, res: Response) => {
    const categoryId = req.params.id;
    try {
      const category = await Category.findById(categoryId);
      res.status(200).json(category);
    } catch (error: any) {
      throw new Error(error);
    }
  }
);

// add new Category
const addNewCategory = expressAsyncHandler(
  // eslint-disable-next-line @typescript-eslint/ban-types
  async (req: Request<{}, {}, CategoryRequestBody>, res: Response) => {
    // taking value from req.body
    const { name, slug, description } = req.body;

    // error handling
    const errArray = [];
    if (!name) errArray.push("name not provided");
    if (!slug) errArray.push("slug not provided");
    if (errArray.length > 0) throw new Error(errArray.join(", "));

    try {
      // creating new category instanse
      const category = new Category({
        name: name,
        slug: convertTitleToSlug(slug),
        description: description || null,
      });
      //saving to database
      const response = await category.save();
      res.status(200).json(response);
    } catch (error: any) {
      throw new Error(error);
    }
  }
);

export { getAllCategories, getSingleCategory, addNewCategory };
