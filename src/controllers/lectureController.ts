import { NextFunction, Request, Response } from "express";
import userService from "../services/userService";
import response from "../utils/response";
import ApiError from "../utils/ApiError";
import CustomRequest from "../interfaces/customRequest";
import lectureService from "../services/lectureService";
import { createLectureType } from "../types/lectureType";
import prisma from "../../prisma/client";
//import uploadQueue from "../middlewares/videoQueue";
class LectureController {

    async getAllLecture(req: Request, res: Response, next: NextFunction){
    
        try {
            const hospital = await lectureService.getAllLecture();
            response(res, 201, {status: true, message: "All Lectures!", data: hospital});
        } catch (error) {
            next(error);
        }
    }
    async getLectureById(req: Request, res: Response, next: NextFunction){
    
        try {
            const hospital = await lectureService.getLectureById(req.params.id);
            response(res, 201, {status: true, message: "Lecture successfully!", data: hospital});
        } catch (error) {
            next(error);
        }
    }
    async createLecture(req: Request, res: Response, next: NextFunction) {
        try {
            // Extract the form data and files from the request object
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            console.log('Files:', files);
            const videoFiles = files?.video || [];
            const imageFile = files?.image?.[0];
// Assuming a single image file
            console.log('Image file:', imageFile);
    
            // Check type and content of buffer
            if (imageFile) {
                console.log('Buffer is:', imageFile.buffer);
                console.log('Buffer type:', typeof imageFile.buffer);
                console.log('Buffer instance check:', Buffer.isBuffer(imageFile.buffer));
            }// Typecast req.files
            
            const { name, numberOfLectures, price } = req.body;
            const {contentId} = req.params;
            console.log('Files:', files); // Log the files object to verify
    
            const numberOfLecturesInt = parseInt(numberOfLectures, 10);
            if (isNaN(numberOfLecturesInt)) {
                return res.status(400).json({ status: false, message: 'Invalid number of lectures' });
            }
    
    
            const contentIdInt = parseInt(contentId, 10);
            if (isNaN(contentIdInt)) {
                return res.status(400).json({ status: false, message: 'Invalid course ID' });
            }
    
            // Assuming a single image file
    
            if (videoFiles.length === 0 || !imageFile) {
                throw new Error('Video files and a single image file are required.');
            }
    
            // Create the lecture and save its basic data
            const newLecture = await prisma.lecture.create({
                data: {
                    name,
                    numberOfLectures: numberOfLecturesInt,
                    price: price,
                    contentId: contentIdInt,
                },
            });
    
            // Respond to the client quickly
            res.status(201).json({ message: 'Lecture created successfully, videos and image will be uploaded in the background.' , data: newLecture });
    
            // Schedule background upload of videos and image
            /*setImmediate(() => {
                uploadQueue.add({
                    lectureId: newLecture.id,
                    videoFiles,
                    imageFile,
                });
            });*/
        } catch (error) {
            console.error('Error creating lecture:', error);
            next(error); // Handle error with Express error middleware
        }
    }/*
    async updateLecture(req: Request, res: Response, next: NextFunction){
    
        try {
            const hospital = await lectureService.updateLecture(req.params.id,req.body);
            response(res, 201, {status: true, message: "lecture updated successfully!", data: hospital});
        } catch (error) {
            next(error);
        }
    }*/
    async deleteLecture(req: Request, res: Response, next: NextFunction){
    
        try {
            const hospital = await lectureService.deleteLecture(req.params.id);
            response(res, 201, {status: true, message: "Account updated successfully!", data: hospital});
        } catch (error) {
            next(error);
        }
    }


}
const lectureController = new LectureController();
export default lectureController;