import express, { Express, NextFunction, Request, Response } from "express";
import { authRoutes } from "./AuthModule/auth.routes";
import { notFoundErrorHandler } from "./Shared/common/notFountErrorHAndler";
import bodyParser from "body-parser";
import morgan from "morgan";
const logger = morgan("combined"); // Specify the desired log format ('combined', 'common', 'dev', 'short', 'tiny')
import fs from "fs";

const accessLogStream = fs.createWriteStream("./logs/access.log", {
  flags: "a",
});

const route = new authRoutes();
class App {
  private app: Express;

  constructor() {
    this.app = express();
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandling();
    this.notFoundErrorHanling();
  }

  private setupMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    const logger = morgan("combined", { stream: accessLogStream });

    this.app.use(logger);
  }

  private setupRoutes(): void {
    this.app.use("/auth", new authRoutes().getRouter());
  }

  private notFoundErrorHanling(): void {
    this.app.use(notFoundErrorHandler);
  }

  private setupErrorHandling(): void {
    this.app.use(
      (err: any, req: Request, res: Response, next: NextFunction) => {
        console.error(err);
        res.status(500).send("Internal Server Error");
      }
    );
  }
  
  public start(port: number): void {
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}

const app = new App();
app.start(3000);
