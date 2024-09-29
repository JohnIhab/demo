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
exports.deletecourse = exports.updatecourse = exports.view_courses = exports.createCourse = void 0;
const Course_1 = __importDefault(require("../services/Course"));
const createCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, courseFor, terms, content } = req.body;
        const imageBuffer = req.file ? req.file.buffer : null;
        // تحويل `courseFor` و `terms` و `content` إلى مصفوفات إذا كانت عبارة عن نصوص
        const courseForArray = Array.isArray(courseFor) ? courseFor : (courseFor ? JSON.parse(courseFor) : []);
        const termsArray = Array.isArray(terms) ? terms : (terms ? JSON.parse(terms) : []);
        const contentArray = Array.isArray(content) ? content : (content ? JSON.parse(content) : []);
        const newCourse = yield Course_1.default.saveCourseDetails(name, courseForArray, imageBuffer, termsArray, contentArray);
        res.status(201).json(newCourse);
    }
    catch (error) {
        console.error('Create Course Error:', error);
        res.status(500).json({ error: 'Failed to create course' });
    }
});
exports.createCourse = createCourse;
const view_courses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newCourse = yield Course_1.default.getAllCourses();
        res.status(201).json(newCourse);
    }
    catch (error) {
        console.error('Create Course Error:', error);
        res.status(500).json({ error: 'All courses' });
    }
});
exports.view_courses = view_courses;
const updatecourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newCourse = yield Course_1.default.updatecourse(req.params.id, req.body);
        res.status(201).json(newCourse);
    }
    catch (error) {
        console.error('Create Course Error:', error);
        res.status(500).json({ error: ' update course' });
    }
});
exports.updatecourse = updatecourse;
const deletecourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newCourse = yield Course_1.default.deleteCourse(req.params.id);
        res.status(201).json(newCourse);
    }
    catch (error) {
        console.error('Create Course Error:', error);
        res.status(500).json({ error: 'din' });
    }
});
exports.deletecourse = deletecourse;
