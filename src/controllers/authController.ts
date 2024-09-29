import { NextFunction, Request, Response } from "express";
import authService from "../services/authService";
import response from "../utils/response";
import signToken from "../utils/signToken";
import sendMail from "../utils/sendMails";
import pug from "pug";
import ApiError from "../utils/ApiError";
import CustomRequest from "../interfaces/customRequest";
import { verifyEmailType } from "../types/authType";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const signToken1 = (user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    googleId: string;
    password: string;
    schooleYear: string;
    mobileNumber: string;
    role: string;
    block: boolean;
    avatar: string;
    verificationCode: string | null;
    emailverified: boolean;
    verificationToken: string | null;
    verificationTokenExpiresAt: Date | null;
    lastLogout: Date | null;
    isResetCodeVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    }) => {
        return jwt.sign(user,'hend33', {
        expiresIn: '1h',
        });
    };
class AuthController {
    async signUpUser(req: Request, res: Response, next: NextFunction){
        try {
            if(req.file){
                req.body.avatar = req.file.path
            }
            const user = await authService.signUp(req.body, req.body.role);
            response(res, 201, {status: true, message: "Account created successfully!", data: user });
        } catch (error) {
            next(error);
        }
    }

    async login(req: Request, res: Response, next: NextFunction){
        try {
            const { identifier, password } = req.body;
            // Call the updated login method in the authService
            const user = await authService.login(identifier, password);
            // delete user.password // remove password from the response
            const token = signToken({id: user.id})
            response(res, 200, {status: true, message: "Login successful!", data: {token , user} });
        } catch (error) {
            next(error);
        }
    }
    async googleAuthCallback(req: Request, res: Response, next: NextFunction) {
        try {
          // توليد JWT Token
        const user = req.user as any;

          // Generate JWT Token with all user data
        const token = signToken1({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            googleId: user.googleId,
            password: user.password, // Be cautious with sensitive data
            schooleYear: user.schooleYear,
            mobileNumber: user.mobileNumber,
            role: user.role,
            block: user.block,
            avatar: user.avatar,
            verificationCode: user.verificationCode,
            emailverified: user.emailverified,
            verificationToken: user.verificationToken,
            verificationTokenExpiresAt: user.verificationTokenExpiresAt,
            lastLogout: user.lastLogout,
            isResetCodeVerified: user.isResetCodeVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            });
        
            // Build the URL with data as query parameters
            const frontendUrl = `http://localhost:5173/auth/google/callback?token=${encodeURIComponent(token)}`;
        
            // Redirect to the frontend URL with query parameters
            res.redirect(frontendUrl);
            } catch (error) {
            next(error); // تمرير أي أخطاء إلى الـ middleware الخاص بالتعامل مع الأخطاء
            }
        }
    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const userid = (req as CustomRequest).user;
            if (typeof userid !== 'number') {
                throw new ApiError("Invalid user ID", 400);
            }
            if (!userid) {
                throw new ApiError("User is not authenticated", 401);
            }
            const usert = await authService.logout(userid);

            response(res, 200, { status: true, message: "Logout successful!" });
            } catch (error) {
            next(error); // Pass any errors to the error handling middleware
            }
        }

        async verifyEmail(req: Request, res: Response, next: NextFunction){
            try {
                const { token } = req.query; // Extract token from query parameters

                if (typeof token !== 'string') {
                    return res.status(400).json({ message: 'Invalid token' });
                }
                const data: verifyEmailType = {
                    token
                };
    
                const user = await authService.verifyEmail(data);
                response(res, 201, {status: true, message: " verify successfully!", data: user });
            } catch (error) {
                next(error);
            }
        }

    async forgetPassword(req: Request, res: Response, next: NextFunction){
        try {
            const user = await authService.forgetPassword(req.body.email);
            response(res, 200, {status: true, message: "Reset Code Sent Successfully"});
        } catch (error) {
            next(error);
        }
    }

    async verifyResetCode(req: Request, res: Response, next: NextFunction){
        try {
            await authService.verifyResetPasswordCode(req.body.email, req.body.code.toString());
            response(res, 200, {status: true, message: "Code Verified Successfully"});
        } catch (error) {
            next(error);
        }
    }

    async resetPassword(req: Request, res: Response, next: NextFunction){
        try {
            await authService.resetPassword(req.body.email, req.body.password);
            response(res, 200, {status: true, message: "Password reset successfully"});
        } catch (error) {
            next(error);
        }
    }
}
const authController = new AuthController();
export default authController;