import { Request, Response } from "express";
import User from "../models/userModels";
import expressAsyncHandler from "express-async-handler";
import validateMongoDbId from "../utils/validateMondoDbId";
import { UserProfileRequestBody } from "../constants/types";

// Get user profile
const getProfile = expressAsyncHandler(async (req: Request, res: Response) => {
  const { id: userId } = req.params;
  validateMongoDbId(userId);
  try {
    const findUser = await User.findById(userId).select("-password");
    if (findUser) {
      // Send User Profile without Except Password
      res.send(findUser);
    } else {
      // User already exist
      throw new Error("User doesn't exist");
    }
  } catch (error) {
    throw new Error(error as string);
  }
});

// Get user profile
const updateProfile = expressAsyncHandler(
  async (
    req: Request<{ id: string }, unknown, UserProfileRequestBody>,
    res: Response
  ) => {
    const { id: userId } = req.params;
    validateMongoDbId(userId);
    const { firstName, lastName, email, mobile } = req.body;

    /* Error Handling Start */
    const errors = [];
    if (email) {
      if (await User.findOne({ _id: userId, email }))
        errors.push("Email already in use!");
      else if (await User.findOne({ _id: { $ne: userId }, email }))
        errors.push("Email already exists!");
    }
    if (mobile) {
      if (await User.findOne({ _id: userId, mobile }))
        errors.push("Mobile already in use!");
      else if (await User.findOne({ _id: { $ne: userId }, mobile }))
        errors.push("Mobile no. already exists!");
    }
    if (errors.length > 0) throw new Error(errors.join(", "));
    /* Error Handling Complete */

    try {
      const newValue = Object.fromEntries(
        Object.entries({ firstName, lastName, email, mobile }).map(
          ([key, value]) => [key, value || null]
        )
      );
      const findUser = await User.findOneAndUpdate({ _id: userId }, newValue, {
        new: true,
      }).select("-password");
      if (findUser) {
        // Send User Profile except Password
        res.send(findUser);
      } else {
        // User doesn't exist
        throw new Error("User doesn't exist");
      }
    } catch (error) {
      throw new Error(error as string);
    }
  }
);

// Delete user profile
const deleteProfile = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id: userId } = req.params;
    validateMongoDbId(userId);
    try {
      const findUser = await User.findByIdAndDelete(userId).select("-password");
      if (findUser) {
        // Send User Profile without Except Password
        res.send(findUser);
      } else {
        // User already exist
        throw new Error("User doesn't exist");
      }
    } catch (error) {
      throw new Error(error as string);
    }
  }
);

export { getProfile, deleteProfile, updateProfile };
