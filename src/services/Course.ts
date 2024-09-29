// src/services/services/coursesService.ts
import cloudinary from "../utils/configCloudinary"
import { Request, Response } from 'express';
import prisma from '../../prisma/client'; // Ensure this path is correct
import { updatecouresType , createcourseType } from '../types/updatecouresType';

class CourseService {
    async saveCourseDetails  (
        name: string,
        courseFor: string[],
        imageBuffer: Buffer | null,
        terms: string[],
        content: string[]
        )  {
            // رفع الصورة إلى Cloudinary
            const imageUrl = imageBuffer
            ? await new Promise<string>((resolve, reject) => {
                const stream = cloudinary.v2.uploader.upload_stream(
                    { resource_type: 'image', folder: 'courses' },
                    (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(result?.secure_url ?? '');
                    }
                );
                stream.end(imageBuffer);
                })
            : ''; // إذا لم تكن هناك صورة، يتم استخدام قيمة فارغة
        
            // إعداد بيانات الترمات بناءً على courseFor
            let termsData: { name: string; contents: { content: string }[]; courseFor: string }[] = [];

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
            const newCourse = await prisma.course.create({
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
        };
        async getAllCourses() {
            try {
                const courses = await prisma.course.findMany({
                    include: {
                        terms: {
                            include: {
                                contents: true
                            }
                        }
                    }
                });
                return courses;
            } catch (error) {
                console.error('Error fetching courses:', error);
                throw new Error('Unable to fetch courses');
            }
        }
    async  updatecourse  (id: string , data : updatecouresType)  {
        const termId = parseInt(id);
        const { name} = data;
            const updatedTerm = await prisma.course.update({
                where: { id: termId },
                data: {
                    name,
                },
            });
            return updatedTerm;
    };
    
    async deleteCourse(id: string) {
        const courseId = parseInt(id);

        try {
            // Delete related content records
            await prisma.courseContent.deleteMany({
                where: {
                    termId: {
                        in: await prisma.term.findMany({
                            where: { courseId },
                            select: { id: true }
                        }).then(terms => terms.map(term => term.id))
                    }
                }
            });

            // Delete related terms
            await prisma.term.deleteMany({
                where: {
                    courseId
                }
            });

            // Delete the course
            await prisma.course.delete({
                where: {
                    id: courseId
                }
            });

            return { message: 'Course and related terms and contents successfully deleted' };
        } catch (error) {
            console.error('Error deleting course:', error);
            throw new Error('Unable to delete course');
        }
    }



}
const courseService = new CourseService();
export default courseService;
