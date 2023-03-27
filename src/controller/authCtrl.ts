import { Request, Response } from 'express';
import User from '../models/userModels';
import expressAsyncHandler from 'express-async-handler';
import type { LoginRequestBody } from 'constants/types';
import { generateToken } from '../config/jwtToken';

// Create a new user
const createUser = expressAsyncHandler(
    async (req: Request, res: Response) => {
        const { email } = req.body;
        const findUser = await User.findOne({ email });
        if (!findUser) {
            // Create a new user
            const newUser = await User.create(req.body);
            res.json(newUser);
        }
        else {
            // User already exist
            throw new Error("User already exists!");
        }
    }
);

// Login existing user
const loginUser = expressAsyncHandler(
    async (req: Request, res: Response) => {
        const { email, password }: LoginRequestBody = req.body;
        // Check if user exist or not
        const findUser = await User.findOne({ email });
        if (findUser) {
            if (await findUser.isPasswordMatched(password)) {
                const findUserRes = findUser.toJSON(); // converting MongoDB Object to a normal Object
                const { password, ...rest } = findUserRes; // removing "password" field from response
                res.json({
                    ...rest,
                    token: generateToken(findUser._id as any)
                }); // sending user detail without "password"
            }
            else {
                throw new Error("Incorrect Password!");
            }
        }
        else {
            throw new Error("User doesn't exist!");
        }
    }
)

export { createUser, loginUser };