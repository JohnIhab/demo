"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFilesOnError = exports.removeFile = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// No need for file system operations with memoryStorage
const removeFile = (filePath) => {
    const normalizedPath = path_1.default.normalize(filePath); // Normalize path separators
    fs_1.default.unlink(normalizedPath, (err) => {
        if (err) {
            console.error(`Failed to delete file at ${normalizedPath}:`, err);
        }
    });
};
exports.removeFile = removeFile;
const removeFilesOnError = (req) => {
    // Handling single file (Multer.single())
    if (req.file) {
        // No need to remove in-memory files
    }
    else if (req.files) {
        console.error(`File path is undefined for key`);
        // Handling multiple files (Multer.array())
        if (Array.isArray(req.files)) {
            req.files.forEach((_file) => {
                // No need to remove in-memory files
            });
        }
        else {
            // Handling multiple files (Multer.fields())
            console.error("No files to remove.");
            for (const key in req.files) {
                const files = req.files[key];
                files.forEach((_file) => {
                    // No need to remove in-memory files
                });
            }
        }
    }
};
exports.removeFilesOnError = removeFilesOnError;
//# sourceMappingURL=filehandler1.js.map