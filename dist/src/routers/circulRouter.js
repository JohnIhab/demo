"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const fileController_1 = __importDefault(require("../controllers/fileController"));
const lectureController_1 = __importDefault(require("../controllers/lectureController"));
const termController_1 = __importDefault(require("../controllers/termController"));
const courses_1 = require("../controllers/controllers/courses");
const multer_2 = __importDefault(require("../middlewares/multer"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const isAdmin_1 = require("../middlewares/isAdmin");
const router = express_1.default.Router();
// إعداد multer للرفع إلى الذاكرة
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(), // Using memory storage
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
router.post('/create-course', isAdmin_1.isAdmin, upload.single('image'), courses_1.createCourse);
router.get('/all', auth_1.default, courses_1.view_courses);
router.patch('/:id', auth_1.default, courses_1.updatecourse);
router.delete('/:id', auth_1.default, courses_1.deletecourse);
router.post('/upload-lecture', multer_2.default.fields([{ name: 'video' }, { name: 'image', maxCount: 1 }]), lectureController_1.default.createLecture);
router.get('/lecture', lectureController_1.default.getAllLecture);
//router.get('/Courses', getAllCourses);
router.post('/Courses', upload.single('image'), courses_1.createCourse);
// Routes for Term
router.get('/Term', auth_1.default, termController_1.default.getAllTerms);
router.post('/Term/:id', isAdmin_1.isAdmin, termController_1.default.createTerm);
router.get('/Term/:courseFor/:id', auth_1.default, termController_1.default.getTermsByCourseId);
router.patch('/Term/:id', isAdmin_1.isAdmin, termController_1.default.updateterm);
router.delete('/Term/:id', isAdmin_1.isAdmin, termController_1.default.deleteTerm);
router.patch('/Term/lock/:id', isAdmin_1.isAdmin, termController_1.default.toggleLockTerm);
router.get('/token111', termController_1.default.token);
router.get('/content', auth_1.default, fileController_1.default.getAllContent);
router.get('/content/:id', auth_1.default, fileController_1.default.getContentByTermId);
//router.post('/content', createContent);
//router.put('/content/:id', updateContent);
router.delete('/content/:id', isAdmin_1.isAdmin, fileController_1.default.deleteContent);
// Routes for Lecture
router.get('/lecture', lectureController_1.default.getAllLecture);
router.post('/upload-lecture', multer_2.default.fields([{ name: 'video' }, { name: 'image', maxCount: 1 }]), lectureController_1.default.createLecture);
// تعديل هذا السطر لاستقبال الفيديوهات عند إنشاء الـ lecture
router.get('/lecture/:id', lectureController_1.default.getLectureById);
//router.patch('/lecture/:id', lectureController.updateLecture);
router.delete('/lecture/:id', isAdmin_1.isAdmin, lectureController_1.default.deleteLecture);
//quiz
exports.default = router;
//# sourceMappingURL=circulRouter.js.map