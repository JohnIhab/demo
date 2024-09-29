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
exports.uploadMiddleware = exports.uploadFiles = void 0;
const GoogleDrive_1 = __importDefault(require("../services/GoogleDrive"));
const multer_1 = __importDefault(require("multer"));
// Initialize multer for file uploads
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
// Controller function for handling file uploads
const uploadFiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Ensure files exist
        if (!req.files || !(req.files instanceof Array)) {
            return res.status(400).json({ message: 'No files uploaded' });
        }
        // Map the uploaded files to buffer and names
        const fileBuffers = req.files.map((file) => file.buffer);
        const fileNames = req.files.map((file) => file.originalname);
        const mimeType = req.files[0].mimetype; // Assuming all files have the same MIME type
        // Call the upload service
        const fileUrls = yield GoogleDrive_1.default.uploadFilesToDrive(fileBuffers, fileNames, mimeType);
        // Return the URLs of the uploaded files
        return res.status(200).json({ message: 'Files uploaded successfully', urls: fileUrls });
    }
    catch (error) {
        console.error('Error uploading files:', error);
        return res.status(500).json({ message: 'File upload failed' });
    }
});
exports.uploadFiles = uploadFiles;
// Middleware to handle file uploads
exports.uploadMiddleware = upload.array('files', 10); // Allow up to 10 files at once
