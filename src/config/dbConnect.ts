import mongoose from "mongoose";
import { config } from "dotenv";

// to load env file
config();

const DB_URI = process.env.DB_URI || "";

/**
 * @dbConnect this function is used for connect database
 */
const dbConnect = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default dbConnect;
