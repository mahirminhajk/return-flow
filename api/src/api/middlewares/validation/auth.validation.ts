import { body, } from "express-validator";

const phoneValidator = body("phone")
    .notEmpty()
    .isString()
    .withMessage("Phone number is required.")
    .isMobilePhone("any")
    .withMessage("Invalid phone number.");

const passwordValidator = body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isString()
    .isLength({ min: 6 })
    .withMessage("Invalid password.");

export const loginValidator = [
    phoneValidator,
    passwordValidator
];