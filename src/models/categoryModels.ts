import mongoose, { Document } from "mongoose"; // Erase if already required
import type { CategoryRequestBody } from "../constants/types";

interface CategoryModelWithDocument extends CategoryRequestBody, Document {}

// Declare the Schema of the Articles Model
const categorySchema = new mongoose.Schema<CategoryModelWithDocument>(
  {
    name: {
      type: String,
      require: true,
      message: "category name not provided",
    },
    slug: {
      type: String,
      require: true,
      unique: true,
      message: "slug not provided",
    },
    description: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Categorie", categorySchema);
