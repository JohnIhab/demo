"use strict";
// src/middleware/multer.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
// Setup multer to use memory storage (if uploading to Cloudinary directly)
const storage = multer_1.default.memoryStorage();
const fileFilter = (req, file, cb) => {
    // Only accept video files (you can modify the MIME types as needed)
    if (file.mimetype.startsWith('video/')) {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file type. Only video files are allowed!'), false);
    }
};
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 500, // 100MB limit
    },
    fileFilter,
});
exports.default = upload;
//# sourceMappingURL=multer1.js.map