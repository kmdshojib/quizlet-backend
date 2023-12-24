"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("./userController");
const userRoute = (0, express_1.Router)();
userRoute.post("/register", userController_1.createUser);
userRoute.post("/login", userController_1.loginUser);
userRoute.post("/scores", userController_1.postUserScore);
userRoute.get("/userScore/:id", userController_1.getUserScore);
userRoute.get("/allUserScore", userController_1.getAllQuizScores);
exports.default = userRoute;
//# sourceMappingURL=userRoute.js.map