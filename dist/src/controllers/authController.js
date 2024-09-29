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
const authService_1 = __importDefault(require("../services/authService"));
const response_1 = __importDefault(require("../utils/response"));
const signToken_1 = __importDefault(require("../utils/signToken"));
const sendMails_1 = __importDefault(require("../utils/sendMails"));
const pug_1 = __importDefault(require("pug"));
class AuthController {
    signUpUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.file) {
                    req.body.avatar = req.file.path;
                }
                const user = yield authService_1.default.signUp(req.body);
                (0, response_1.default)(res, 201, { status: true, message: "Account created successfully!", data: user });
            }
            catch (error) {
                next(error);
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield authService_1.default.login(email, password);
                // delete user.password // remove password from the response
                const token = (0, signToken_1.default)({ id: user.id });
                (0, response_1.default)(res, 200, { status: true, message: "Login successful!", data: { token, user } });
            }
            catch (error) {
                next(error);
            }
        });
    }
    addUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield authService_1.default.signUp(req.body, req.body.role);
                (0, response_1.default)(res, 201, { status: true, message: "User created successfully!", data: user });
            }
            catch (error) {
                next(error);
            }
        });
    }
    forgetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield authService_1.default.forgetPassword(req.body.email);
                const html = pug_1.default.renderFile(`${process.cwd()}/src/templates/forgetPassword.pug`, { code: user.code, username: user.username });
                (0, sendMails_1.default)({ to: user.email, html, subject: "Reset Password" });
                (0, response_1.default)(res, 200, { status: true, message: "Reset Code Sent Successfully" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    verifyResetCode(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield authService_1.default.verifyResetPasswordCode(req.body.email, req.body.code.toString());
                (0, response_1.default)(res, 200, { status: true, message: "Code Verified Successfully" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    resetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield authService_1.default.resetPassword(req.body.email, req.body.password);
                (0, response_1.default)(res, 200, { status: true, message: "Password reset successfully" });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
const authController = new AuthController();
exports.default = authController;
