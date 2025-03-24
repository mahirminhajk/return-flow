import { body } from "express-validator";
import { TransactionLabel, TransactionTypes } from "../../../types";

export const transactionTypeValidator = body("type")
    .exists().withMessage("Type is required.")
    .isIn(Object.values(TransactionTypes))
    .withMessage("Invalid transaction type.");

export const transactionLabelValidator = body("label")
    .exists().withMessage("Label is required.")
    .isIn(Object.values(TransactionLabel))
    .withMessage("Invalid transaction label.");

export const transactionAmountValidator = body("amount")
    .exists().withMessage("Amount is required.")
    .isNumeric().withMessage("Amount must be a number.")
    .isFloat({ min: 1 }).withMessage("Amount must be greater than 0.");

export const transactionDescriptionValidator = body("description")
    .exists().withMessage("Description is required.")
    .isString().withMessage("Description must be a string.")
    .isLength({ min: 5 }).withMessage("Description must be at least 5 characters long.");