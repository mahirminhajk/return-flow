import { transactionAmountValidator, transactionDescriptionValidator } from "./transaction.validation";

export const withdrawRequestValidator = [
    transactionAmountValidator,
    transactionDescriptionValidator
];