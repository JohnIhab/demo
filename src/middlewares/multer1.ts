// src/middleware/multer.ts

import multer from 'multer';

// Setup multer to use memory storage (if uploading to Cloudinary directly)
const storage = multer.memoryStorage();

const fileFilter = (req: any, file: any, cb: any) => {
    // Only accept video files (you can modify the MIME types as needed)
    if (file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only video files are allowed!'), false);
    }
};

const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 500, // 100MB limit
    },
    fileFilter,
});

export default upload;
