// src/middleware/authenticate.ts
import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError'; // Adjust the import path as needed
import { getUserIdFromToken } from '../utils/tokenUtils'; // Adjust the import path as needed
import CustomRequest from "../interfaces/customRequest";

export function authenticate(req: Request, res: Response, next: NextFunction) {
    // Example logic to extract user ID from token
    const userId = getUserIdFromToken(req);
    console.log('Extracted User ID:', userId);

    if (userId) {
        (req as CustomRequest).user = userId;
        next();
    } else {
        next(new ApiError("User is not authenticated", 401));
    }
}
