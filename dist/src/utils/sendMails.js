"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
    },
    tls: {
        minVersion: 'TLSv1.2', // Ensure TLSv1.2 or higher is used
    }
});
exports.default = async (data) => {
    // send mail with defined transport object
    await transporter.sendMail({
        from: '"Bioscope👻 " <foo@example.com>', // sender address
        to: data.to, // list of receivers
        subject: data.subject, // Subject line
        html: data.html, // html body
    });
};
//# sourceMappingURL=sendMails.js.map