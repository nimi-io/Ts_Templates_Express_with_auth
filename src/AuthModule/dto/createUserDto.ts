import Joi from "joi";
import { Request, Response, NextFunction } from "express";

const createUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const validateCreateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = createUserSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};
