import { body, param } from "express-validator";
import { TransactionsStatus } from "../../../types";
import { transactionAmountValidator, transactionDescriptionValidator, transactionLabelValidator, transactionTypeValidator } from "./transaction.validation";

const nameValidator = body("name")
    .notEmpty().withMessage("Name is required.")
    .isString().withMessage("Name must be a string.")
    .isLength({ min: 2, max: 255 }).withMessage("Name must be between 3 to 255 characters.");

const phoneValidator = body("phone")
    .notEmpty().withMessage("Phone is required.")
    .isString().withMessage("Phone must be a string.")
    .isMobilePhone("any").withMessage("Phone is invalid.");

const passwordValidator = body("password")
    .notEmpty().withMessage("Password is required.")
    .isString().withMessage("Password must be a string.")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters.");

const investedDateValidator = body("investedDate")
    .notEmpty().withMessage("Invested date is required.")
    .isDate().withMessage("Invested date is invalid.");

const investedValidator = body("invested")
    .notEmpty().withMessage("Invested amount is required.")
    .isNumeric().withMessage("Invested amount must be a number.")
    .isFloat({ min: 0 }).withMessage("Invested amount must be greater than 0.");

const returnAmountValidator = body("returnAmount")
    .notEmpty().withMessage("Return amount is required.")
    .isNumeric().withMessage("Return amount must be a number.")
    .isFloat({ min: 0 }).withMessage("Return amount must be greater than 0.");

const transactionIdValidator = body("transactionId")
    .notEmpty().withMessage("Transaction ID is required.")
    .isMongoId().withMessage("Transaction ID is invalid.");

const statusValidator = body("status")
    .notEmpty().withMessage("Status is required.")
    .isString().withMessage("Status must be a string.")
    .isIn(Object.values(TransactionsStatus)).withMessage("Status is invalid.");

const userIdParamValidator = param("userId")
    .notEmpty().withMessage("User ID is required.")
    .isMongoId().withMessage("User ID is invalid.");

//* array of user ids
const userIdsValidator = body("userIds")
    .notEmpty().withMessage("User IDs is required.")
    .isArray({ min: 1 }).withMessage("Must select at least one user.")

const transactionIdParamValidator = param("transactionId")
    .notEmpty().withMessage("Transaction ID is required.")
    .isMongoId().withMessage("Transaction ID is invalid.");

export const createUserValidator = [
    nameValidator,
    phoneValidator,
    passwordValidator,
    investedDateValidator,
    investedValidator,
    returnAmountValidator
];

export const createAdminValidator = [
    nameValidator,
    phoneValidator,
    passwordValidator
];

export const updateTransactionValidator = [
    transactionIdValidator,
    statusValidator
];

export const addTransactionValidator = [
    userIdParamValidator,
    transactionTypeValidator,
    transactionLabelValidator,
    transactionAmountValidator,
    transactionDescriptionValidator,
];

export const addTransactionToMultipleUsersValidator = [
    userIdsValidator,
    transactionTypeValidator,
    transactionLabelValidator,
    transactionAmountValidator,
    transactionDescriptionValidator,
];

export const removeTransactionValidator = [
    transactionIdParamValidator,
];

export const getUsersDetailsForAdminValidator = [
    userIdParamValidator,
];

export const changeUserPasswordByAdminValidator = [
    userIdParamValidator,
    passwordValidator
];

export const updateUserByAdminValidator = [
    userIdParamValidator,
    nameValidator,
    phoneValidator,
    investedDateValidator,
    investedValidator,
    returnAmountValidator,
];