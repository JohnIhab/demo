"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const client_1 = __importDefault(require("../../prisma/client"));
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token;
        if (req.headers.authorization) {
            token = req.headers.authorization.replace("Bearer ", "");
        }
        if (!token) {
            return next(new ApiError_1.default("No Token Provided", 401));
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        const user = yield client_1.default.user.findUnique({
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
});
