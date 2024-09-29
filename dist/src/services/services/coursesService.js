"use strict";
// src/services/services/coursesService.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../../../prisma/client")); // Ensure this path is correct
const configCloudinary_1 = __importDefault(require("../../utils/configCloudinary"));
class CourseService {
    async saveCourseDetails(name, courseFor, imageBuffer, terms, content) {
        // رفع الصورة إلى Cloudinary
        const imageUrl = imageBuffer
            ? await new Promise((resolve, reject) => {
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
        const newCourse = await client_1.default.course.create({
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
    }
    ;
    async getAllCourses() {
        try {
            const courses = await client_1.default.course.findMany({
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
    }
    async updatecourse(id, data) {
        const termId = parseInt(id);
        const { name } = data;
        const updatedTerm = await client_1.default.course.update({
            where: { id: termId },
            data: {
                name,
            },
        });
        return updatedTerm;
    }
    ;
    async deleteCourse(id) {
        const courseId = parseInt(id);
        try {
            // Delete related content records
            await client_1.default.courseContent.deleteMany({
                where: {
                    termId: {
                        in: await client_1.default.term.findMany({
                            where: { courseId },
                            select: { id: true }
                        }).then(terms => terms.map(term => term.id))
                    }
                }
            });
            // Delete related terms
            await client_1.default.term.deleteMany({
                where: {
                    courseId
                }
            });
            // Delete the course
            await client_1.default.course.delete({
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
    }
}
const courseService = new CourseService();
exports.default = courseService;
//# sourceMappingURL=coursesService.js.map