"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const googleDrive_1 = __importDefault(require("../controllers/googleDrive"));
const router = (0, express_1.Router)();
const multer_1 = __importDefault(require("multer"));
//import { uploadVideo } from '../controllers/test1';
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage, limits: { fileSize: 2 * 1024 * 1024 * 1024 }, });
router.post('/Drive/:id', upload.fields([{ name: 'videos', maxCount: 100 }, { name: 'image', maxCount: 1 }]), googleDrive_1.default.uploadVideos);
//router.get('/token',   videoController.getTokens);
//router.get('/hi',   videoController.hi);
// المسار لرفع الفيديو
//router.post('/upload-video', upload.single('video'), uploadVideo);
exports.default = router;
//# sourceMappingURL=googleRouter.js.map