import prisma from '../../../prisma/client'; // Adjust path as needed

class QuizService {
    async createQuiz(name: string, link: string, className: string , contentId: number) {
        return prisma.quiz.create({
        data: {
            name,
            class: className, 
            link,
            contentId,
        },
        });
    }

    async getQuizzesByContentId(contentId: number) {
        const content = await prisma.courseContent.findUnique({
            where: { id: contentId },
            select: { content: true } // Fetch only the content name
        });

        if (!content) {
            throw new Error('Content not found content .');
        }

        if (content.content !== 'Quiz') {
            throw new Error('Content is not named "Quiz".');
        }

        return prisma.quiz.findMany({
        where: { contentId },
        });
    }


    async deleteQuiz(quizId: number) {
            // Delete the quiz
            await prisma.quiz.delete({
                where: {
                    id: quizId
                }
            });
        }

    async allQuiz() {
        const all =    await prisma.quiz.findMany();
        return all;
    }

}

const quizService = new QuizService();
export default quizService;
