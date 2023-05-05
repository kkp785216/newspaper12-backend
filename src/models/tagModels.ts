import mongoose, { Document } from "mongoose"; // Erase if already required
import type { TagRequestBody } from "../constants/types";

interface TagModelWithDocument extends TagRequestBody, Document {}

// Declare the Schema of the Articles Model
const tagSchema = new mongoose.Schema<TagModelWithDocument>(
  {
    name: { type: String, require: true },
    slug: { type: String, require: true, unique: true },
    description: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Tag", tagSchema);
