import Users from "../models/userModels";
import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import { UserProfileResponse } from "../constants/types";

const authMiddleware = expressAsyncHandler(
  async (
    req: Request & { user?: UserProfileResponse },
    _res: Response,
    next: NextFunction
  ) => {
    let token;
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
      try {
        if (token) {
          if (!process.env.JWT_SECRET)
            throw new Error("JWT_SECRET not found in environment");
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          if (typeof decoded === "string")
            throw new Error("Invalid Access Token");
          const user: UserProfileResponse | null = await Users.findById(
            decoded?.id
          );
          if (!user) throw new Error("User not found");
          req.user = user;
          next();
        }
      } catch (error) {
        if (!process.env.JWT_SECRET) throw new Error(error as string);
        throw new Error("Unauthrized: token expired plz login again");
      }
    } else {
      throw new Error("No Access token received");
    }
  }
);

const isAdmin = expressAsyncHandler(
  async (req: Request & { user?: UserProfileResponse }, _res, next) => {
    if (!req.user) throw new Error("No user received!");
    try {
      const { _id: userId } = req.user;
      const adminUser: UserProfileResponse | null = await Users.findById(
        userId
      );
      if (adminUser && adminUser.role !== "admin") {
        throw new Error("You are not an admin user");
      } else {
        next();
      }
    } catch (error) {
      throw new Error(error as string);
    }
  }
);

export { authMiddleware, isAdmin };
