import { Router, Request, Response } from "express";
import { createQuiz, deleteQuiz, getQuizById, getQuizes } from "./quizController";

const quizRoute: any = Router()
quizRoute.get("/getQuizes", getQuizes)
quizRoute.get("/getQuizes/:id", getQuizById)
quizRoute.delete("/deleteQuiz/:id", deleteQuiz)
quizRoute.post("/addQuiz", createQuiz)
export default quizRoute;