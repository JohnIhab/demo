"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class term {
    async getAllTerms() {
        const terms = await prisma.term.findMany({
            include: { course: true },
        });
        return terms;
    }
    ;
    async checkCourseFor(courseId, courseFor) {
        const courseID = parseInt(courseId);
        // First check if the course exists and has the correct courseFor
        const course = await prisma.course.findFirst({
            where: {
                id: courseID,
                courseFor: courseFor,
            },
        });
        // Return true if the course exists and matches courseFor, otherwise false
        return !!course;
    }
    async getTermsByCourseId(courseId, courseFor) {
        const courseID = parseInt(courseId);
        console.log(courseID);
        const course = await prisma.course.findUnique({
            where: { id: courseID },
        });
        if (!course) {
            // If course does not exist, return an empty array or handle as needed
            throw new Error('Course not found');
        }
        const terms = await prisma.term.findMany({
            where: {
                courseId: courseID,
                courseFor: courseFor,
            },
        });
        return terms;
    }
    async createTerm(id, data) {
        const courseId = parseInt(id);
        const { name } = data;
        const newTerm = await prisma.term.create({
            data: {
                name,
                course: { connect: { id: Number(courseId) } },
            },
        });
        return newTerm;
    }
    ;
    async updateTerm(id, data) {
        const termId = parseInt(id);
        const { name, courseId } = data;
        const updatedTerm = await prisma.term.update({
            where: { id: termId },
            data: {
                name,
                course: { connect: { id: Number(courseId) } },
            },
        });
        return updatedTerm;
    }
    ;
    async deleteTerm(id) {
        const termId = parseInt(id);
        const deletedterm = await prisma.term.delete({
            where: { id: termId },
        });
        return deletedterm;
    }
    ;
    async toggleLockTerm(id) {
        // Fetch the current isLocked status of the term
        const termId = parseInt(id);
        const term = await prisma.term.findUnique({
            where: { id: termId },
            select: { isLocked: true }
        });
        if (!term) {
            throw new Error(`Term with ID ${termId} not found.`);
        }
        // Toggle isLocked status: if locked, unlock; if unlocked, lock
        const newLockStatus = !term.isLocked;
        const actionMessage = newLockStatus ? 'Term locked successfully.' : 'Term unlocked successfully.';
        // Update the term's isLocked status in the database
        const updatedTerm = await prisma.term.update({
            where: { id: termId },
            data: { isLocked: newLockStatus },
            select: {
                id: true,
                name: true,
                isLocked: true,
                course: {
                    select: {
                        id: true,
                        name: true // Assuming `name` is a field in the Course model
                    }
                }
            }
        });
        return { message: actionMessage, term: updatedTerm };
    }
    async updateTerms() {
        const update = await prisma.term.updateMany({
            where: {
                isLocked: true // Update only those that are currently true
            },
            data: {
                isLocked: false // Set to false
            }
        });
        console.log(`${update.count} terms updated to isLocked: false`);
    }
    async token() {
        const update = await prisma.token.findMany();
        return update;
    }
}
const termService = new term();
exports.default = termService;
//# sourceMappingURL=termService.js.map