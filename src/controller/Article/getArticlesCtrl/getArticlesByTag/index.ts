import { Request, Response } from "express";
import Article from "../../../../models/articlesModels";
import expressAsyncHandler from "express-async-handler";
import { GetArticlesByTagRequestBody } from "constants/articles-type";
import { matchLookupFunc } from "./_helper/matchLookup";
import { lookupPipeline } from "../_helper/relationshipPipeline";
import { handleLimit } from "../_helper/handleLimit";
import TagModals from "../../../../models/tagModels";
import mongoose from "mongoose";

// Get Articles by categories
const getArticlesByTag = expressAsyncHandler(
  async (
    req: Request<unknown, unknown, unknown, GetArticlesByTagRequestBody>,
    res: Response
  ) => {
    try {
      if (!req.query.tag) throw new Error("Tag id not provided");
      const tag = await TagModals.findOne({
        slug: req.query.tag,
      });
      if (!tag) throw new Error("Tag not found");
      const { limit, maxLimit } = handleLimit(req.query.limit);
      const page = Number(req.query.page || 1);
      const count = await Article.find({
        tags: {
          $in: [new mongoose.Types.ObjectId(tag._id as string)],
        },
      }).countDocuments();
      const articles = await Article.aggregate([
        ...matchLookupFunc(tag._id as string),
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

export { getArticlesByTag };
