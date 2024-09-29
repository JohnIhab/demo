"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFilesOnErrorMemoryStorage = exports.removeFilesOnError = exports.removeFile = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Function to remove a file from the filesystem (not needed for memoryStorage)
const removeFile = (filePath) => {
    const normalizedPath = path_1.default.normalize(filePath);
    fs_1.default.unlink(normalizedPath, (err) => {
        if (err) {
            console.error(`Failed to delete file at ${normalizedPath}:`, err);
        }
    });
};
exports.removeFile = removeFile;
// Function to handle file removal on error (not needed for memoryStorage)
const removeFilesOnError = (req) => {
    if (req.files) {
        const files = req.files;
        Object.keys(files).forEach((key) => {
            files[key].forEach((file) => {
                if (file.path) { // Path will not exist in memoryStorage
                    (0, exports.removeFile)(file.path);
                }
                else {
                    console.error(`File path is undefined for key: ${key}`);
                }
            });
        });
    }
    else {
        console.error("No files to remove.");
    }
};
exports.removeFilesOnError = removeFilesOnError;
// Simplified function for memoryStorage (no file removal necessary)
const removeFilesOnErrorMemoryStorage = (req) => {
    if (req.files || req.file) {
        console.log("Files are stored in memory, no need to remove them.");
    }
    else {
        console.error("No files to remove.");
    }
};
exports.removeFilesOnErrorMemoryStorage = removeFilesOnErrorMemoryStorage;
//# sourceMappingURL=fileHandler.js.map