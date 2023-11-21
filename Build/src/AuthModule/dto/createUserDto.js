"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLoginUser = exports.validateCreateUser = void 0;
const joi_1 = __importDefault(require("joi"));
const createUserSchema = joi_1.default.object({
    firstname: joi_1.default.string().required(),
    lastname: joi_1.default.string().required(),
    number: joi_1.default.number().required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
});
const validateCreateUser = (req, res, next) => {
    const { error } = createUserSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
exports.validateCreateUser = validateCreateUser;
const loginUserValidator = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
});
const validateLoginUser = (req, res, next) => {
    const { error } = loginUserValidator.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
exports.validateLoginUser = validateLoginUser;
