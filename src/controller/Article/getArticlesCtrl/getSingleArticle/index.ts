import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Article from "../../../../models/articlesModels";

type SingleArticleReqQeury = {
  slug: string;
};

// Get Articles by queries
const getSingleArticle = expressAsyncHandler(
  async (
    req: Request<SingleArticleReqQeury, unknown, unknown, unknown>,
    res: Response
  ) => {
    try {
      if (!req.params.slug) throw new Error("Slug is required");
      const article = await Article.findOne({ url: req.params.slug });
      res.status(200).json(article);
    } catch (error) {
      throw new Error(error as string);
    }
  }
);

export { getSingleArticle };
