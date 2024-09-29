import { Request } from "express";
import path from "path";
import fs from "fs";

// Function to remove a file from the filesystem (not needed for memoryStorage)
export const removeFile = (filePath: string) => {
    const normalizedPath = path.normalize(filePath);
    fs.unlink(normalizedPath, (err: any) => {
        if (err) {
            console.error(`Failed to delete file at ${normalizedPath}:`, err);
        }
    });
};

// Function to handle file removal on error (not needed for memoryStorage)
export const removeFilesOnError = (req: Request) => {
    if (req.files) {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        Object.keys(files).forEach((key) => {
            files[key].forEach((file) => {
                if (file.path) {  // Path will not exist in memoryStorage
                    removeFile(file.path);
                } else {
                    console.error(`File path is undefined for key: ${key}`);
                }
            });
        });
    } else {
        console.error("No files to remove.");
    }
};

// Simplified function for memoryStorage (no file removal necessary)
export const removeFilesOnErrorMemoryStorage = (req: Request) => {
    if (req.files || req.file) {
        console.log("Files are stored in memory, no need to remove them.");
    } else {
        console.error("No files to remove.");
    }
};