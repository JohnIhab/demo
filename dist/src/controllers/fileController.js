"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = __importDefault(require("../utils/response"));
const content_1 = __importDefault(require("../services/services/content"));
class conttentController {
    deleteContent(arg0, deleteContent) {
        throw new Error('Method not implemented.');
    }
    async getAllContent(req, res, next) {
        try {
            const Term = await content_1.default.getAllContent();
            (0, response_1.default)(res, 201, { status: true, message: "All Content!", data: Term });
        }
        catch (error) {
            next(error);
        }
    }
    async getContentByTermId(req, res, next) {
        try {
            const termId = parseInt(req.params.id, 10);
            const Term = await content_1.default.getContentByTermId(termId);
            (0, response_1.default)(res, 201, Term);
        }
        catch (error) {
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
    async deleteTerm(req, res, next) {
        try {
            const Term = await content_1.default.deleteContent(req.params.id);
            (0, response_1.default)(res, 201, { status: true, message: "Account delete successfully!", data: Term });
        }
        catch (error) {
            next(error);
        }
    }
}
const contentController = new conttentController();
exports.default = contentController;
//# sourceMappingURL=fileController.js.map