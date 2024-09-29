"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
// Create a multer instance with large file size limit
const uploadToMemoryStorage = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(), // Store files in memory
    limits: {
        fileSize: 500 * 1024 * 1024, // 500 MB limit (adjust as needed)
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('video/') || file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Invalid file type'), false);
        }
    },
});
exports.default = uploadToMemoryStorage;
//# sourceMappingURL=m.js.map