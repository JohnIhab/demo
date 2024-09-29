"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const googleDriveService_1 = __importDefault(require("../services/googleDriveService"));
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
            const lectureData = await googleDriveService_1.default.saveLectureDetails(name, numberOfLecturesInt, price, contentId, isFree, subTitle);
            res.json({ status: true, message: 'Data saved successfully, video upload in progress', data: lectureData });
            setImmediate(async () => {
                try {
                    await googleDriveService_1.default.uploadVideosInBackground(lectureData.id, videoBuffers, videoNames, imageFile.buffer);
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
    async getTokens(req, res, next) {
        try {
            const videos = await googleDriveService_1.default.getTokens();
            res.json(videos);
        }
        catch (error) {
            next(error);
        }
    }
    async hi(req, res, next) {
        try {
            res.json({ status: true, message: 'test saved successfully' });
        }
        catch (error) {
            next(error);
        }
    }
}
const videoController = new VideoController();
exports.default = videoController;
//# sourceMappingURL=googleDrive.js.map