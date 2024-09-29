import multer from "multer";
import path from 'path';

// Memory storage does not need a destination callback
const storage = multer.memoryStorage();

const uploadToMemoryStorage = multer({
      storage,
      fileFilter: (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
            const fileType = file.mimetype.split("/")[1];
            const allowedTypes = ['jpeg', 'png', 'jpg', 'mp4'];

            if (allowedTypes.includes(fileType)) {
                  cb(null, true);
            } else {
                  cb(new Error('Invalid file type') as unknown as null, false);
            }
            },
      limits: { fileSize: 1024 * 1024 * 100 } // Example: limit file size to 100MB
});

export default uploadToMemoryStorage;

