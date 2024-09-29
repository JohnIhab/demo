"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const v_1 = __importDefault(require("../services/v"));
const response_1 = __importDefault(require("../utils/response"));
class VideoController {
    async uploadVideos(req, res, next) {
        var _a, _b;
        try {
            const files = req.files;
            const videoFiles = (_a = files === null || files === void 0 ? void 0 : files.videos) !== null && _a !== void 0 ? _a : [];
            const imageFile = (_b = files === null || files === void 0 ? void 0 : files.image) === null || _b === void 0 ? void 0 : _b[0];
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
            const lectureData = await v_1.default.saveLectureDetails(name, numberOfLecturesInt, price, contentId, isFree, subTitle);
            res.json({ status: true, message: 'Data saved successfully, video upload in progress', data: lectureData });
            // Queue the video upload to the background
            setImmediate(async () => {
                try {
                    await v_1.default.uploadVideosInBackground(lectureData.id, videoBuffers, videoNames, imageFile.buffer);
                }
                catch (error) {
                    console.error('Background Upload Error:', error);
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getVideos(req, res, next) {
        try {
            const videos = await v_1.default.getAllVideos();
            res.json(videos);
        }
        catch (error) {
            next(error);
        }
    }
    async getAlllecture(req, res, next) {
        try {
            const videos = await v_1.default.getAlllecture();
            res.json(videos);
        }
        catch (error) {
            next(error);
        }
    }
    async getAllLecturesBycontentId(req, res, next) {
        try {
            const { contentId } = req.params;
            const videos = await v_1.default.getAllLecturesBycontentId(Number(contentId));
            res.json(videos);
        }
        catch (error) {
            next(error);
        }
    }
    async deleteLecture(req, res, next) {
        try {
            const lectureId = parseInt(req.params.id, 10);
            const lecture = await v_1.default.deleteLecture(lectureId);
            (0, response_1.default)(res, 201, { status: true, message: "delete lecture successfully!" });
        }
        catch (error) {
            next(error);
        }
    }
}
const videoController = new VideoController();
exports.default = videoController;
//# sourceMappingURL=n.js.map