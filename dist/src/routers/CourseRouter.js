"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const CourseController_1 = require("../controllers/CourseController");
const auth_1 = __importDefault(require("../middlewares/auth"));
//import { isAdmin } from '../middlewares/isAdmin';
const router = express_1.default.Router();
// إعداد multer للرفع إلى الذاكرة
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    fileFilter: (req, file, cb) => {
        const fileType = file.mimetype.split("/")[1];
        const allowedTypes = ['jpeg', 'png', 'jpg', 'mp4'];
        if (allowedTypes.includes(fileType)) {
            cb(null, true);
        }
        else {
            cb(new Error('Invalid file type'), false);
        }
    },
    limits: { fileSize: 1024 * 1024 * 100 } // Setting max file size to 100MB
});
// نقطة نهاية لإنشاء كورس
router.post('/create-course', /*isAdmin ,*/ upload.single('image'), CourseController_1.createCourse);
router.get('/all', auth_1.default, CourseController_1.view_courses);
router.patch('/:id', auth_1.default, CourseController_1.updatecourse);
router.delete('/:id', auth_1.default, CourseController_1.deletecourse);
// تعديل هذا السطر لاستقبال الفيديوهات عند إنشاء الـ lecture
//quiz
exports.default = router;
