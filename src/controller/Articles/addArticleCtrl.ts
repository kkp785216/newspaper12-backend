import { Request, Response } from 'express';
import Article from '../../models/articlesModels';
import expressAsyncHandler from 'express-async-handler';
import { ArticleRequestBody } from 'constants/types';
import Category from '../../models/categoryModels';
import Tags from '../../models/tagModels';
import convertTitleToSlug from '../../utility/formatSlug';

// add Article 
const addNewArticle = expressAsyncHandler(
    async (req: Request<{}, {}, ArticleRequestBody>, res: Response) => {
        // taking values from request.body
        const {
            categories,
            tags,
            title,
            author,
            status,
            url,
            imgUrl,
            content,
            contentType,
            template,
            allowComment
        } = req.body;

        // Error Handling
        let errArr = [];
        if (!title) errArr.push("title not provided");
        if (!author) errArr.push("author not provided");
        if (!title) errArr.push("title not provided");
        if (!url) errArr.push("url not provided");
        if (!imgUrl) errArr.push("image url not provided");
        if (errArr.length > 0) throw new Error(errArr.join(", "));

        try {
            // checking if categories exist in database
            if (categories && categories.length > 0) {
                const checkCategory = await Category.find({
                    '_id': { $in: categories }
                });
                if (checkCategory.length !== categories.length) throw new Error("Categories doesn't exist");
            }

            // checking if tags exist in database
            if (tags && tags.length > 0) {
                const checkTags = await Tags.find({
                    '_id': { $in: tags }
                });
                if (checkTags.length !== categories.length) throw new Error("Tags doesn't exist");
            }

            // creating a new Article instanse
            const article = new Article({
                category: categories || [],
                tags: tags || [],
                title: title,
                author: author,
                status: status || 'published',
                url: convertTitleToSlug(url),
                imgUrl: imgUrl || null,
                content: content || null,
                contentType: contentType || 'common',
                template: template || 0,
                allowComment: allowComment || true
            });
            //save new article into database
            let response = await article.save();
            res.status(200).json(response);
        } catch (error: any) {
            throw new Error(error);
        }
    }
)

export { addNewArticle };