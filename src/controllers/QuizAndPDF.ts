import { NextFunction, Request, Response } from "express";
import quizService from "../services/services/quiz";
import prisma from "../../prisma/client";
import response from "../utils/response";
import ApiError from "../utils/ApiError";
class QuizAndPDfController {

    async createQuizController  (req: Request, res: Response , next: NextFunction)  {
        try {
            const { name, class: className, link } = req.body;
            const contentId = parseInt(req.params.contentId);
            // Validate input
            if (!name || !link || !contentId) {
                return res.status(400).json({ status: false, message: 'Name, link, and contentId are required' });
            }
            const contentExists = await prisma.courseContent.findUnique({
                where: { id: contentId },
            });
    
            if (!contentExists) {
                return res.status(400).json({ status: false, message: 'Invalid contentId: CourseContent not found' });
            }
        
            const quiz = await quizService.createQuiz(name, link, className , contentId);
            response(res, 201, {status: true, message: "Quiz created successfully"  , data: quiz});
            } catch (error) {
                next(error);
            }
        };
        
        async getQuizzesByContentIdController  (req: Request, res: Response ,next: NextFunction)  {
            try {
            const contentId = parseInt(req.params.id);
            if (isNaN(contentId)) {
                return res.status(400).json({ status: false, message: 'Invalid contentId' });
            }
        
            const quizzes = await quizService.getQuizzesByContentId(contentId);
            response(res, 201, {status: true, message: "successfully"  , data: quizzes});
            } catch (error) {
                next(error);
            }
        };

        async deleteQuiz  (req: Request, res: Response ,next: NextFunction)  {
            try {
            const quizId = parseInt(req.params.id);
            const quizzes = await quizService.deleteQuiz(quizId);
            response(res, 201, {status: true, message: "quiz delete successfully"});
            } catch (error) {
                next(error);
            }
        };
        
        async allQuiz  (req: Request, res: Response ,next: NextFunction)  {
            try {
            const quizzes = await quizService.allQuiz();
            response(res, 201, {status: true, message: "all quiz" , data: quizzes});
            } catch (error) {
                next(error);
            }
        };



        
        
}
const QuizDPFController = new QuizAndPDfController();
export default QuizDPFController;


