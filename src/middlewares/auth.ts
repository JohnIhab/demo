import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";
import prisma from "../../prisma/client";
import CustomRequest from "../interfaces/customRequest";
import dotenv from 'dotenv';
dotenv.config();
export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;
    if (req.headers.authorization) {
      token = req.headers.authorization.replace("Bearer ", "");
    }
    if (!token) {
      return next(new ApiError("Token is require", 401));
    }
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        role: true,
      },
    });
    if (!user) {
      return next(new ApiError("Unauthorized", 401));
    }
    (req as CustomRequest).user = user.id;
    (req as CustomRequest).role = user.role;
    
    next();
  } catch (error) {
    next(new ApiError("Invalid Token", 401));
  }
};

