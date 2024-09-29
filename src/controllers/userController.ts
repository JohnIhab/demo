import { NextFunction, Request, Response } from "express";
import userService from "../services/userService";
import response from "../utils/response";
import ApiError from "../utils/ApiError";
import CustomRequest from "../interfaces/customRequest";

class UserController {

    async contect_us(req: Request, res: Response, next: NextFunction){
        try {
            const userid = (req as CustomRequest).user;
            console.log('User ID:', userid);
            console.log('User ID Type:', typeof userid);
            if (typeof userid !== 'number') {
                throw new ApiError("Invalid user ID", 400);
            }
            if (!userid) {
                throw new ApiError("User is not authenticated", 401);
            }
            console.log(userid);
            
            const contect = await userService.contect_us( userid ,req.body);
            response(res, 201, {status: true, message: "send your messsage", data: contect});
        } catch (error) {
            next(error);
        }
    }
    async view_user(req: Request, res: Response, next: NextFunction){
        try {
            if(req.file){
                req.body.avatar = req.file.path
            }
            const user = await userService.view_user();
            response(res, 201, {status: true, message: "all users ", data: user});
        } catch (error) {
            next(error);
        }
    }
    async view_one_user(req: Request, res: Response, next: NextFunction){
        try {
            const userid = (req as CustomRequest).user;
            if (typeof userid !== 'number') {
                throw new ApiError("Invalid user ID", 400);
            }
            if (!userid) {
                throw new ApiError("User is not authenticated", 401);
            }
            const user = await userService.view_one_user(userid);
            response(res, 201, {status: true, message: "user profile ", data: user});
        } catch (error) {
            next(error);
        }
    }
    async update_user(req: Request, res: Response, next: NextFunction){
        try {
            const userid = (req as CustomRequest).user;
            if (typeof userid !== 'number') {
                throw new ApiError("Invalid user ID", 400);
            }
            if (!userid) {
                throw new ApiError("User is not authenticated", 401);
            }
            const user = await userService.update_user(userid , req.body);
            response(res, 201, {status: true, message: "User updated successfully", data: user});
        } catch (error) {
            next(error);
        }
    }
    async getBlockedUsers(req: Request, res: Response, next: NextFunction){
        try {
            const user = await userService.getBlockedUsers();
            response(res, 201, {status: true, message: "all users bloked ", data: user});
        } catch (error) {
            next(error);
        }
    }
    async toggleBlockUser(req: Request, res: Response, next: NextFunction){
        try {
            const userId = parseInt(req.params.id, 10)
            const result = await userService.toggleBlockUser(userId);
            response(res, 201, { status: true,message: result.message,data: result.user});
        } catch (error) {
            next(error);
        }
    }
    async deleteUser(req: Request, res: Response, next: NextFunction){
        try {
            const userId = parseInt(req.params.id, 10); // Extract userId from request body
            const user = await userService.deleteUser(userId);
            response(res, 201, {status: true, message: "User delete successfully", data: user});
        } catch (error) {
            next(error);
        }
    }
    
}
const userController = new UserController();
export default userController;