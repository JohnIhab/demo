import { NextFunction, Request, Response } from "express";
import adminService from "../services/adminService";
import response from "../utils/response";
import ApiError from "../utils/ApiError";
import CustomRequest from "../interfaces/customRequest";

class AdminController {

    async v_contect(req: Request, res: Response, next: NextFunction){
        try {
            const accpted = await adminService.contect();
            response(res, 201, {status: true, message: "All contact messages retrieved", data: accpted});
        } catch (error) {
            next(error);
        }
    }
    async deletecontect_us(req: Request, res: Response, next: NextFunction){
        try {
            const accpted = await adminService.deletecontect_us(req.params.id);
            response(res, 201, {status: true, message: "the contact message delete", data: accpted});
        } catch (error) {
            next(error);
        }
    }
    async view_user(req: Request, res: Response, next: NextFunction){
        try {
            if(req.file){
                req.body.avatar = req.file.path
            }
            const user = await adminService.view_user();
            response(res, 201, {status: true, message: "all users ", data: user});
        } catch (error) {
            next(error);
        }
    }

}
const adminController = new AdminController();
export default adminController;