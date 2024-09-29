import { Router } from 'express';
import videoController from '../controllers/n';
import uploadToMemoryStorage from '../middlewares/m';
import QuizDPFController from '../controllers/QuizAndPDF'
//import video1Controller from '../controllers/test1';
import auth from "../middlewares/auth";
import { isAdmin } from "../middlewares/isAdmin";
import { uploadVideoController } from '../controllers/test2';
import upload from '../middlewares/multer1';
//import { uploadVideoController } from '../controllers/test2';
const router = Router();

router.post('/upload/:id', 
    uploadToMemoryStorage.fields([{ name: 'videos', maxCount: 10 }, { name: 'image', maxCount: 1 }]), 
    videoController.uploadVideos
);

router.get('/', videoController.getVideos);
router.get('/lecture', videoController.getAlllecture);
router.get('/lecture/:contentId', auth , videoController.getAllLecturesBycontentId);
router.delete('/lecture/:id',  isAdmin , videoController.deleteLecture);

router.post('/:contentId/quizzes', isAdmin ,  QuizDPFController.createQuizController);
router.get('/quizzes/:id',auth , QuizDPFController.getQuizzesByContentIdController);
router.delete('/quizzes/:id', auth ,QuizDPFController.deleteQuiz);
router.get('/quizzes', auth ,QuizDPFController.allQuiz);

/*
router.post('/up/:id',  isAdmin ,
    uploadToMemoryStorage.fields([{ name: 'videos', maxCount: 10 }, { name: 'image', maxCount: 1 }]), 
    video1Controller.uploadVideos
);
*/
//router.post('/large', uploadToMemoryStorage.single('video'), uploadVideoController);
router.post('/load', upload.single('video'), uploadVideoController);














export default router;


