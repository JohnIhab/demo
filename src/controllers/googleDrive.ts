import { Request, Response, NextFunction } from 'express';
import videoService from '../services/googleDriveService'; 

class VideoController {
    async uploadVideos(req: Request, res: Response, next: NextFunction) {
        try {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            const videoFiles = files?.videos ?? [];
            const imageFile = files?.image?.[0];
    
            if (!videoFiles.length || !imageFile) {
                return res.status(400).send('At least one video and one image file are required.');
            }
    
            const videoBuffers = videoFiles.map(file => file.buffer);
            const videoNames = videoFiles.map(file => file.originalname);
    
            const price = req.body.price.toString();
            if (isNaN(parseFloat(price))) {
                return res.status(400).json({ status: false, message: 'Invalid price value' });
            }
    
            const numberOfLecturesInt = parseInt(req.body.numberOfLectures, 10);
            if (isNaN(numberOfLecturesInt)) {
                return res.status(400).json({ status: false, message: 'Invalid number of lectures' });
            }
    
            const isFree = req.body.isFree === 'true';
            const contentId = req.params.id;
            const { name, subTitle } = req.body;
    
            const lectureData = await videoService.saveLectureDetails(
                name,
                numberOfLecturesInt,
                price,
                contentId,
                isFree,
                subTitle
            );
            res.json({ status: true, message: 'Data saved successfully, video upload in progress', data: lectureData });
            setImmediate(async () => {
                try {
                    await videoService.uploadVideosInBackground(lectureData.id, videoBuffers, videoNames, imageFile.buffer);
                } catch (error) {
                    console.error('Background Upload Error:', error);
                }
            });
    
        } catch (error) {
            next(error);
        }
    }

    async getTokens(req: Request, res: Response, next: NextFunction) {
        try {
            const videos = await videoService.getTokens();
            res.json(videos);
        } catch (error) {
            next(error);
        }
    }
    async hi(req: Request, res: Response, next: NextFunction) {
        try {

            res.json({ status: true, message: 'test saved successfully'});
        } catch (error) {
            next(error);
        }
    }
}

const videoController = new VideoController();
export default videoController;
