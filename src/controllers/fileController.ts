import { NextFunction, Request, Response } from "express";
import response from "../utils/response";
import ContentService from "../services/services/content";
class conttentController {
    deleteContent(arg0: string, deleteContent: any) {
        throw new Error('Method not implemented.');
    }

    async getAllContent(req: Request, res: Response, next: NextFunction){
    
        try {
            const Term = await ContentService.getAllContent();
            response(res, 201, {status: true, message: "All Content!", data: Term});
        } catch (error) {
            next(error);
        }
    }
    async getContentByTermId(req: Request, res: Response, next: NextFunction){
    
        try {
            const termId = parseInt(req.params.id, 10);
            const Term = await ContentService.getContentByTermId(termId);
            response(res, 201, Term);
        } catch (error) {
            next(error);
        }
    }
/*
    async createTerm(req: Request, res: Response, next: NextFunction){
    
        try {
            const Term = await ContentService.createContent(req.params.id,req.body);
            response(res, 201, {status: true, message: "Account term successfully!", data: Term});
        } catch (error) {
            next(error);
        }
    }
    async updateterm(req: Request, res: Response, next: NextFunction){
    
        try {
            const Term = await ContentService.updateTerm(req.params.id,req.body);
            response(res, 201, {status: true, message: "Account updated successfully!", data: Term});
        } catch (error) {
            next(error);
        }
    }*/
    async deleteTerm(req: Request, res: Response, next: NextFunction){
    
        try {
            const Term = await ContentService.deleteContent(req.params.id);
            response(res, 201, {status: true, message: "Account delete successfully!", data: Term});
        } catch (error) {
            next(error);
        }
    }


}
const contentController = new conttentController();
export default contentController;


