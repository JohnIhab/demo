"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class Content {
    async getAllContent() {
        const content = await prisma.courseContent.findMany({
            include: {
                Quiz: true,
                Lecture: true,
            },
        });
        return content;
    }
    async getContentByTermId(termId) {
        const term = await prisma.term.findUnique({
            where: { id: termId },
            select: { isLocked: true }
        });
        if (!term) {
            throw new Error('term not found.');
        }
        if (term.isLocked) {
            return { status: false, message: 'The term is locked. Content cannot be accessed.' };
        }
        const contents = await prisma.courseContent.findMany({
            where: {
                termId: termId
            }
        });
        return { status: true, message: 'Content successfully retrieved!', data: contents };
    }
    /*
        async getContentByCourseId(courseId: string) {
            const courseID = parseInt(courseId, 10);
            if (isNaN(courseID)) {
                throw new Error('Invalid course ID');
            }
            const content = await prisma.courseContent.findMany({
                where: { courseId: courseID },
                include: {
                    PDF: true,
                    Quiz: true,
                },
            });
            return content;
        }
    */
    /* async createContent(courseId: string, data: updateType) {
         const courseID = parseInt(courseId, 10);
         if (isNaN(courseID)) {
             throw new Error('Invalid course ID');
         }
         const { type, videoUrl, pdfs, quizzes } = data;
         const content = await prisma.courseContent.create({
             data: {
                 content: type,
                 course: { connect: { id: courseID } },
                 PDF: {
                     create: pdfs?.map((pdfUrl: string) => ({ url: pdfUrl })) || [],
                 },
                 Quiz: {
                     create: quizzes?.map((quizUrl: string) => ({ url: quizUrl })) || [],
                 },
             },
         });
         return content;
     }
 */
    /* async updateContent(id: string, data: updateType) {
         const contentId = parseInt(id, 10);
         if (isNaN(contentId)) {
             throw new Error('Invalid content ID');
         }
         const { type, courseId, pdfs, quizzes } = data;
         const content = await prisma.courseContent.update({
             where: { id: contentId },
             data: {
                 content: type,
                 course: { connect: { id: Number(courseId) } },
                 PDF: {
                     upsert: pdfs?.map((pdfUrl: string) => ({
                         where: { url: pdfUrl },
                         update: { url: pdfUrl },
                         create: { url: pdfUrl },
                     })) || [],
                 },
                 Quiz: {
                     upsert: quizzes?.map((quizUrl: string) => ({
                         where: { url: quizUrl },
                         update: { url: quizUrl },
                         create: { url: quizUrl },
                     })) || [],
                 },
             },
         });
         return content;
     }*/
    async deleteContent(id) {
        const contentId = parseInt(id, 10);
        if (isNaN(contentId)) {
            throw new Error('Invalid content ID');
        }
        const content = await prisma.courseContent.delete({
            where: { id: contentId },
        });
        return content;
    }
}
const ContentService = new Content();
exports.default = ContentService;
//# sourceMappingURL=content.js.map