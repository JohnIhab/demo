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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../../prisma/client"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const generateOTP_1 = __importStar(require("../utils/generateOTP"));
const sendMails_1 = __importDefault(require("../utils/sendMails"));
const verify_1 = require("../utils/verify");
class adminService {
    async signUp(data, role) {
        const { email, password, firstName, lastName, mobileNumber, schooleYear, avatar } = data;
        const verificationCode = (0, verify_1.generateVerificationCode)();
        const verificationToken = (0, verify_1.generateVerificationCode)().toString();
        ;
        const verificationTokenExpiresAt = new Date(Date.now() + 3600000); // Token expires in 1 hour
        try {
            const existingUser = await client_1.default.user.findFirst({
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
            const user = await client_1.default.user.create({
                data: {
                    firstName,
                    lastName,
                    email,
                    password: await bcrypt_1.default.hash(password, 8),
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
            const baseUrl = 'https://bioscope-rosy.vercel.app'; // Base URL of your application
            const endpoint = '/api/auth/verifyEmail'; // Path to the verification endpoint
            const verificationLink = `${baseUrl}${endpoint}?token=${verificationToken}`;
            // SMS message content
            const emailSubject = 'د/ جلال نبيل';
            const emailData = {
                to: email,
                subject: `Email Verification ${emailSubject}`,
                html: `<p>Your verification code is: <strong>${verificationLink}</strong></p>`,
            };
            await (0, sendMails_1.default)(emailData);
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
    }
    async verifyEmail(data) {
        const { token } = data;
        // Find the user with the given token
        const user = await client_1.default.user.findFirst({
            where: {
                verificationToken: token,
                verificationTokenExpiresAt: {
                    gte: new Date(), // Check if token is not expired
                }
            }
        });
        if (!user) {
            throw new Error('Invalid or expired token');
        }
        // Update user to mark email as verified
        await client_1.default.user.update({
            where: { id: user.id },
            data: {
                emailverified: true, // Assuming you have a field for email verification
                verificationToken: null, // Optionally clear the token
                verificationTokenExpiresAt: null // Optionally clear the token expiration
            }
        });
    }
    async login(identifier, password) {
        const user = await client_1.default.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { mobileNumber: identifier } // Adjust this if the field name is different
                ]
            }
        });
        if (!user) {
            throw new ApiError_1.default("Incorrect Email or password", 400);
        }
        if (user.block) {
            throw new ApiError_1.default("Your account has been blocked. Please contact support.", 403);
        }
        const passwordMatch = await bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            throw new ApiError_1.default("Incorrect Email or password", 400);
        }
        if (!user.emailverified) {
            throw new Error('Email not verified. Please check your message for the verification code.');
        }
        return user;
    }
    //auht by google
    async logout(userid) {
        // Update the user's session data to mark them as logged out
        const updatedUser = await client_1.default.user.update({
            where: {
                id: userid,
            },
            data: {
                lastLogout: new Date(),
            },
        });
    }
    async forgetPassword(email) {
        const user = await client_1.default.user.findFirst({
            where: {
                email,
            },
        });
        if (!user || user.block) {
            throw new ApiError_1.default("User not found or block", 404);
        }
        const codes = (0, generateOTP_1.default)();
        await client_1.default.user_Codes.upsert({
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
        const emailSubject = 'Your Password Reset Code';
        const emailHtml = `
  <p>Hello ${user.firstName},</p>
  <p>Your password reset code is: <strong>${codes.otp}</strong>. It is valid for the next 10 minutes.</p>
  <p>Best regards,<br/>Your Team</p>
`;
        await (0, sendMails_1.default)({
            to: user.email,
            subject: emailSubject,
            html: emailHtml,
        });
        console.log(codes);
        return { email: user.email, code: codes.otp, username: user.firstName };
    }
    async verifyResetPasswordCode(email, code) {
        const hashedOTP = (0, generateOTP_1.encrypt)(code);
        const userCode = await client_1.default.user_Codes.findFirst({
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
        await client_1.default.user.update({
            where: {
                email,
            },
            data: {
                isResetCodeVerified: true,
            },
        });
    }
    async resetPassword(email, password) {
        const user = await client_1.default.user.findFirst({
            where: {
                email,
            },
        });
        if (!user || !user.isResetCodeVerified) {
            throw new ApiError_1.default("Reset code not verified ", 400);
        }
        if (user.block) {
            throw new ApiError_1.default("User  blocked", 404);
        }
        await client_1.default.user.update({
            where: {
                email
            },
            data: {
                password: await bcrypt_1.default.hash(password, 8)
            }
        });
    }
}
const authService = new adminService();
exports.default = authService;
//# sourceMappingURL=authService.js.map