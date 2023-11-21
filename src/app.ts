import express, { Express, NextFunction, Request, Response } from "express";
import { authRoutes } from "./AuthModule/auth.routes";
import { notFoundErrorHandler } from "./Shared/common/notFountErrorHAndler";
import bodyParser from "body-parser";
import morgan from "morgan";
const logger = morgan("combined"); // Specify the desired log format ('combined', 'common', 'dev', 'short', 'tiny')
import fs from "fs";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
const port: number = parseInt((process.env.PORT || "3000").toString());


const logsFolderPath = "./logs";

// Check if the "logs" folder exists
if (!fs.existsSync(logsFolderPath)) {
  // Create the "logs" folder
  fs.mkdirSync(logsFolderPath);
  console.log("Logs folder created successfully.");
} else {
  console.log("Logs folder already exists.");
}
const accessLogStream = fs.createWriteStream("./logs/access.log", {
  flags: "a",
});

const route = new authRoutes();
class App {
  private app: Express;

  constructor() {
    // });

    this.app = express();
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandling();
    this.notFoundErrorHanling();
    this.databaseConnect().then(() => this.start(port));
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

  private async databaseConnect() {
    try {
      await mongoose
        .connect(`${process.env.DB_HOST}`, {})
        .then(() => {
          console.log("Connected to MongoDB");
          // Start your application or perform database operations
        })
        .catch((error) => {
          console.error("Error connecting to MongoDB:", error);
        });

      // Create a Mongoose connection
    } catch (error) {
      console.log(error);
    }
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

export const app = new App();
// app.databaseConnect();

// app.start(3000);
