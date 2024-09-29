"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletecourse = exports.updatecourse = exports.view_courses = exports.createCourse = void 0;
const coursesService_1 = __importDefault(require("../../services/services/coursesService"));
const createCourse = async (req, res) => {
    try {
        const { name, courseFor, terms, content } = req.body;
        const imageBuffer = req.file ? req.file.buffer : null;
        // تحويل `courseFor` و `terms` و `content` إلى مصفوفات إذا كانت عبارة عن نصوص
        const courseForArray = Array.isArray(courseFor) ? courseFor : (courseFor ? JSON.parse(courseFor) : []);
        const termsArray = Array.isArray(terms) ? terms : (terms ? JSON.parse(terms) : []);
        const contentArray = Array.isArray(content) ? content : (content ? JSON.parse(content) : []);
        const newCourse = await coursesService_1.default.saveCourseDetails(name, courseForArray, imageBuffer, termsArray, contentArray);
        res.status(201).json(newCourse);
    }
    catch (error) {
        console.error('Create Course Error:', error);
        res.status(500).json({ error: 'Failed to create course' });
    }
};
exports.createCourse = createCourse;
const view_courses = async (req, res) => {
    try {
        const newCourse = await coursesService_1.default.getAllCourses();
        res.status(201).json(newCourse);
    }
    catch (error) {
        console.error('Create Course Error:', error);
        res.status(500).json({ error: 'All courses' });
    }
};
exports.view_courses = view_courses;
const updatecourse = async (req, res) => {
    try {
        const newCourse = await coursesService_1.default.updatecourse(req.params.id, req.body);
        res.status(201).json(newCourse);
    }
    catch (error) {
        console.error('Create Course Error:', error);
        res.status(500).json({ error: ' update course' });
    }
};
exports.updatecourse = updatecourse;
const deletecourse = async (req, res) => {
    try {
        const newCourse = await coursesService_1.default.deleteCourse(req.params.id);
        res.status(201).json(newCourse);
    }
    catch (error) {
        console.error('Create Course Error:', error);
        res.status(500).json({ error: 'din' });
    }
};
exports.deletecourse = deletecourse;
//# sourceMappingURL=courses.js.map