import express from 'express';
import multer , { FileFilterCallback }from 'multer';
import { Request, Response, NextFunction } from "express";
import contentController from '../controllers/fileController'
import lectureController from '../controllers/lectureController';
import termController from '../controllers/termController'
import { 
    createCourse ,
    updatecourse,  
    view_courses,
    deletecourse
    } from '../controllers/controllers/courses'; 
import uploadToMemoryStorage from '../middlewares/multer';
import auth from '../middlewares/auth';
import CustomRequest from '../interfaces/customRequest';
import { isAdmin } from '../middlewares/isAdmin';
const router = express.Router();
// إعداد multer للرفع إلى الذاكرة
const upload = multer({
    storage: multer.memoryStorage(), // Using memory storage
    fileFilter: (req: express.Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        const fileType = file.mimetype.split("/")[1];
        const allowedTypes = ['jpeg', 'png', 'jpg', 'mp4'];

        if (allowedTypes.includes(fileType)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type') as any, false);
        }
    },
    limits: { fileSize: 1024 * 1024 * 100 } // Setting max file size to 100MB
});
// نقطة نهاية لإنشاء كورس
router.post('/create-course',isAdmin ,  upload.single('image'), createCourse);
router.get('/all',auth ,  view_courses);
router.patch('/:id',auth ,   updatecourse);
router.delete('/:id',auth ,   deletecourse);
router.post('/upload-lecture', 
    uploadToMemoryStorage.fields([{ name: 'video' }, { name: 'image', maxCount: 1 }]), 
    lectureController.createLecture
); 
router.get('/lecture', lectureController.getAllLecture);
//router.get('/Courses', getAllCourses);
router.post('/Courses', upload.single('image'), createCourse); 
    // Routes for Term
router.get('/Term', auth ,  termController.getAllTerms);
router.post('/Term/:id',isAdmin ,   termController.createTerm);
router.get('/Term/:courseFor/:id',auth ,  termController.getTermsByCourseId);
router.patch('/Term/:id', isAdmin , termController.updateterm);
router.delete('/Term/:id',isAdmin ,  termController.deleteTerm);
router.patch('/Term/lock/:id', isAdmin, termController.toggleLockTerm);
router.get('/token111',   termController.token);

router.get('/content', auth ,contentController.getAllContent);
router.get('/content/:id',auth , contentController.getContentByTermId);
//router.post('/content', createContent);
//router.put('/content/:id', updateContent);
router.delete('/content/:id',isAdmin ,  contentController.deleteContent);
// Routes for Lecture
router.get('/lecture', lectureController.getAllLecture);
router.post('/upload-lecture', 
    uploadToMemoryStorage.fields([{ name: 'video' }, { name: 'image', maxCount: 1 }]), 
    lectureController.createLecture
); 

// تعديل هذا السطر لاستقبال الفيديوهات عند إنشاء الـ lecture
router.get('/lecture/:id', lectureController.getLectureById);
//router.patch('/lecture/:id', lectureController.updateLecture);
router.delete('/lecture/:id',isAdmin , lectureController.deleteLecture);

//quiz


export default router;