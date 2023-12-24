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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuizById = exports.getQuizes = exports.deleteQuiz = exports.createQuiz = void 0;
const db_server_1 = require("../../utils/db.server");
// create quiz
const createQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const createdQuiz = yield db_server_1.db.quiz.create({
            data: quiz,
        });
        res.status(201).json(createdQuiz);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create quiz" });
    }
});
exports.createQuiz = createQuiz;
// delete quiz
const deleteQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quizId = parseInt(req.params.id, 10);
        const existingQuiz = yield db_server_1.db.quiz.findUnique({
            where: { id: quizId },
            include: { questions: true },
        });
        if (!existingQuiz) {
            return res.status(404).json({ error: "Quiz not found" });
        }
        yield db_server_1.db.question.deleteMany({
            where: { quizId },
        });
        yield db_server_1.db.quiz.delete({
            where: { id: quizId },
        });
        res.status(204).send("Quiz deleted successfully!");
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete quiz" });
    }
    finally {
        // Don't forget to disconnect the Prisma client
        yield db_server_1.db.$disconnect();
    }
});
exports.deleteQuiz = deleteQuiz;
const getQuizes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quizzes = yield db_server_1.db.quiz.findMany();
        const formattedQuizes = quizzes.map((quiz) => ({
            id: quiz.id,
            category: quiz.category,
            imageUrl: quiz.imageUrl,
        }));
        res.status(200).json(formattedQuizes);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch quizzes" });
    }
});
exports.getQuizes = getQuizes;
const getQuizById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: "Quiz ID is required" });
            return;
        }
        const quiz = yield db_server_1.db.quiz.findUnique({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch quiz" });
    }
});
exports.getQuizById = getQuizById;
//# sourceMappingURL=quizController.js.map