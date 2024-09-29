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
exports.loginValidationSchema = exports.registerValidationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const roles_1 = require("../enum/roles");
const client_1 = __importDefault(require("../../prisma/client"));
exports.registerValidationSchema = joi_1.default.object().keys({
    name: joi_1.default.string().required(),
    email: joi_1.default.string()
        .email()
        .external((value) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield client_1.default.user.findUnique({
            where: {
                email: value,
            },
        });
        if (user) {
            throw new Error("Email already exists");
        }
    }))
        .required(),
    password: joi_1.default.string().required(),
    role: joi_1.default.string()
        .valid(...Object.values(roles_1.Roles))
        .optional(),
});
exports.loginValidationSchema = joi_1.default.object().keys({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
});
