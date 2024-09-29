"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../../../prisma/client")); // Adjust path as needed
class QuizService {
    async createQuiz(name, link, className, contentId) {
        return client_1.default.quiz.create({
            data: {
                name,
                class: className,
                link,
                contentId,
            },
        });
    }
    async getQuizzesByContentId(contentId) {
        const content = await client_1.default.courseContent.findUnique({
            where: { id: contentId },
            select: { content: true } // Fetch only the content name
        });
        if (!content) {
            throw new Error('Content not found content .');
        }
        if (content.content !== 'Quiz') {
            throw new Error('Content is not named "Quiz".');
        }
        return client_1.default.quiz.findMany({
            where: { contentId },
        });
    }
    async deleteQuiz(quizId) {
        // Delete the quiz
        await client_1.default.quiz.delete({
            where: {
                id: quizId
            }
        });
    }
    async allQuiz() {
        const all = await client_1.default.quiz.findMany();
        return all;
    }
}
const quizService = new QuizService();
exports.default = quizService;
//# sourceMappingURL=quiz.js.map