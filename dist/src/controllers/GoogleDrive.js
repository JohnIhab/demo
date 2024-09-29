"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GoogleDrive_1 = __importDefault(require("../services/GoogleDrive"));
class VideoController {
    uploadVideos(req, res, next) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
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
                const lectureData = yield GoogleDrive_1.default.saveLectureDetails(name, numberOfLecturesInt, price, contentId, isFree, subTitle);
                res.json({ status: true, message: 'Data saved successfully, video upload in progress', data: lectureData });
                setImmediate(() => __awaiter(this, void 0, void 0, function* () {
                    try {
                        yield GoogleDrive_1.default.uploadVideosInBackground(lectureData.id, videoBuffers, videoNames, imageFile.buffer);
                    }
                    catch (error) {
                        console.error('Background Upload Error:', error);
                    }
                }));
            }
            catch (error) {
                next(error);
            }
        });
    }
    getTokens(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const videos = yield GoogleDrive_1.default.getTokens();
                res.json(videos);
            }
            catch (error) {
                next(error);
            }
        });
    }
    hi(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.json({ status: true, message: 'test saved successfully' });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
const videoController = new VideoController();
exports.default = videoController;
