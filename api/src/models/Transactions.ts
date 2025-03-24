import { Document, model, Schema } from "mongoose";
import { TransactionLabel, TransactionsCreatedBy, TransactionsStatus, TransactionTypes } from "../types";
import { ITransaction } from "../types/models";

export interface ITransactionDocument extends ITransaction, Document { };

const transactionSchema = new Schema<ITransactionDocument>({
    wallet: { type: Schema.Types.ObjectId, ref: "Wallet" },
    type: { type: String, required: true, enum: Object.values(TransactionTypes) },
    label: { type: String, required: true, enum: Object.values(TransactionLabel) },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    createdBy: { type: String, required: true, enum: Object.values(TransactionsCreatedBy) },
    ref: { type: Schema.Types.ObjectId, refPath: "createdBy" },
    status: { type: String, required: true, enum: Object.values(TransactionsStatus) },
}, { timestamps: true });

export const Transaction = model<ITransactionDocument>("Transaction", transactionSchema);
