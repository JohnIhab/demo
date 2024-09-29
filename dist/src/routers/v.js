"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const n_1 = __importDefault(require("../controllers/n"));
const m_1 = __importDefault(require("../middlewares/m"));
const QuizAndPDF_1 = __importDefault(require("../controllers/QuizAndPDF"));
//import video1Controller from '../controllers/test1';
const auth_1 = __importDefault(require("../middlewares/auth"));
const isAdmin_1 = require("../middlewares/isAdmin");
const test2_1 = require("../controllers/test2");
const multer1_1 = __importDefault(require("../middlewares/multer1"));
//import { uploadVideoController } from '../controllers/test2';
const router = (0, express_1.Router)();
router.post('/upload/:id', m_1.default.fields([{ name: 'videos', maxCount: 10 }, { name: 'image', maxCount: 1 }]), n_1.default.uploadVideos);
router.get('/', n_1.default.getVideos);
router.get('/lecture', n_1.default.getAlllecture);
router.get('/lecture/:contentId', auth_1.default, n_1.default.getAllLecturesBycontentId);
router.delete('/lecture/:id', isAdmin_1.isAdmin, n_1.default.deleteLecture);
router.post('/:contentId/quizzes', isAdmin_1.isAdmin, QuizAndPDF_1.default.createQuizController);
router.get('/quizzes/:id', auth_1.default, QuizAndPDF_1.default.getQuizzesByContentIdController);
router.delete('/quizzes/:id', auth_1.default, QuizAndPDF_1.default.deleteQuiz);
router.get('/quizzes', auth_1.default, QuizAndPDF_1.default.allQuiz);
/*
router.post('/up/:id',  isAdmin ,
    uploadToMemoryStorage.fields([{ name: 'videos', maxCount: 10 }, { name: 'image', maxCount: 1 }]),
    video1Controller.uploadVideos
);
*/
//router.post('/large', uploadToMemoryStorage.single('video'), uploadVideoController);
router.post('/load', multer1_1.default.single('video'), test2_1.uploadVideoController);
exports.default = router;
//# sourceMappingURL=v.js.map