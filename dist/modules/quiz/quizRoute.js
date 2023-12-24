"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const quizController_1 = require("./quizController");
const quizRoute = (0, express_1.Router)();
quizRoute.get("/getQuizes", quizController_1.getQuizes);
quizRoute.get("/getQuizes/:id", quizController_1.getQuizById);
quizRoute.delete("/deleteQuiz/:id", quizController_1.deleteQuiz);
quizRoute.post("/addQuiz", quizController_1.createQuiz);
exports.default = quizRoute;
//# sourceMappingURL=quizRoute.js.map