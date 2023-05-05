import { Request, Response } from "express";
import User from "../models/userModels";
import expressAsyncHandler from "express-async-handler";
import validateMongoDbId from "../utils/validateMondoDbId";
import {
  UserProfileRequestBody,
  UserProfileResponse,
} from "../constants/types";

// Get user profile
const getProfile = expressAsyncHandler(
  async (req: Request & { user?: UserProfileResponse }, res: Response) => {
    if (!req.user?._id) throw new Error("Unauthorized request!");
    const { _id: userId } = req.user;
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
  }
);

// Get user profile
const updateProfile = expressAsyncHandler(
  async (
    req: Request<unknown, unknown, UserProfileRequestBody> & {
      user?: UserProfileResponse;
    },
    res: Response
  ) => {
    if (!req.user?._id) throw new Error("Unauthorized request!");
    const { _id: userId } = req.user;
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
    if (errors.length > 0)
      throw Object.assign(new Error("Couldn't update profile"), {
        messages: errors,
      });
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

export { getProfile, updateProfile };
