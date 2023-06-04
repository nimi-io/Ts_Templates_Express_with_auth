import { authController } from "./auth.controller";
import UserModel from "./model/User.Model";
import { Router } from "express";

// const controller = new authController();
export class authRoutes {
  private router: Router;
  private readonly AuthController: authController;

  constructor() {
    this.router = Router();
    this.AuthController = new authController();

    this.initializeRoutes();
  }

    private initializeRoutes(): void {
    this.router.get("/hello", this.AuthController.helloHandler);
    this.router.post("/login", this.AuthController.login);
    this.router.post("/register", this.AuthController.register);
    this.router.post("/forgetPassword", this.AuthController.forgetPassword);
  }

  public getRouter(): Router {
    return this.router;
  }
}
