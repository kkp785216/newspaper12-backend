import { Request, Response } from "express";
import Article from "../../models/articlesModels";
import expressAsyncHandler from "express-async-handler";
import { ArticleRequestBody } from "constants/types";
import Category from "../../models/categoryModels";
import Tags from "../../models/tagModels";
import convertTitleToSlug from "../../utils/formatSlug";
import validateMongoDbId from "../../utils/validateMondoDbId";

// add Article
const addNewArticle = expressAsyncHandler(
  async (
    // eslint-disable-next-line @typescript-eslint/ban-types
    req: Request<{}, {}, ArticleRequestBody> & { user?: any },
    res: Response
  ) => {
    const { _id: userId } = req.user;
    validateMongoDbId(userId as string);

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

    // Error Handling
    const errArr = [];
    if (!title) errArr.push("title not provided");
    if (!title) errArr.push("title not provided");
    if (!url) errArr.push("url not provided");
    if (!imgUrl) errArr.push("image url not provided");
    if (errArr.length > 0) throw new Error(errArr.join(", "));

    try {
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

      // creating a new Article instanse
      const article = new Article({
        categories: categories || [],
        tags: tags || [],
        title: title,
        author: userId,
        status: status || "published",
        url: convertTitleToSlug(url),
        imgUrl: imgUrl || null,
        content: content || null,
        contentType: contentType || "common",
        template: template || 0,
        allowComment: allowComment || true,
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
