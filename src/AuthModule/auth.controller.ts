import { Model } from "mongoose";
import { AbstractRepository } from "../Shared/common/abstractRepository";
import UserModel from "./model/User.Model";
import { Request, Response } from "express";

export class authController extends AbstractRepository<any> {
  constructor() {
    super(UserModel);
  }

  helloHandler = (req: Request, res: Response): any => {
    res.send("Hello, World!");
  };

  login = (req: Request, res: Response): any => {
    res.send("login not implemented");
  };
  register = (req: Request, res: Response): any => {
    res.send("register not implemented");
  };
  forgetPassword = (req: Request, res: Response): any => {
    res.send("forge password not implemented");
  };
}
