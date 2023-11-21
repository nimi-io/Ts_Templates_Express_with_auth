import { Model } from "mongoose";
import { AbstractRepository } from "../Shared/common/abstractRepository";
import UserModel, { User, registerUser } from "./model/User.Model";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.SECRET_KEY?.toString() || "TestKey"; // Replace with your own secret key

export class authController extends AbstractRepository<any> {
  constructor() {
    super(UserModel);
  }

  helloHandler = (req: Request, res: Response): any => {
    res.send("Hello, World!");
  };

  login = async (req: Request, res: Response): Promise<any> => {
    // res.send("login not implemented");
    // Get the email and password from the request body
    const { email, password } = req.body;
    console.log(req.body);

    const savedUser: User | null = await UserModel.findOne({ email });
    // Compare the provided password with the stored hashed password
    if (savedUser == null) {
      return res.status(404).json({ message: "user not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, savedUser.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    savedUser.password = "";
    // Generate a JWT token
    const token = jwt.sign({ savedUser }, jwtSecret, {
      expiresIn: "1h",
    });

    // Return the token to the client
    return res.json({ savedUser, token });
  };
  register = async (req: Request, res: Response): Promise<any> => {
    // res.send("register not implemented");

    // Retrieve user data from request body
    const { firstname, lastname, number, email, password } = req.body;

    // Check if the username already exists
    const existingUser = (await UserModel.findOne({
      email,
    }).exec()) as any;

    console.log(existingUser);
    if (existingUser != null) {
      return res.status(409).json({ message: "Username already exists" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser: any = {
        firstname,
        lastname,
        number,
        email,
        password: hashedPassword,
      };

      await UserModel.create(newUser);
    } catch (error) {}
    // Create a new user object

    // Store the user data

    // Send a success response
    return res.status(201).json({ message: "User registered successfully" });
  };
  forgetPassword = (req: Request, res: Response): any => {
    res.send("forge password not implemented");
  };
}
