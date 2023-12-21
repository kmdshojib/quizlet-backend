import { Router } from "express";
import { createUser, loginUser } from "./userController";


const userRoute: any = Router()

userRoute.post("/register", createUser)
userRoute.post("/login", loginUser)

export default userRoute;