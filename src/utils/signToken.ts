import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();
export default (payload: {id: number}) => {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRATION_TIME
    });
}