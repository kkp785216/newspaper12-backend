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
import { generateRefreshToken } from "../config/refreshToken";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "mySecret";

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
          const filteredFindUsersRes = (() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, refreshToken, ...rest } =
              findUserRes as typeof findUserRes & { refreshToken: string };
            return rest;
          })();
          const refreshToken = generateRefreshToken(findUser?._id as ObjectId);
          /** Updating user and add refreshToken into that user document */
          await User.findByIdAndUpdate(
            findUser?.id,
            {
              refreshToken,
            },
            { new: true }
          );
          res.json({
            profile: filteredFindUsersRes,
            refreshToken,
            expiry: 72 * 60 * 60 * 1000,
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
    req: Request<unknown, unknown, UserProfileRequestBody> & {
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

const handleRefreshToken = expressAsyncHandler(
  async (
    req: Request<unknown, unknown, { refreshToken: string }>,
    res: Response
  ) => {
    try {
      const refreshToken = req.body.refreshToken;
      if (!refreshToken) throw new Error("No refresh token received");
      const user = await User.findOne({ refreshToken });
      if (!user)
        throw new Error("User not found by refreshToken or token expired");
      jwt.verify(refreshToken, JWT_SECRET, (error, decoded) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        if (error || (user._id as ObjectId).toString() !== decoded.id) {
          throw new Error("Something went wrong in refreshToken process");
        }
        const findUserRes = user.toJSON(); // converting MongoDB Object to a normal Object
        const filteredFindUsersRes = (() => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, refreshToken, ...rest } =
            findUserRes as typeof findUserRes & { refreshToken: string };
          return rest;
        })();
        const accessToken = generateToken(user._id as ObjectId);
        res.json({
          profile: filteredFindUsersRes,
          refreshToken,
          expiry: 72 * 60 * 60 * 1000,
          token: accessToken,
        });
      });
    } catch (error) {
      throw new Error(error as string);
    }
  }
);

export {
  createRegularUser,
  createUserByAdmin,
  loginUser,
  loginAdmin,
  handleRefreshToken,
};
