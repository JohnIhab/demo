"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const quiz_1 = __importDefault(require("../services/services/quiz"));
const client_1 = __importDefault(require("../../prisma/client"));
const response_1 = __importDefault(require("../utils/response"));
class QuizAndPDfController {
    async createQuizController(req, res, next) {
        try {
            const { name, class: className, link } = req.body;
            const contentId = parseInt(req.params.contentId);
            // Validate input
            if (!name || !link || !contentId) {
                return res.status(400).json({ status: false, message: 'Name, link, and contentId are required' });
            }
            const contentExists = await client_1.default.courseContent.findUnique({
                where: { id: contentId },
            });
            if (!contentExists) {
                return res.status(400).json({ status: false, message: 'Invalid contentId: CourseContent not found' });
            }
            const quiz = await quiz_1.default.createQuiz(name, link, className, contentId);
            (0, response_1.default)(res, 201, { status: true, message: "Quiz created successfully", data: quiz });
        }
        catch (error) {
            next(error);
        }
    }
    ;
    async getQuizzesByContentIdController(req, res, next) {
        try {
            const contentId = parseInt(req.params.id);
            if (isNaN(contentId)) {
                return res.status(400).json({ status: false, message: 'Invalid contentId' });
            }
            const quizzes = await quiz_1.default.getQuizzesByContentId(contentId);
            (0, response_1.default)(res, 201, { status: true, message: "successfully", data: quizzes });
        }
        catch (error) {
            next(error);
        }
    }
    ;
    async deleteQuiz(req, res, next) {
        try {
            const quizId = parseInt(req.params.id);
            const quizzes = await quiz_1.default.deleteQuiz(quizId);
            (0, response_1.default)(res, 201, { status: true, message: "quiz delete successfully" });
        }
        catch (error) {
            next(error);
        }
    }
    ;
    async allQuiz(req, res, next) {
        try {
            const quizzes = await quiz_1.default.allQuiz();
            (0, response_1.default)(res, 201, { status: true, message: "all quiz", data: quizzes });
        }
        catch (error) {
            next(error);
        }
    }
    ;
}
const QuizDPFController = new QuizAndPDfController();
exports.default = QuizDPFController;
//# sourceMappingURL=QuizAndPDF.js.map