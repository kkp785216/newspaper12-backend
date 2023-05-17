import mongoose, { Document, Schema } from "mongoose"; // Erase if already required
import type { ArticleRequestBody } from "../constants/types";

interface ArticleModelWithDocument extends ArticleRequestBody, Document {}

// Declare the Schema of the Articles Model
const articleSchema = new mongoose.Schema<ArticleModelWithDocument>(
  {
    categories: { type: [Schema.Types.ObjectId], default: [] },
    tags: { type: [Schema.Types.ObjectId], default: [] },
    title: {
      type: String,
      require: true,
      message: "title not provided",
      min: [3, "Titie can't be less than 3 characters"],
      max: [150, "Title can't be greater than 150 words"],
    },
    description: { type: String, require: true },
    author: Schema.Types.ObjectId,
    status: {
      type: String,
      require: true,
      enum: {
        values: ["published", "draft"],
        message: "status '{VALUE}' is not supported",
      },
      default: "published",
    },
    views: { type: Number, default: 0 },
    url: {
      type: String,
      require: true,
      unique: true,
      message: "url not provided",
    },
    imgUrl: {
      type: String,
      require: true,
      message: "image url not provided",
    },
    content: { type: String, default: null },
    contentType: {
      type: String,
      enum: {
        values: ["post", "video", "audio", "news"],
        message: "contentType '{VALUE}' is not supported",
      },
      default: "post",
    },
    template: { type: Number, default: 0 },
    allowComment: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Article", articleSchema);
export type { ArticleModelWithDocument };
