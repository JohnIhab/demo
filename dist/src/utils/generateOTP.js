"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encrypt = void 0;
const crypto_1 = __importDefault(require("crypto"));
const encrypt = (code) => {
    return crypto_1.default
        .createHash('sha256')
        .update(code)
        .digest("hex");
};
exports.encrypt = encrypt;
const generateOTP = () => {
    const otpExpiration = new Date(Date.now() + 10 * 60 * 1000);
    const otp = Math.floor(100000 + Math.random() * 900000);
    const hashedOTP = encrypt(otp.toString());
    return { otp, hashedOTP, otpExpiration };
};
exports.default = generateOTP;
