import { Request, Response } from "express";
import Article from "../../../../models/articlesModels";
import expressAsyncHandler from "express-async-handler";
import { GetAllArticlesRequestBody } from "constants/articles-type";
import { lookupPipeline } from "../_helper/relationshipPipeline";
import { handleLimit } from "../_helper/handleLimit";
import { GetAllArticlesResponse } from "constants/types";

// Get Articles by queries
const getAllArticles = expressAsyncHandler(
  async (
    req: Request<unknown, unknown, unknown, GetAllArticlesRequestBody>,
    res: Response
  ) => {
    try {
      const { limit, maxLimit } = handleLimit(req.query.limit);
      const page = Number(req.query.page || 1);
      const count = await Article.countDocuments();
      const articles = await Article.aggregate<GetAllArticlesResponse>(
        lookupPipeline
      )
        .sort({ createdAt: req.query.sort || "desc" })
        .limit(limit)
        .skip((page - 1) * limit);
      res.status(200).json({
        articles,
        page,
        limit,
        maxLimit,
        totalArticles: count,
      });
    } catch (error) {
      throw new Error(error as string);
    }
  }
);

export { getAllArticles };
