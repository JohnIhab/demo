"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userService_1 = __importDefault(require("../services/userService"));
const response_1 = __importDefault(require("../utils/response"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
class UserController {
    async contect_us(req, res, next) {
        try {
            const userid = req.user;
            console.log('User ID:', userid);
            console.log('User ID Type:', typeof userid);
            if (typeof userid !== 'number') {
                throw new ApiError_1.default("Invalid user ID", 400);
            }
            if (!userid) {
                throw new ApiError_1.default("User is not authenticated", 401);
            }
            console.log(userid);
            const contect = await userService_1.default.contect_us(userid, req.body);
            (0, response_1.default)(res, 201, { status: true, message: "send your messsage", data: contect });
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
            const user = await userService_1.default.view_user();
            (0, response_1.default)(res, 201, { status: true, message: "all users ", data: user });
        }
        catch (error) {
            next(error);
        }
    }
    async view_one_user(req, res, next) {
        try {
            const userid = req.user;
            if (typeof userid !== 'number') {
                throw new ApiError_1.default("Invalid user ID", 400);
            }
            if (!userid) {
                throw new ApiError_1.default("User is not authenticated", 401);
            }
            const user = await userService_1.default.view_one_user(userid);
            (0, response_1.default)(res, 201, { status: true, message: "user profile ", data: user });
        }
        catch (error) {
            next(error);
        }
    }
    async update_user(req, res, next) {
        try {
            const userid = req.user;
            if (typeof userid !== 'number') {
                throw new ApiError_1.default("Invalid user ID", 400);
            }
            if (!userid) {
                throw new ApiError_1.default("User is not authenticated", 401);
            }
            const user = await userService_1.default.update_user(userid, req.body);
            (0, response_1.default)(res, 201, { status: true, message: "User updated successfully", data: user });
        }
        catch (error) {
            next(error);
        }
    }
    async getBlockedUsers(req, res, next) {
        try {
            const user = await userService_1.default.getBlockedUsers();
            (0, response_1.default)(res, 201, { status: true, message: "all users bloked ", data: user });
        }
        catch (error) {
            next(error);
        }
    }
    async toggleBlockUser(req, res, next) {
        try {
            const userId = parseInt(req.params.id, 10);
            const result = await userService_1.default.toggleBlockUser(userId);
            (0, response_1.default)(res, 201, { status: true, message: result.message, data: result.user });
        }
        catch (error) {
            next(error);
        }
    }
    async deleteUser(req, res, next) {
        try {
            const userId = parseInt(req.params.id, 10); // Extract userId from request body
            const user = await userService_1.default.deleteUser(userId);
            (0, response_1.default)(res, 201, { status: true, message: "User delete successfully", data: user });
        }
        catch (error) {
            next(error);
        }
    }
}
const userController = new UserController();
exports.default = userController;
//# sourceMappingURL=userController.js.map