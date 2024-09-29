import multer from 'multer';

// Create a multer instance with large file size limit
const uploadToMemoryStorage = multer({
  storage: multer.memoryStorage(), // Store files in memory
    limits: {
        fileSize: 500 * 1024 * 1024, // 500 MB limit (adjust as needed)
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('video/') || file.mimetype.startsWith('image/')) {
        cb(null, true);
        } else {
            cb(new Error('Invalid file type') as unknown as null, false);
        }
    },
});

export default uploadToMemoryStorage;
