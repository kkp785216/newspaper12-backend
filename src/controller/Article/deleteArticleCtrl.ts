import { Request, Response } from "express";
import Article from "../../models/articlesModels";
import expressAsyncHandler from "express-async-handler";

// Get Articles by queries
const deleteSingleArticle = expressAsyncHandler(
  async (
    req: Request<{ slug: string }, unknown, unknown, unknown>,
    res: Response
  ) => {
    try {
      if (!req.params.slug) throw new Error("Slug is required");
      const article = await Article.findOneAndDelete({ url: req.params.slug });
      res.status(200).json(article);
    } catch (error) {
      throw new Error(error as string);
    }
  }
);

export { deleteSingleArticle };
