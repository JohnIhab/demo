"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const client_1 = __importDefault(require("../../prisma/client"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const generateOTP_1 = __importStar(require("../utils/generateOTP"));
const verify_1 = require("../utils/verify");
class AuthService {
    signUp(data, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password, firstName, lastName, mobileNumber, schooleYear, avatar } = data;
            const verificationToken = (0, verify_1.generateVerificationCode)().toString();
            ;
            const verificationTokenExpiresAt = new Date(Date.now() + 3600000); // Token expires in 1 hour
            try {
                const existingUser = yield client_1.default.user.findFirst({
                    where: {
                        OR: [
                            { email },
                            { mobileNumber }
                        ]
                    }
                });
                if (existingUser) {
                    throw new Error('User with this email or mobile number already exists');
                }
                const user = yield client_1.default.user.create({
                    data: {
                        firstName,
                        lastName,
                        email,
                        password: yield bcrypt_1.default.hash(password, 8),
                        mobileNumber,
                        schooleYear,
                        avatar,
                        role,
                        verificationToken,
                        verificationTokenExpiresAt
                    },
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                        mobileNumber: true,
                        schooleYear: true,
                        role: true,
                    }
                });
                return user;
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error('Error during signup or sending email:', error.message);
                    console.error('Stack trace:', error.stack);
                }
                else {
                    console.error('An unknown error occurred:', error);
                }
                throw error; // Optionally re-throw to handle it further up the call stack
            }
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield client_1.default.user.findFirst({
                where: {
                    email,
                },
            });
            if (!user) {
                throw new ApiError_1.default("Incorrect Email or password", 400);
            }
            const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
            if (!passwordMatch) {
                throw new ApiError_1.default("Incorrect Email or password", 400);
            }
            return user;
        });
    }
    forgetPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield client_1.default.user.findUnique({
                where: {
                    email,
                },
            });
            if (!user) {
                throw new ApiError_1.default("User not found", 404);
            }
            const codes = (0, generateOTP_1.default)();
            yield client_1.default.user_Codes.upsert({
                where: {
                    userId: user.id,
                },
                update: {
                    resetPasswordCode: codes.hashedOTP,
                    resetPasswordCodeExpiresAt: new Date(codes.otpExpiration),
                },
                create: {
                    resetPasswordCode: codes.hashedOTP,
                    resetPasswordCodeExpiresAt: new Date(codes.otpExpiration),
                    userId: user.id,
                },
            });
            return { email: user.email, code: codes.otp, username: user.firstName };
        });
    }
    verifyResetPasswordCode(email, code) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedOTP = (0, generateOTP_1.encrypt)(code);
            const userCode = yield client_1.default.user_Codes.findFirst({
                where: {
                    resetPasswordCode: hashedOTP,
                    resetPasswordCodeExpiresAt: {
                        gte: new Date()
                    },
                    User: {
                        email
                    }
                }
            });
            if (!userCode) {
                throw new ApiError_1.default("Code is Invalid Or Expired", 400);
            }
        });
    }
    resetPassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            yield client_1.default.user.update({
                where: {
                    email
                },
                data: {
                    password: yield bcrypt_1.default.hash(password, 8)
                }
            });
        });
    }
}
const authService = new AuthService();
exports.default = authService;
