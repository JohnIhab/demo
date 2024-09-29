"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
// Memory storage does not need a destination callback
const storage = multer_1.default.memoryStorage();
const uploadToMemoryStorage = (0, multer_1.default)({
    storage,
    fileFilter: (req, file, cb) => {
        const fileType = file.mimetype.split("/")[1];
        const allowedTypes = ['jpeg', 'png', 'jpg', 'mp4'];
        if (allowedTypes.includes(fileType)) {
            cb(null, true);
        }
        else {
            cb(new Error('Invalid file type'), false);
        }
    },
    limits: { fileSize: 1024 * 1024 * 100 } // Example: limit file size to 100MB
});
exports.default = uploadToMemoryStorage;
//# sourceMappingURL=multer.js.map