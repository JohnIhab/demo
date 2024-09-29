"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const allowedTypes = ['application/pdf'];
const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Accept file
    }
    else {
        cb(new Error('Invalid file type'), false);
    }
};
const uploadPDF = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(), // Store file in memory
    fileFilter, // Validate file type
    limits: { fileSize: 10 * 1024 * 1024 } // Optional: limit file size (10 MB in this example)
});
exports.default = uploadPDF;
//# sourceMappingURL=multerPDF.js.map