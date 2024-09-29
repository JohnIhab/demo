/*import { Request, Response } from 'express';
import { uploadVideoToGoogleDrive  } from '../services/test1';

export const uploadVideo = async (req: Request, res: Response) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Pass the file buffer to the service instead of file.path
        const videoData = await uploadVideoToGoogleDrive(file.buffer, file.originalname);

        return res.status(200).json({
            message: 'Video uploaded successfully',
            videoData,
        });
    } catch (error) {
        console.error('Error uploading video:', error);
        return res.status(500).json({ message: 'Error uploading video', error });
    }
};
*/