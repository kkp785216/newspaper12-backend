import { Request, Response } from "express";
import Article from "../../../../models/articlesModels";
import expressAsyncHandler from "express-async-handler";
import { GetArticlesByCategoryRequestBody } from "constants/articles-type";
import { matchLookupFunc } from "./matchLookup";
import { lookupPipeline } from "../_helper/relationshipPipeline";
import { handleLimit } from "../_helper/handleLimit";
import CategoryModels from "../../../../models/categoryModels";

// Get Articles by categories
const getArticlesByCategory = expressAsyncHandler(
  // eslint-disable-next-line @typescript-eslint/ban-types
  async (
    req: Request<{}, {}, {}, GetArticlesByCategoryRequestBody>,
    res: Response
  ) => {
    try {
      if (!req.query.category) throw new Error("Category id not provided");
      const category = await CategoryModels.findOne({
        slug: req.query.category,
      });
      if (!category) throw new Error("Category not found");
      const { limit, maxLimit } = handleLimit(req.query.limit);
      const page = Number(req.query.page || 1);
      const count = await Article.countDocuments();
      const articles = await Article.aggregate([
        ...matchLookupFunc(category._id as string),
        ...lookupPipeline,
      ])
        .sort({ createdAt: req.query.sort || "desc" })
        .limit(limit)
        .skip((page - 1) * limit);
      res.status(200).json({
        articles: articles,
        page: page,
        limit: limit,
        maxLimit: maxLimit,
        totalArticles: count,
      });
    } catch (error) {
      throw new Error(error as string);
    }
  }
);

export { getArticlesByCategory };
