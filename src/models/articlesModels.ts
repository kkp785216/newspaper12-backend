import mongoose, { Document, Schema } from "mongoose"; // Erase if already required
import type { ArticleRequestBody } from "./../constants/types";

interface ArticleModelWithDocument extends ArticleRequestBody, Document {}

// Declare the Schema of the Articles Model
const articleSchema = new mongoose.Schema<ArticleModelWithDocument>(
  {
    categories: { type: [Schema.Types.ObjectId], default: [] },
    tags: { type: [Schema.Types.ObjectId], default: [] },
    title: { type: String, require: true },
    description: { type: String, require: true },
    author: Schema.Types.ObjectId,
    status: {
      type: String,
      require: true,
      enum: ["published", "draft"],
      default: "published",
    },
    views: { type: Number, require: true, default: 0 },
    url: { type: String, require: true, unique: true },
    imgUrl: { type: String, default: null },
    content: { type: String, require: true },
    contentType: {
      type: String,
      enum: ["common", "video", "audio", "news"],
      default: "common",
    },
    template: { type: Number, default: 0 },
    allowComment: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Article", articleSchema);
