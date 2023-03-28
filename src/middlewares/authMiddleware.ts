import Users from "../models/userModels";
import jwt from "jsonwebtoken";
import expressAsyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";

const authMiddleware = expressAsyncHandler(
    async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
        let token;
        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
            try {
                if (token) {
                    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "");
                    const user = await Users.findById(decoded?.id);
                    req.user = user;
                    next();
                }
            } catch (error) {
                throw new Error("Unauthrized: token expired plz login again");
            }
        } else {
            throw new Error("No Access token received");
        }
    }
);

const isAdmin = expressAsyncHandler(
    async (req: any, res, next) => {
        try {
            const { _id: userId } = req.user;
            const adminUser: any = await Users.findById(userId);
            if (adminUser.role !== "admin") {
                throw new Error("You are not an admin user");
            }
            else {
                next();
            }
        } catch (error) {
            throw new Error(error as any);
        }
    }
)

export { authMiddleware, isAdmin };