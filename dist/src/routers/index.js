"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRouter_1 = __importDefault(require("./authRouter"));
//import CourseRouter from "./CourseRouter";
const googleDrive_1 = __importDefault(require("./googleDrive"));
const videos_1 = __importDefault(require("./videos"));
const router = (0, express_1.Router)();
router.use("/auth", authRouter_1.default);
//router.use("/CourseRouter", CourseRouter);
router.use("/googleDrive", googleDrive_1.default);
router.use("/videos", videos_1.default);
router.all("*", (req, res, next) => {
    res.status(404).json({ status: false, message: `Endpoint not found: ${req.method} ${req.originalUrl}` });
});
exports.default = router;
