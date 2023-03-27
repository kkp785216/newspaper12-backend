import { Request, Response } from 'express';
import User from '../models/userModels';
import expressAsyncHandler from 'express-async-handler';

// Get user profile
const getProfile = expressAsyncHandler(
    async (req: Request, res: Response) => {
        const { id: userId } = req.query;
        if (!req.query.id) throw new Error("Plz provide userId");
        try {
            const findUser = await User.findById(userId).select("-password");
            if (findUser) {
                // Send User Profile without Except Password
                res.send(findUser);
            }
            else {
                // User already exist
                throw new Error("User doesn't exist");
            }
        } catch (error: any) {
            throw new Error(error);
        }
    }
);


// Get user profile
const updateProfile = expressAsyncHandler(
    async (req: Request, res: Response) => {
        const { id: userId } = req.query;
        const { firstName, lastName, email, mobile } = req.body;

        /* Error Handling Start */
        const errors = [];
        if (!req.query.id) errors.push("Plz provide userId");
        if (firstName && firstName.length < 3) errors.push("FirstName can't be less than 3 characters");
        if (lastName && lastName.length < 3) errors.push("LastName can't be less than 3 characters");
        if (email) {
            if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) errors.push("Invalid email address");
            if (await User.findOne({ _id: userId, email })) errors.push("Email already in use!");
            else if (await User.findOne({ _id: { $ne: userId }, email })) errors.push("Email already exists!");
        }
        if (mobile) {
            if (!mobile.match(/^[0-9]{10}$/)) errors.push("Invalid mobile no.");
            if (await User.findOne({ _id: userId, mobile })) errors.push("Mobile already in use!");
            else if (await User.findOne({ _id: { $ne: userId }, mobile })) errors.push("Mobile no. already exists!");
        }
        if (errors.length > 0) throw new Error(errors.join(", "));
        /* Error Handling Complete */

        try {
            const newValue = Object.fromEntries(
                Object.entries({ firstName, lastName, email, mobile }).map(([key, value]) => [key, value || null])
            );
            const findUser = await User.findOneAndUpdate(
                { _id: userId },
                newValue,
                { new: true }
            ).select("-password");
            if (findUser) {
                // Send User Profile except Password
                res.send(findUser);
            }
            else {
                // User doesn't exist
                throw new Error("User doesn't exist");
            }
        } catch (error: any) {
            throw new Error(error);
        }
    }
);


// Delete user profile
const deleteProfile = expressAsyncHandler(
    async (req: Request, res: Response) => {
        const { id: userId } = req.query;
        if (!req.query.id) throw new Error("Plz provide userId");
        try {
            const findUser = await User.findByIdAndDelete(userId).select("-password");
            if (findUser) {
                // Send User Profile without Except Password
                res.send(findUser);
            }
            else {
                // User already exist
                throw new Error("User doesn't exist");
            }
        } catch (error: any) {
            throw new Error(error);
        }
    }
);

export { getProfile, deleteProfile, updateProfile };