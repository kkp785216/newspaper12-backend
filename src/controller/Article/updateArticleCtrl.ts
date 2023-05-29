import { Request, Response } from "express";
import Article from "../../models/articlesModels";
import expressAsyncHandler from "express-async-handler";
import { ArticleRequestBody, UserProfileResponse } from "../../constants/types";
import Category from "../../models/categoryModels";
import Tags from "../../models/tagModels";
import convertTitleToSlug from "../../utils/formatSlug";
import validateMongoDbId from "../../utils/validateMondoDbId";

/* TO DO: make it for update article it is currently for add article */

// add Article
const updateArticle = expressAsyncHandler(
  async (
    req: Request<{ slug: string }, unknown, ArticleRequestBody> & {
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
        if (checkTags.length !== tags.length)
          throw new Error("Tags doesn't exist");
      }

      // updating existing article from db
      const article = await Article.findOneAndUpdate(
        { url: req.params.slug },
        {
          ...(categories && { categories }),
          ...(tags && { tags }),
          ...(title && { title }),
          ...(userId && { author: userId }),
          ...(status && { status }),
          ...(url && { url: convertTitleToSlug(url) }),
          ...(imgUrl && { imgUrl }),
          ...(content && { content }),
          ...(contentType && { contentType }),
          ...(template && { template }),
          ...(allowComment && { allowComment }),
        },
        { new: true }
      );
      res.status(200).json(article);
    } catch (error) {
      throw new Error(error as string);
    }
  }
);

export { updateArticle };
