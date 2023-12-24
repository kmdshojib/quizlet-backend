import { Request, Response } from "express";
import { db } from '../../utils/db.server';
// create quiz
export const createQuiz = async (req: Request, res: Response) => {
    try {
        const { category, imageUrl, questions } = req.body;
        if (!category || !imageUrl || !questions || !Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ error: "Invalid quiz data provided" });
        }
        const quiz = {
            category: category,
            imageUrl: imageUrl,
            questions: {
                create: questions.map((q) => ({
                    text: q.question,
                    options: { set: q.options },
                    correctAnswer: q.correctAnswer,
                })),
            },
        };

        const createdQuiz = await db.quiz.create({
            data: quiz,
        });

        res.status(201).json(createdQuiz);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create quiz" });
    }
};
// delete quiz
export const deleteQuiz = async (req: Request, res: Response) => {
    try {
        const quizId = parseInt(req.params.id, 10);

        const existingQuiz = await db.quiz.findUnique({
            where: { id: quizId },
            include: { questions: true },
        });
        if (!existingQuiz) {
            return res.status(404).json({ error: "Quiz not found" });
        }

        await db.question.deleteMany({
            where: { quizId },
        });

        await db.quiz.delete({
            where: { id: quizId },
        });

        res.status(204).send("Quiz deleted successfully!");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete quiz" });
    } finally {
        // Don't forget to disconnect the Prisma client
        await db.$disconnect();
    }
};
export const getQuizes = async (req: Request, res: Response) => {
    try {
        const quizzes = await db.quiz.findMany();
        const formattedQuizes = quizzes.map((quiz) => ({
            id: quiz.id,
            category: quiz.category,
            imageUrl: quiz.imageUrl,
        }));

        res.status(200).json(formattedQuizes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch quizzes" });
    }
}
export const getQuizById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: "Quiz ID is required" });
            return;
        }

        const quiz = await db.quiz.findUnique({
            where: {
                id: parseInt(id),
            },
            include: {
                questions: true,
            },
        });

        if (!quiz) {
            res.status(404).json({ error: "Quiz not found" });
            return;
        }

        res.status(200).json(quiz);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch quiz" });
    }
};

