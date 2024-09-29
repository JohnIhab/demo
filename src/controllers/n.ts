import { Request, Response, NextFunction } from 'express';
import videoService from '../services/v';
import response from "../utils/response";
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
    
            // Convert price to a string if it’s received as a number
            const price = req.body.price.toString();
            console.log('Price received:', price);
    
            // Validate price as a number
            if (isNaN(parseFloat(price))) {
                return res.status(400).json({ status: false, message: 'Invalid price value' });
            }
    
            const numberOfLecturesInt = parseInt(req.body.numberOfLectures, 10);
            if (isNaN(numberOfLecturesInt)) {
                return res.status(400).json({ status: false, message: 'Invalid number of lectures' });
            }
    
            const isFree = req.body.isFree === 'true'; // Convert string to boolean
            const contentId = req.params.id; // Since contentId is passed as string in the route
    
            const { name, subTitle } = req.body;
    
            // Save the lecture data
            const lectureData = await videoService.saveLectureDetails(
                name,
                numberOfLecturesInt,
                price,
                contentId,
                isFree,
                subTitle
            );
    
            res.json({ status: true, message: 'Data saved successfully, video upload in progress', data: lectureData });
    
            // Queue the video upload to the background
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

    async getVideos(req: Request, res: Response, next: NextFunction) {
        try {
            const videos = await videoService.getAllVideos();
            res.json(videos);
        } catch (error) {
            next(error);
        }
    }
    async getAlllecture(req: Request, res: Response, next: NextFunction) {
        try {
            const videos = await videoService.getAlllecture();
            res.json(videos);
        } catch (error) {
            next(error);
        }
    }
    async getAllLecturesBycontentId(req: Request, res: Response, next: NextFunction) {
        try {
            const {contentId} = req.params;
            const videos = await videoService.getAllLecturesBycontentId(Number(contentId));
            res.json(videos);
        } catch (error) {
            next(error);
        }
    }
    async deleteLecture(req: Request, res: Response, next: NextFunction){
    
        try {
            const lectureId = parseInt(req.params.id, 10);
            const lecture = await videoService.deleteLecture(lectureId);
            response(res, 201, {status: true, message: "delete lecture successfully!"});
        } catch (error) {
            next(error);
        }
    }
}

const videoController = new VideoController();
export default videoController;
