import { Request } from "express";
import path from "path";
import fs from "fs";
// No need for file system operations with memoryStorage
export const removeFile = (filePath: string) => {
    const normalizedPath = path.normalize(filePath); // Normalize path separators
    fs.unlink(normalizedPath, (err: any) => {
        if (err) {
            console.error(`Failed to delete file at ${normalizedPath}:`, err);
        }
        });
    };
export const removeFilesOnError = (req: Request) => {
    // Handling single file (Multer.single())
    if (req.file) {
        // No need to remove in-memory files
    } else if (req.files) {
            console.error(`File path is undefined for key`);
        // Handling multiple files (Multer.array())
        if (Array.isArray(req.files)) {
        (req.files as Express.Multer.File[]).forEach(
            (_file: Express.Multer.File) => {
            // No need to remove in-memory files
            }
            
        );
        } else {
        // Handling multiple files (Multer.fields())
        console.error("No files to remove.");
        for (const key in req.files) {
            const files = req.files[key];
            files.forEach((_file: Express.Multer.File) => {
            // No need to remove in-memory files
            });
        }
        }
    }
};