
import multer, { FileFilterCallback } from 'multer';
// Define allowed file types
import { Request } from 'express';
const allowedTypes = ['application/pdf'];

const fileFilter: multer.Options['fileFilter'] = (req: Request, file, cb: FileFilterCallback) => {
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Accept file
    } else {
        cb(new Error('Invalid file type') as unknown as null, false);
    }
};

const uploadPDF = multer({
    storage: multer.memoryStorage(), // Store file in memory
    fileFilter, // Validate file type
    limits: { fileSize: 10 * 1024 * 1024 } // Optional: limit file size (10 MB in this example)
});
export default uploadPDF;