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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllQuizScores = exports.getUserScore = exports.postUserScore = exports.loginUser = exports.createUser = void 0;
const userService_1 = require("./userService");
const db_server_1 = require("../../utils/db.server");
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = req.body;
    const user = yield (0, userService_1.createUserToDatabase)(userData);
    if (user) {
        res.status(200).send({
            message: "User created successfully!",
        });
    }
    else {
        res.status(404).send({
            message: "Oops! Something went wrong!",
        });
    }
});
exports.createUser = createUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield db_server_1.db.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!user) {
            return res
                .status(400)
                .json({ error: 'User not registered or invalid email address!' });
        }
        const matchPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!matchPassword) {
            return res.status(400).json({ error: 'Please check your password!' });
        }
        res.status(200).json({
            user: {
                id: user.id,
                name: user.fullName,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.loginUser = loginUser;
const postUserScore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, userId, scores } = req.body;
        const existingUser = yield db_server_1.db.quizScore.findUnique({
            where: { userId: userId },
        });
        if (existingUser) {
            const existingScoresArray = Array.isArray(existingUser.scores) ? existingUser.scores : [];
            const updatedScores = [...existingScoresArray, scores];
            yield db_server_1.db.quizScore.update({
                where: { userId: userId },
                data: {
                    scores: updatedScores,
                },
            });
        }
        else {
            yield db_server_1.db.quizScore.create({
                data: {
                    fullName,
                    userId,
                    scores: [scores],
                },
            });
        }
        res.status(201).json({ success: true });
    }
    catch (error) {
        console.error('Error handling quiz score:', error);
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return res.status(400).json({ error: 'User ID is already taken' });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.postUserScore = postUserScore;
const getUserScore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const userId = parseInt(id, 10);
        const user = yield db_server_1.db.quizScore.findMany({
            where: {
                userId: userId
            },
        });
        if (!user || user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        const scores = user.flatMap((record) => record.scores || []);
        res.status(200).json({ userId, scores });
    }
    catch (error) {
        console.error('Error getting quiz scores:', error);
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2016') {
                return res.status(404).json({ error: 'User not found' });
            }
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getUserScore = getUserScore;
const getAllQuizScores = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quizzeScores = yield db_server_1.db.quizScore.findMany();
        res.status(200).json(quizzeScores);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch quizzes" });
    }
});
exports.getAllQuizScores = getAllQuizScores;
//# sourceMappingURL=userController.js.map