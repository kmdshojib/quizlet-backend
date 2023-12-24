import { Router } from "express";
import { createUser, getAllQuizScores, getUserScore, loginUser, postUserScore } from "./userController";


const userRoute: any = Router()

userRoute.post("/register", createUser)
userRoute.post("/login", loginUser)
userRoute.post("/scores", postUserScore)
userRoute.get("/userScore/:id", getUserScore)
userRoute.get("/allUserScore", getAllQuizScores)
export default userRoute;