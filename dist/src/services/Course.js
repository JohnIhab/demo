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
// src/services/services/coursesService.ts
const configCloudinary_1 = __importDefault(require("../utils/configCloudinary"));
const client_1 = __importDefault(require("../../prisma/client")); // Ensure this path is correct
class CourseService {
    saveCourseDetails(name, courseFor, imageBuffer, terms, content) {
        return __awaiter(this, void 0, void 0, function* () {
            // رفع الصورة إلى Cloudinary
            const imageUrl = imageBuffer
                ? yield new Promise((resolve, reject) => {
                    const stream = configCloudinary_1.default.v2.uploader.upload_stream({ resource_type: 'image', folder: 'courses' }, (error, result) => {
                        var _a;
                        if (error) {
                            return reject(error);
                        }
                        resolve((_a = result === null || result === void 0 ? void 0 : result.secure_url) !== null && _a !== void 0 ? _a : '');
                    });
                    stream.end(imageBuffer);
                })
                : ''; // إذا لم تكن هناك صورة، يتم استخدام قيمة فارغة
            // إعداد بيانات الترمات بناءً على courseFor
            let termsData = [];
            if (courseFor.includes('ثانوي عامة')) {
                if (terms.includes('الترم الأول')) {
                    termsData.push({
                        name: 'الترم الأول',
                        contents: content.map((c) => ({ content: c })),
                        courseFor: 'ثانوي عامة'
                    });
                }
                if (terms.includes('الترم الثاني')) {
                    termsData.push({
                        name: 'الترم الثاني',
                        contents: content.map((c) => ({ content: c })),
                        courseFor: 'ثانوي عامة'
                    });
                }
            }
            if (courseFor.includes('ثانوي لغات')) {
                if (terms.includes('الترم الأول')) {
                    termsData.push({
                        name: 'الترم الأول',
                        contents: content.map((c) => ({ content: c })),
                        courseFor: 'ثانوي لغات'
                    });
                }
                if (terms.includes('الترم الثاني')) {
                    termsData.push({
                        name: 'الترم الثاني',
                        contents: content.map((c) => ({ content: c })),
                        courseFor: 'ثانوي لغات'
                    });
                }
            }
            // إنشاء الكورس مع الترمات والمحتوى
            const newCourse = yield client_1.default.course.create({
                data: {
                    name,
                    imageUrl,
                    courseFor: courseFor.join(', '),
                    terms: {
                        create: termsData.map((term) => ({
                            name: term.name,
                            courseFor: term.courseFor,
                            contents: {
                                create: term.contents
                            }
                        }))
                    }
                },
                include: {
                    terms: {
                        include: {
                            contents: true
                        }
                    }
                }
            });
            return newCourse;
        });
    }
    ;
    getAllCourses() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courses = yield client_1.default.course.findMany({
                    include: {
                        terms: {
                            include: {
                                contents: true
                            }
                        }
                    }
                });
                return courses;
            }
            catch (error) {
                console.error('Error fetching courses:', error);
                throw new Error('Unable to fetch courses');
            }
        });
    }
    updatecourse(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const termId = parseInt(id);
            const { name } = data;
            const updatedTerm = yield client_1.default.course.update({
                where: { id: termId },
                data: {
                    name,
                },
            });
            return updatedTerm;
        });
    }
    ;
    deleteCourse(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const courseId = parseInt(id);
            try {
                // Delete related content records
                yield client_1.default.courseContent.deleteMany({
                    where: {
                        termId: {
                            in: yield client_1.default.term.findMany({
                                where: { courseId },
                                select: { id: true }
                            }).then(terms => terms.map(term => term.id))
                        }
                    }
                });
                // Delete related terms
                yield client_1.default.term.deleteMany({
                    where: {
                        courseId
                    }
                });
                // Delete the course
                yield client_1.default.course.delete({
                    where: {
                        id: courseId
                    }
                });
                return { message: 'Course and related terms and contents successfully deleted' };
            }
            catch (error) {
                console.error('Error deleting course:', error);
                throw new Error('Unable to delete course');
            }
        });
    }
}
const courseService = new CourseService();
exports.default = courseService;
