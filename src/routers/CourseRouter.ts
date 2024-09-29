import express from 'express';
import multer , { FileFilterCallback }from 'multer';
import { Request, Response, NextFunction } from "express";
import { 
    createCourse ,
    updatecourse,  
    view_courses,
    deletecourse
    } from '../controllers/CourseController'; 
import uploadToMemoryStorage from '../middlewares/multer';
import auth from '../middlewares/auth';
import CustomRequest from '../interfaces/customRequest';
//import { isAdmin } from '../middlewares/isAdmin';
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
router.post('/create-course',/*isAdmin ,*/  upload.single('image'), createCourse);
router.get('/all',auth ,  view_courses);
router.patch('/:id',auth ,   updatecourse);
router.delete('/:id',auth ,   deletecourse);

// تعديل هذا السطر لاستقبال الفيديوهات عند إنشاء الـ lecture


//quiz


export default router;