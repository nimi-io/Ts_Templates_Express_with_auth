"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundErrorHandler = void 0;
class NotFoundError extends Error {
    constructor() {
        super("Not Found");
        this.name = "NotFoundError";
        this.statusCode = 404;
    }
}
const notFoundErrorHandler = (req, res, next) => {
    const error = new NotFoundError();
    res.status(error.statusCode).json({ error: error.message });
    next(error);
};
exports.notFoundErrorHandler = notFoundErrorHandler;
