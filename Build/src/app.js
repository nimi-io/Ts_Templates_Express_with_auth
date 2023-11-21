"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const auth_routes_1 = require("./AuthModule/auth.routes");
const notFountErrorHAndler_1 = require("./Shared/common/notFountErrorHAndler");
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const logger = (0, morgan_1.default)("combined"); // Specify the desired log format ('combined', 'common', 'dev', 'short', 'tiny')
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const port = parseInt((process.env.PORT || "3000").toString());
const accessLogStream = fs_1.default.createWriteStream("./logs/access.log", {
    flags: "a",
});
const route = new auth_routes_1.authRoutes();
class App {
    constructor() {
        // });
        this.app = (0, express_1.default)();
        this.setupMiddlewares();
        this.setupRoutes();
        this.setupErrorHandling();
        this.notFoundErrorHanling();
        this.databaseConnect().then(() => this.start(port));
    }
    setupMiddlewares() {
        this.app.use(express_1.default.json());
        this.app.use(body_parser_1.default.json());
        this.app.use(body_parser_1.default.urlencoded({ extended: true }));
        const logger = (0, morgan_1.default)("combined", { stream: accessLogStream });
        this.app.use(logger);
    }
    setupRoutes() {
        this.app.use("/auth", new auth_routes_1.authRoutes().getRouter());
    }
    notFoundErrorHanling() {
        this.app.use(notFountErrorHAndler_1.notFoundErrorHandler);
    }
    databaseConnect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield mongoose_1.default
                    .connect(`${process.env.DB_HOST}`, {})
                    .then(() => {
                    console.log("Connected to MongoDB");
                    // Start your application or perform database operations
                })
                    .catch((error) => {
                    console.error("Error connecting to MongoDB:", error);
                });
                // Create a Mongoose connection
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    setupErrorHandling() {
        this.app.use((err, req, res, next) => {
            console.error(err);
            res.status(500).send("Internal Server Error");
        });
    }
    start(port) {
        this.app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
}
exports.app = new App();
// app.databaseConnect();
// app.start(3000);
