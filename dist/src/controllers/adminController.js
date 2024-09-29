"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adminService_1 = __importDefault(require("../services/adminService"));
const response_1 = __importDefault(require("../utils/response"));
class AdminController {
    async v_contect(req, res, next) {
        try {
            const accpted = await adminService_1.default.contect();
            (0, response_1.default)(res, 201, { status: true, message: "All contact messages retrieved", data: accpted });
        }
        catch (error) {
            next(error);
        }
    }
    async deletecontect_us(req, res, next) {
        try {
            const accpted = await adminService_1.default.deletecontect_us(req.params.id);
            (0, response_1.default)(res, 201, { status: true, message: "the contact message delete", data: accpted });
        }
        catch (error) {
            next(error);
        }
    }
    async view_user(req, res, next) {
        try {
            if (req.file) {
                req.body.avatar = req.file.path;
            }
            const user = await adminService_1.default.view_user();
            (0, response_1.default)(res, 201, { status: true, message: "all users ", data: user });
        }
        catch (error) {
            next(error);
        }
    }
}
const adminController = new AdminController();
exports.default = adminController;
//# sourceMappingURL=adminController.js.map