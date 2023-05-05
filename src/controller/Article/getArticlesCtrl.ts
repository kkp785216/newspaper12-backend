import { Request, Response } from "express";
import Article from "../../models/articlesModels";
import expressAsyncHandler from "express-async-handler";

type AllArticles = {
  limit?: number;
  page?: number;
  sort?: "asc" | "desc";
};

type SingleArticle = {
  slug: string;
};

// type Popular = {
//     method: "popular",
//     limit?: number;
//     page?: number;
// }

// type MyUsesQuery =
//     AllArticles |
//     AllArticles |
//     Popular;

// Get Articles by queries
const getAllArticles = expressAsyncHandler(
  // eslint-disable-next-line @typescript-eslint/ban-types
  async (req: Request<{}, {}, {}, AllArticles>, res: Response) => {
    try {
      const maxLimit = 20;
      const limit = Number(
        req.query.limit
          ? req.query.limit <= maxLimit
            ? req.query.limit
            : maxLimit
          : maxLimit
      );
      const page = Number(req.query.page || 1);
      const count = await Article.find().count();
      const articles = await Article.find()
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
    } catch (error: any) {
      throw new Error(error);
    }
  }
);

// Get Articles by queries
const getSingleArticle = expressAsyncHandler(
  // eslint-disable-next-line @typescript-eslint/ban-types
  async (req: Request<SingleArticle, {}, {}, {}>, res: Response) => {
    try {
      if (!req.params.slug) throw new Error("Slug is required");
      const article = await Article.findOne({ url: req.params.slug });
      res.status(200).json(article);
    } catch (error: any) {
      throw new Error(error);
    }
  }
);

export { getAllArticles, getSingleArticle };
