import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError';
import prisma from "../../prisma/client";
import jwt from 'jsonwebtoken';

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
        return next(new ApiError('Token is required', 401));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        const user = await prisma.user.findUnique({
        where: { id: (decoded as any).id },
        select: { role: true },
        });

        if (!user || user.role !== 'ADMIN') {
        return next(new ApiError('Access denied. Admins only.', 403));
        }

        next();
    } catch (error) {
        next(new ApiError('Unauthorized', 401));
    }
};
