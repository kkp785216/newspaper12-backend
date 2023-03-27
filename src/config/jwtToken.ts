import jwt from 'jsonwebtoken'
import { config } from 'dotenv';
import { Types } from 'mongoose';

// load env file
config();

const JWT_SECRET = process.env.JWT_SECRET || "mySecret";

/**
 * It used to generate JWT toke which will expires in 3 days
 * @param id userId
 * @returns JWT Token
 */
// const generateToken = (id: Types.ObjectId) => {
const generateToken = (id: Types.ObjectId) => {
    return jwt.sign({id}, JWT_SECRET, { expiresIn: '3d' });
}

export { generateToken };