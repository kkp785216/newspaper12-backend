import { Request, Response } from "express";
import User from "../models/userModels";
import expressAsyncHandler from "express-async-handler";
import type {
  LoginRequestBody,
  UserProfileRequestBody,
  UserProfileResponse,
} from "../constants/types";
import { generateToken } from "../config/jwtToken";
import { ObjectId } from "mongoose";
import validateMongoDbId from "../utils/validateMondoDbId";

// ####################################################### Anyone  #############################

// Create a new user
const createRegularUser = expressAsyncHandler(
  async (
    req: Request<unknown, unknown, UserProfileRequestBody>,
    res: Response
  ) => {
    try {
      const { email, role, firstName, mobile, password, lastName } = req.body;
      if (role && role !== "user")
        throw new Error("You don't have to premission to create a admin user");
      const findUser = await User.findOne({ email });
      if (!findUser) {
        // Create a new user
        const newUser = await User.create({
          email,
          firstName,
          mobile,
          password,
          lastName,
        });
        res.json(newUser);
      } else {
        // User already exist
        throw new Error("User already exists!");
      }
    } catch (error) {
      throw new Error(error as string);
    }
  }
);

// Login existing user
const loginUser = expressAsyncHandler(
  async (
    req: Request<unknown, unknown, UserProfileRequestBody>,
    res: Response
  ) => {
    try {
      const { email, password }: LoginRequestBody = req.body;
      // Check if user exist or not
      const findUser = await User.findOne({ email });
      if (findUser) {
        if (await findUser.isPasswordMatched(password)) {
          const findUserRes = findUser.toJSON(); // converting MongoDB Object to a normal Object
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, ...rest } = findUserRes; // removing "password" field from response
          res.json({
            ...rest,
            token: generateToken(findUser._id as ObjectId),
          }); // sending user detail without "password"
        } else {
          throw new Error("Incorrect Password!");
        }
      } else {
        throw new Error("User doesn't exist!");
      }
    } catch (error) {
      throw new Error(error as string);
    }
  }
);

// ####################################################### Admin  #############################

// Create a new user
const createUserByAdmin = expressAsyncHandler(
  async (
    // eslint-disable-next-line @typescript-eslint/ban-types
    req: Request<{}, {}, UserProfileRequestBody> & {
      user?: UserProfileResponse;
    },
    res: Response
  ) => {
    try {
      if (!req.user) throw new Error("Unauthorized request!");
      const { _id: userId } = req.user;
      validateMongoDbId(userId);

      const { email, role, firstName, mobile, password, lastName } = req.body;
      const findUser = await User.findOne({ email });
      if (!findUser) {
        // Create a new user
        const newUser = await User.create({
          email,
          role,
          firstName,
          mobile,
          password,
          lastName,
        });
        res.json(newUser);
      } else {
        // User already exist
        throw new Error("User already exists!");
      }
    } catch (error) {
      throw new Error(error as string);
    }
  }
);

// Login existing Admin
const loginAdmin = expressAsyncHandler(
  async (
    req: Request<unknown, unknown, UserProfileRequestBody>,
    res: Response
  ) => {
    try {
      const { email, password }: LoginRequestBody = req.body;
      // Check if user exist or not
      const findUser = await User.findOne({ email });
      if (findUser) {
        if (await findUser.isPasswordMatched(password)) {
          const findUserRes = findUser.toJSON(); // converting MongoDB Object to a normal Object
          if (findUserRes.role !== "admin")
            throw new Error("You are not an Admin");
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, ...rest } = findUserRes; // removing "password" field from response
          res.json({
            ...rest,
            token: generateToken(findUser._id as ObjectId),
          }); // sending user detail without "password"
        } else {
          throw new Error("Incorrect Password!");
        }
      } else {
        throw new Error("User doesn't exist!");
      }
    } catch (error) {
      throw new Error(error as string);
    }
  }
);

export { createRegularUser, createUserByAdmin, loginUser, loginAdmin };
