"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authService_1 = __importDefault(require("../services/authService"));
const response_1 = __importDefault(require("../utils/response"));
const signToken_1 = __importDefault(require("../utils/signToken"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const signToken1 = (user) => {
    return jsonwebtoken_1.default.sign(user, 'hend33', {
        expiresIn: '1h',
    });
};
class AuthController {
    async signUpUser(req, res, next) {
        try {
            if (req.file) {
                req.body.avatar = req.file.path;
            }
            const user = await authService_1.default.signUp(req.body, req.body.role);
            (0, response_1.default)(res, 201, { status: true, message: "Account created successfully!", data: user });
        }
        catch (error) {
            next(error);
        }
    }
    async login(req, res, next) {
        try {
            const { identifier, password } = req.body;
            // Call the updated login method in the authService
            const user = await authService_1.default.login(identifier, password);
            // delete user.password // remove password from the response
            const token = (0, signToken_1.default)({ id: user.id });
            (0, response_1.default)(res, 200, { status: true, message: "Login successful!", data: { token, user } });
        }
        catch (error) {
            next(error);
        }
    }
    async googleAuthCallback(req, res, next) {
        try {
            // توليد JWT Token
            const user = req.user;
            // Generate JWT Token with all user data
            const token = signToken1({
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                googleId: user.googleId,
                password: user.password, // Be cautious with sensitive data
                schooleYear: user.schooleYear,
                mobileNumber: user.mobileNumber,
                role: user.role,
                block: user.block,
                avatar: user.avatar,
                verificationCode: user.verificationCode,
                emailverified: user.emailverified,
                verificationToken: user.verificationToken,
                verificationTokenExpiresAt: user.verificationTokenExpiresAt,
                lastLogout: user.lastLogout,
                isResetCodeVerified: user.isResetCodeVerified,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            });
            // Build the URL with data as query parameters
            const frontendUrl = `http://localhost:5173/auth/google/callback?token=${encodeURIComponent(token)}`;
            // Redirect to the frontend URL with query parameters
            res.redirect(frontendUrl);
        }
        catch (error) {
            next(error); // تمرير أي أخطاء إلى الـ middleware الخاص بالتعامل مع الأخطاء
        }
    }
    async logout(req, res, next) {
        try {
            const userid = req.user;
            if (typeof userid !== 'number') {
                throw new ApiError_1.default("Invalid user ID", 400);
            }
            if (!userid) {
                throw new ApiError_1.default("User is not authenticated", 401);
            }
            const usert = await authService_1.default.logout(userid);
            (0, response_1.default)(res, 200, { status: true, message: "Logout successful!" });
        }
        catch (error) {
            next(error); // Pass any errors to the error handling middleware
        }
    }
    async verifyEmail(req, res, next) {
        try {
            const { token } = req.query; // Extract token from query parameters
            if (typeof token !== 'string') {
                return res.status(400).json({ message: 'Invalid token' });
            }
            const data = {
                token
            };
            const user = await authService_1.default.verifyEmail(data);
            (0, response_1.default)(res, 201, { status: true, message: " verify successfully!", data: user });
        }
        catch (error) {
            next(error);
        }
    }
    async forgetPassword(req, res, next) {
        try {
            const user = await authService_1.default.forgetPassword(req.body.email);
            (0, response_1.default)(res, 200, { status: true, message: "Reset Code Sent Successfully" });
        }
        catch (error) {
            next(error);
        }
    }
    async verifyResetCode(req, res, next) {
        try {
            await authService_1.default.verifyResetPasswordCode(req.body.email, req.body.code.toString());
            (0, response_1.default)(res, 200, { status: true, message: "Code Verified Successfully" });
        }
        catch (error) {
            next(error);
        }
    }
    async resetPassword(req, res, next) {
        try {
            await authService_1.default.resetPassword(req.body.email, req.body.password);
            (0, response_1.default)(res, 200, { status: true, message: "Password reset successfully" });
        }
        catch (error) {
            next(error);
        }
    }
}
const authController = new AuthController();
exports.default = authController;
//# sourceMappingURL=authController.js.map