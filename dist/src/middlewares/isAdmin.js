"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const client_1 = __importDefault(require("../../prisma/client"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isAdmin = async (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            return next(new ApiError_1.default('Token is required', 401));
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await client_1.default.user.findUnique({
            where: { id: decoded.id },
            select: { role: true },
        });
        if (!user || user.role !== 'ADMIN') {
            return next(new ApiError_1.default('Access denied. Admins only.', 403));
        }
        next();
    }
    catch (error) {
        next(new ApiError_1.default('Unauthorized', 401));
    }
};
exports.isAdmin = isAdmin;
//# sourceMappingURL=isAdmin.js.map