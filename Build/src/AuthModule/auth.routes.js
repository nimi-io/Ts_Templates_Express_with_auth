"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const auth_controller_1 = require("./auth.controller");
const createUserDto_1 = require("./dto/createUserDto");
const express_1 = require("express");
// const controller = new authController();
class authRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.AuthController = new auth_controller_1.authController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get("/hello", this.AuthController.helloHandler);
        this.router.post("/login", createUserDto_1.validateLoginUser, this.AuthController.login);
        this.router.post("/register", createUserDto_1.validateCreateUser, this.AuthController.register);
        this.router.post("/forgetPassword", this.AuthController.forgetPassword);
    }
    getRouter() {
        return this.router;
    }
}
exports.authRoutes = authRoutes;
