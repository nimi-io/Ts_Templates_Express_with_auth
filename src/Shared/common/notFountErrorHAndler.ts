import { Request, Response, NextFunction } from "express";

class NotFoundError extends Error {
  statusCode: number;
  constructor() {
    super("Not Found");
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

export const notFoundErrorHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new NotFoundError();
  res.status(error.statusCode).json({ error: error.message });
  next(error);
};
