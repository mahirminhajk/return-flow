import { Types } from "mongoose";
import { LogsCreatedBy, LogsTypes, TransactionLabel, TransactionsCreatedBy, TransactionsStatus, TransactionTypes, UserStatusTypes } from "./enums";

export interface IUser {
    index?: number;
    name: string;
    phone: string;
    password?: string;
    invested: number;
    returnAmount: number;
    investedDate: Date;
    createdBy?: Types.ObjectId | IAdmin;
    wallet?: Types.ObjectId | IWallet & { _id: Types.ObjectId };
    status?: UserStatusTypes;
    createdAt?: Date;
    updatedAt?: Date;
};

export interface IAdmin {
    name: string;
    phone: string;
    password?: string;
    createdBy?: Types.ObjectId | null;
    createdAt?: Date;
    updatedAt?: Date;
};

export interface IWallet {
    balance: number;
    transactions: Types.ObjectId[] | ITransaction[];
    createdAt?: Date;
    updatedAt?: Date;
};

export interface ITransaction {
    wallet: Types.ObjectId | IWallet;
    type: TransactionTypes;
    label: TransactionLabel;
    amount: number;
    description: string;
    createdBy?: TransactionsCreatedBy;
    ref: Types.ObjectId | null | IUser | IAdmin;
    status: TransactionsStatus;
    createdAt?: Date;
    updatedAt?: Date;
};

