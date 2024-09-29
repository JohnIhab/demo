"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = __importDefault(require("../utils/response"));
const lectureService_1 = __importDefault(require("../services/lectureService"));
const client_1 = __importDefault(require("../../prisma/client"));
//import uploadQueue from "../middlewares/videoQueue";
class LectureController {
    async getAllLecture(req, res, next) {
        try {
            const hospital = await lectureService_1.default.getAllLecture();
            (0, response_1.default)(res, 201, { status: true, message: "All Lectures!", data: hospital });
        }
        catch (error) {
            next(error);
        }
    }
    async getLectureById(req, res, next) {
        try {
            const hospital = await lectureService_1.default.getLectureById(req.params.id);
            (0, response_1.default)(res, 201, { status: true, message: "Lecture successfully!", data: hospital });
        }
        catch (error) {
            next(error);
        }
    }
    async createLecture(req, res, next) {
        var _a;
        try {
            // Extract the form data and files from the request object
            const files = req.files;
            console.log('Files:', files);
            const videoFiles = (files === null || files === void 0 ? void 0 : files.video) || [];
            const imageFile = (_a = files === null || files === void 0 ? void 0 : files.image) === null || _a === void 0 ? void 0 : _a[0];
            // Assuming a single image file
            console.log('Image file:', imageFile);
            // Check type and content of buffer
            if (imageFile) {
                console.log('Buffer is:', imageFile.buffer);
                console.log('Buffer type:', typeof imageFile.buffer);
                console.log('Buffer instance check:', Buffer.isBuffer(imageFile.buffer));
            } // Typecast req.files
            const { name, numberOfLectures, price } = req.body;
            const { contentId } = req.params;
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
            const newLecture = await client_1.default.lecture.create({
                data: {
                    name,
                    numberOfLectures: numberOfLecturesInt,
                    price: price,
                    contentId: contentIdInt,
                },
            });
            // Respond to the client quickly
            res.status(201).json({ message: 'Lecture created successfully, videos and image will be uploaded in the background.', data: newLecture });
            // Schedule background upload of videos and image
            /*setImmediate(() => {
                uploadQueue.add({
                    lectureId: newLecture.id,
                    videoFiles,
                    imageFile,
                });
            });*/
        }
        catch (error) {
            console.error('Error creating lecture:', error);
            next(error); // Handle error with Express error middleware
        }
    } /*
    async updateLecture(req: Request, res: Response, next: NextFunction){
    
        try {
            const hospital = await lectureService.updateLecture(req.params.id,req.body);
            response(res, 201, {status: true, message: "lecture updated successfully!", data: hospital});
        } catch (error) {
            next(error);
        }
    }*/
    async deleteLecture(req, res, next) {
        try {
            const hospital = await lectureService_1.default.deleteLecture(req.params.id);
            (0, response_1.default)(res, 201, { status: true, message: "Account updated successfully!", data: hospital });
        }
        catch (error) {
            next(error);
        }
    }
}
const lectureController = new LectureController();
exports.default = lectureController;
//# sourceMappingURL=lectureController.js.map