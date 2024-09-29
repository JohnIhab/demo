"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = __importDefault(require("../utils/response"));
const termService_1 = __importDefault(require("../services/termService"));
class TermController {
    async getAllTerms(req, res, next) {
        try {
            const Term = await termService_1.default.getAllTerms();
            (0, response_1.default)(res, 201, { status: true, message: "All term!", data: Term });
        }
        catch (error) {
            next(error);
        }
    }
    async getTermsByCourseId(req, res, next) {
        try {
            const { courseFor, id } = req.params;
            const isValidCourseFor = await termService_1.default.checkCourseFor(id, courseFor);
            /* if (!isValidCourseFor) {
                 return response(res, 400, {status: false, message: "Invalid courseFor value!"});
             }*/
            const Term = await termService_1.default.getTermsByCourseId(id, courseFor);
            (0, response_1.default)(res, 201, { status: true, message: "Term successfully!", data: Term });
        }
        catch (error) {
            next(error);
        }
    }
    async createTerm(req, res, next) {
        try {
            const Term = await termService_1.default.createTerm(req.params.id, req.body);
            (0, response_1.default)(res, 201, { status: true, message: "Account term successfully!", data: Term });
        }
        catch (error) {
            next(error);
        }
    }
    async updateterm(req, res, next) {
        try {
            const Term = await termService_1.default.updateTerm(req.params.id, req.body);
            (0, response_1.default)(res, 201, { status: true, message: "Account updated successfully!", data: Term });
        }
        catch (error) {
            next(error);
        }
    }
    async deleteTerm(req, res, next) {
        try {
            const Term = await termService_1.default.deleteTerm(req.params.id);
            (0, response_1.default)(res, 201, { status: true, message: "Account delete successfully!", data: Term });
        }
        catch (error) {
            next(error);
        }
    }
    async toggleLockTerm(req, res, next) {
        try {
            const termId = parseInt(req.params.id, 10);
            if (isNaN(termId)) {
                return res.status(400).json({ status: false, message: 'Invalid term ID' });
            }
            const result = await termService_1.default.toggleLockTerm(termId.toString());
            (0, response_1.default)(res, 201, { status: true, message: result.message, data: result.term });
        }
        catch (error) {
            next(error);
        }
    }
    async updateTerms(req, res, next) {
        try {
            const result = await termService_1.default.updateTerms();
        }
        catch (error) {
            next(error);
        }
    }
    async token(req, res, next) {
        try {
            const result = await termService_1.default.token();
        }
        catch (error) {
            next(error);
        }
    }
}
const termController = new TermController();
exports.default = termController;
//# sourceMappingURL=termController.js.map