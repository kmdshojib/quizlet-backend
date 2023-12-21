"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("./userController");
const userRoute = (0, express_1.Router)();
userRoute.post("/register", userController_1.createUser);
userRoute.post("/login", userController_1.loginUser);
exports.default = userRoute;
//# sourceMappingURL=userRoute.js.map