// controllers/videoController.ts
import { Request, Response } from 'express';
import  VideoService  from '../services/GoogleDrive';
import multer from 'multer';

// Initialize multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });



// Controller function for handling file uploads
export const uploadFiles = async (req: Request, res: Response) => {
    try {
        // Ensure files exist
        if (!req.files || !(req.files instanceof Array)) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        // Map the uploaded files to buffer and names
        const fileBuffers = (req.files as Express.Multer.File[]).map((file) => file.buffer);
        const fileNames = (req.files as Express.Multer.File[]).map((file) => file.originalname);
        const mimeType = (req.files as Express.Multer.File[])[0].mimetype; // Assuming all files have the same MIME type

        // Call the upload service
        const fileUrls = await VideoService.uploadFilesToDrive(fileBuffers, fileNames, mimeType);

        // Return the URLs of the uploaded files
        return res.status(200).json({ message: 'Files uploaded successfully', urls: fileUrls });
    } catch (error) {
        console.error('Error uploading files:', error);
        return res.status(500).json({ message: 'File upload failed' });
    }
};
export const uploadFiless = async (req: Request, res: Response) => {
    try {
        // Ensure files exist
        if (!req.files || !(req.files instanceof Array)) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        // Map the uploaded files to buffer and names
        const fileBuffers = (req.files as Express.Multer.File[]).map((file) => file.buffer);
        const fileNames = (req.files as Express.Multer.File[]).map((file) => file.originalname);
        const mimeType = (req.files as Express.Multer.File[])[0].mimetype;

        // Handle large file uploads in chunks
        const urls = await VideoService.uploadLargeFileInChunks(fileBuffers[0], fileNames[0], mimeType);

        // Return the URLs of the uploaded file parts
        return res.status(200).json({ message: 'Files uploaded successfully', urls });
    } catch (error) {
        console.error('Error uploading files:', error);
        return res.status(500).json({ message: 'File upload failed' });
    }
};

// Middleware to handle file uploads
export const uploadMiddleware = upload.array('files', 10); // Allow up to 10 files at once
