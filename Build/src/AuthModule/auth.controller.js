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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const abstractRepository_1 = require("../Shared/common/abstractRepository");
const User_Model_1 = __importDefault(require("./model/User.Model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtSecret = ((_a = process.env.SECRET_KEY) === null || _a === void 0 ? void 0 : _a.toString()) || "TestKey"; // Replace with your own secret key
class authController extends abstractRepository_1.AbstractRepository {
    constructor() {
        super(User_Model_1.default);
        this.helloHandler = (req, res) => {
            res.send("Hello, World!");
        };
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // res.send("login not implemented");
            // Get the email and password from the request body
            const { email, password } = req.body;
            console.log(req.body);
            const savedUser = yield User_Model_1.default.findOne({ email });
            // Compare the provided password with the stored hashed password
            if (savedUser == null) {
                return res.status(404).json({ message: "user not found" });
            }
            const isPasswordValid = yield bcrypt_1.default.compare(password, savedUser.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid credentials" });
            }
            savedUser.password = "";
            // Generate a JWT token
            const token = jsonwebtoken_1.default.sign({ savedUser }, jwtSecret, {
                expiresIn: "1h",
            });
            // Return the token to the client
            return res.json({ savedUser, token });
        });
        this.register = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // res.send("register not implemented");
            // Retrieve user data from request body
            const { firstname, lastname, number, email, password } = req.body;
            // Check if the username already exists
            const existingUser = (yield User_Model_1.default.findOne({
                email,
            }).exec());
            console.log(existingUser);
            if (existingUser != null) {
                return res.status(409).json({ message: "Username already exists" });
            }
            try {
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                const newUser = {
                    firstname,
                    lastname,
                    number,
                    email,
                    password: hashedPassword,
                };
                yield User_Model_1.default.create(newUser);
            }
            catch (error) { }
            // Create a new user object
            // Store the user data
            // Send a success response
            return res.status(201).json({ message: "User registered successfully" });
        });
        this.forgetPassword = (req, res) => {
            res.send("forge password not implemented");
        };
    }
}
exports.authController = authController;
