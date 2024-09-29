"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const client_1 = __importDefault(require("../../prisma/client"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization) {
            token = req.headers.authorization.replace("Bearer ", "");
        }
        if (!token) {
            return next(new ApiError_1.default("Token is require", 401));
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await client_1.default.user.findUnique({
            where: {
                id: decoded.id,
            },
            select: {
                id: true,
                role: true,
            },
        });
        if (!user) {
            return next(new ApiError_1.default("Unauthorized", 401));
        }
        req.user = user.id;
        req.role = user.role;
        next();
    }
    catch (error) {
        next(new ApiError_1.default("Invalid Token", 401));
    }
};
//# sourceMappingURL=auth.js.map