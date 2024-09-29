import { NextFunction, Request, Response } from "express";
import userService from "../services/userService";
import response from "../utils/response";
import ApiError from "../utils/ApiError";
import CustomRequest from "../interfaces/customRequest";
import termService from "../services/termService";
class TermController {

    async getAllTerms(req: Request, res: Response, next: NextFunction){
    
        try {
            const Term = await termService.getAllTerms();
            response(res, 201, {status: true, message: "All term!", data: Term});
        } catch (error) {
            next(error);
        }
    }
    async getTermsByCourseId(req: Request, res: Response, next: NextFunction){
    
        try {
            const { courseFor , id  } = req.params;
            const isValidCourseFor = await termService.checkCourseFor(id, courseFor);
        
           /* if (!isValidCourseFor) {
                return response(res, 400, {status: false, message: "Invalid courseFor value!"});
            }*/
            const Term = await termService.getTermsByCourseId(id , courseFor);
            response(res, 201, {status: true, message: "Term successfully!", data: Term});
        } catch (error) {
            next(error);
        }
    }
    async createTerm(req: Request, res: Response, next: NextFunction){
    
        try {
            const Term = await termService.createTerm(req.params.id,req.body);
            response(res, 201, {status: true, message: "Account term successfully!", data: Term});
        } catch (error) {
            next(error);
        }
    }
    async updateterm(req: Request, res: Response, next: NextFunction){
    
        try {
            const Term = await termService.updateTerm(req.params.id,req.body);
            response(res, 201, {status: true, message: "Account updated successfully!", data: Term});
        } catch (error) {
            next(error);
        }
    }
    async deleteTerm(req: Request, res: Response, next: NextFunction){
    
        try {
            const Term = await termService.deleteTerm(req.params.id);
            response(res, 201, {status: true, message: "Account delete successfully!", data: Term});
        } catch (error) {
            next(error);
        }
    }
    async toggleLockTerm(req: Request, res: Response, next: NextFunction){
    

        try {
            const termId = parseInt(req.params.id, 10);
            if (isNaN(termId)) {
                return res.status(400).json({ status: false, message: 'Invalid term ID' });
            }
    
            const result = await termService.toggleLockTerm(termId.toString());
            response(res, 201, {status: true,message: result.message, data: result.term});
        } catch (error) {
            next(error);
        }
    }
    async updateTerms(req: Request, res: Response, next: NextFunction){
        try {
            const result = await termService.updateTerms();
        } catch (error) {
            next(error);
        }
    }
    async token(req: Request, res: Response, next: NextFunction){
        try {
            const result = await termService.token();
        } catch (error) {
            next(error);
        }
    }


}
const termController = new TermController();
export default termController;