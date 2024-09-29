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
exports.resetValidationSchema = exports.verifyValidationSchema = exports.forgetValidationSchema = exports.loginValidationSchema = exports.registerValidationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const roles_1 = require("../enum/roles");
const client_1 = __importDefault(require("../../prisma/client"));
exports.registerValidationSchema = joi_1.default.object().keys({
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    email: joi_1.default.string()
        .email()
        .pattern(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)
        .external((value) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield client_1.default.user.findFirst({
            where: {
                email: value,
            },
        });
        if (user) {
            throw new Error("Email already exists");
        }
    }))
        .required(),
    mobileNumber: joi_1.default.string().required(),
    password: joi_1.default.string().required(),
    confirm: joi_1.default.string()
        .valid(joi_1.default.ref('password'))
        .required()
        .messages({ 'any.only': 'Passwords do not match' })
        .required(),
    role: joi_1.default.string()
        .valid(...Object.values(roles_1.Roles))
        .optional(),
    schooleYear: joi_1.default.string().optional()
        .valid("First year", "Second year", "Third year")
        .messages({ 'any.only': 'Invalid school year    value First year or Second year  or Third year ' }),
});
exports.loginValidationSchema = joi_1.default.object().keys({
    identifier: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
});
exports.forgetValidationSchema = joi_1.default.object().keys({
    email: joi_1.default.string().email().required(),
});
exports.verifyValidationSchema = joi_1.default.object().keys({
    token: joi_1.default.string().required(),
});
exports.resetValidationSchema = joi_1.default.object().keys({
    email: joi_1.default.string().required(),
    password: joi_1.default.string().required(),
    confirm: joi_1.default.string()
        .valid(joi_1.default.ref('password'))
        .required()
        .messages({ 'any.only': 'Passwords do not match' })
        .required(),
});
