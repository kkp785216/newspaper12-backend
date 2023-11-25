import { Request, Response } from "express";
import Article from "../../../../models/articlesModels";
import expressAsyncHandler from "express-async-handler";
import {
  GetArticlesByTagRequestBody,
  GetArticlesByTagRequestBodyForAdmin,
} from "constants/articles-type";
import { matchLookupFunc } from "./_helper/matchLookup";
import { lookupPipeline } from "../_helper/relationshipPipeline";
import { handleLimit } from "../_helper/handleLimit";
import TagModals from "../../../../models/tagModels";
import mongoose from "mongoose";

type Params = {
  slug: string;
};

// Get Articles by categories
const getArticlesByTag = expressAsyncHandler(
  async (
    req: Request<Params, unknown, unknown, GetArticlesByTagRequestBody>,
    res: Response
  ) => {
    try {
      if (!req.params.slug) throw new Error("Tag id not provided");
      const tag = await TagModals.findOne({
        slug: req.params.slug,
      });
      if (!tag) throw new Error("Tag not found");
      const { limit, maxLimit } = handleLimit(req.query.limit);
      const page = Number(req.query.page || 1);
      const count = await Article.find({
        status: "published",
        tags: {
          $in: [new mongoose.Types.ObjectId(tag._id as string)],
        },
      }).countDocuments();
      const articles = await Article.aggregate([
        {
          $match: {
            status: "published", // Add this $match stage to filter by status
          },
        },
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

// Get Articles by categories
const getArticlesByTagForAdmin = expressAsyncHandler(
  async (
    req: Request<Params, unknown, unknown, GetArticlesByTagRequestBodyForAdmin>,
    res: Response
  ) => {
    try {
      if (!req.params.slug) throw new Error("Tag id not provided");
      const tag = await TagModals.findOne({
        slug: req.params.slug,
      });
      if (!tag) throw new Error("Tag not found");
      const { limit, maxLimit } = handleLimit(req.query.limit);
      const page = Number(req.query.page || 1);
      const status = req.query.status?.split(",");
      const count = await Article.find({
        ...(status ? { status: { $in: status } } : {}),
        tags: {
          $in: [new mongoose.Types.ObjectId(tag._id as string)],
        },
      }).countDocuments();
      const articles = await Article.aggregate([
        ...(status
          ? [
              {
                $match: {
                  status: { $in: status }, // Add this $match stage to filter by status
                },
              },
            ]
          : []),
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

export { getArticlesByTag, getArticlesByTagForAdmin };
