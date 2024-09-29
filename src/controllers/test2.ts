// src/controllers/videoController.ts

import { Request, Response } from 'express';
import * as fs from 'fs';
//import { uploadVideo } from '../services/test2';


export const uploadVideoController = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).send('No video file provided');
        }

        // Write the uploaded video to a temp file
        const tempFilePath = `./uploads/${req.file.originalname}`;
        fs.writeFileSync(tempFilePath, req.file.buffer);

        // Send immediate response to the client
        res.status(202).json({ message: 'Video upload started, processing in background.' });

        // Upload the video in the background
        setImmediate(async () => {
            try {
                console.log(`start upload video`);
                //const videoUrl = await uploadVideo(tempFilePath);

                // Log success or store the URL in the database here
               // console.log(`Video uploaded successfully: ${videoUrl}`);

                // Clean up temp file after upload
                fs.unlinkSync(tempFilePath);
            } catch (error) {
                console.error('Error during background video upload:', error);

                // Clean up temp file on error
                if (fs.existsSync(tempFilePath)) {
                    fs.unlinkSync(tempFilePath);
                }
            }
        });
    } catch (error) {
        console.error('Video upload error:', error);
        return res.status(500).send('Failed to process video upload');
    }
};