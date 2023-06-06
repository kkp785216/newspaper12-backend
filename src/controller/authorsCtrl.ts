import { Request, Response } from "express";
import User from "../models/userModels";
import expressAsyncHandler from "express-async-handler";

// Get all authors
const getAllAuthors = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const users = await User.find({ role: "admin" }).select([
        "-refreshToken",
        "-password",
      ]);
      res.status(200).json(users);
    } catch (error) {
      throw new Error(error as string);
    }
  }
);

export { getAllAuthors };
