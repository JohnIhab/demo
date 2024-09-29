import { Request, Response } from 'express';
import uploadToMemoryStorage from '../../middlewares/multer'; // تأكد من المسار الصحيح
import courseService from '../../services/services/coursesService'; 
import quizService from '../../services/services/quiz';
export const createCourse = async (req: Request, res: Response) => {
    try {
        const { name, courseFor, terms, content } = req.body;
        const imageBuffer = req.file ? req.file.buffer : null;

        // تحويل `courseFor` و `terms` و `content` إلى مصفوفات إذا كانت عبارة عن نصوص
        const courseForArray = Array.isArray(courseFor) ? courseFor : (courseFor ? JSON.parse(courseFor) : []);
        const termsArray = Array.isArray(terms) ? terms : (terms ? JSON.parse(terms) : []);
        const contentArray = Array.isArray(content) ? content : (content ? JSON.parse(content) : []);

    
        const newCourse = await courseService.saveCourseDetails(name, courseForArray, imageBuffer, termsArray, contentArray);

        res.status(201).json(newCourse);
    } catch (error) {
        console.error('Create Course Error:', error);
        res.status(500).json({ error: 'Failed to create course' });
    }
};


export const view_courses = async (req: Request, res: Response) => {
    try {
        const newCourse = await courseService.getAllCourses();

        res.status(201).json(newCourse);
    } catch (error) {
        console.error('Create Course Error:', error);
        res.status(500).json({ error: 'All courses' });
    }
};
export const updatecourse = async (req: Request, res: Response) => {
    try {
        const newCourse = await courseService.updatecourse(req.params.id,req.body);

        res.status(201).json(newCourse);
    } catch (error) {
        console.error('Create Course Error:', error);
        res.status(500).json({ error: ' update course' });
    }
};
export const deletecourse = async (req: Request, res: Response) => {
    try {
        const newCourse = await courseService.deleteCourse(req.params.id);
        res.status(201).json(newCourse);
    } catch (error) {
        console.error('Create Course Error:', error);
        res.status(500).json({ error: 'din' });
    }
};

