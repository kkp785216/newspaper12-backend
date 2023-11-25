import { Request, Response } from "express";
import Article from "../../models/articlesModels";
import expressAsyncHandler from "express-async-handler";
import { ArticleRequestBody, UserProfileResponse } from "../../constants/types";
import Category from "../../models/categoryModels";
import Tags from "../../models/tagModels";
import convertTitleToSlug from "../../utils/formatSlug";
import validateMongoDbId from "../../utils/validateMondoDbId";

// add Article
const addNewArticle = expressAsyncHandler(
  async (
    req: Request<unknown, unknown, ArticleRequestBody> & {
      user?: UserProfileResponse;
    },
    res: Response
  ) => {
    try {
      if (!req.user?._id) throw new Error("Unauthorized request!");
      const { _id: userId } = req.user;
      validateMongoDbId(userId);

      // taking values from request.body
      const {
        categories,
        tags,
        title,
        status,
        url,
        imgUrl,
        content,
        contentType,
        template,
        allowComment,
        publishedAt,
      } = req.body;

      // checking if categories exist in database
      if (categories && categories.length > 0) {
        const checkCategory = await Category.find({
          _id: { $in: categories },
        });
        if (checkCategory.length !== categories.length)
          throw new Error("Categories doesn't exist");
      }

      // checking if tags exist in database
      if (tags && tags.length > 0) {
        const checkTags = await Tags.find({
          _id: { $in: tags },
        });
        if (checkTags.length !== categories.length)
          throw new Error("Tags doesn't exist");
      }
      if (url !== convertTitleToSlug(url))
        throw new Error("url is not in the right format");

      // creating a new Article instanse
      const article = new Article({
        categories: categories || [],
        tags: tags || [],
        title: title,
        author: userId,
        status: status || "published",
        url: url,
        imgUrl,
        ...(content && { content }),
        ...(contentType && { contentType }),
        template: template || 0,
        allowComment: allowComment || true,
        publishedAt,
      });
      //save new article into database
      const response = await article.save();
      res.status(200).json(response);
    } catch (error) {
      throw new Error(error as string);
    }
  }
);

export { addNewArticle };
