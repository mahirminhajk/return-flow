import { Types } from "mongoose";
import { ITransactionDocument, Transaction } from "../models/Transactions";
import { ITransaction, TransactionLabel, TransactionsCreatedBy, TransactionsStatus, TransactionTypes } from "../types";

export class TransactionService {
    static async createTransaction(transaction: ITransaction): Promise<ITransactionDocument | null> {
        const newTransaction = await Transaction.create(transaction);
        if (!newTransaction) return null;
        return newTransaction;

    }

    static async getTransactionsByWallet(wallet: string): Promise<ITransactionDocument[] | null> {
        const transactions = await Transaction.find({
            wallet,
        });
        if (!transactions) return null;
        return transactions;
    }

    static async getTransactionById(transaction: Types.ObjectId): Promise<ITransactionDocument | null> {
        const transactionById = await Transaction.findById(transaction);
        if (!transactionById) return null;
        return transactionById;
    }


    //* FACTORY METHODS
    static async createInitialInvestmentTransaction(wallet: Types.ObjectId, amount: number, admin: Types.ObjectId): Promise<ITransactionDocument | null> {
        return this.createTransaction({
            wallet,
            type: TransactionTypes.CREDIT,
            label: TransactionLabel.INVESTMENT,
            amount: amount,
            description: "Initial investment.",
            createdBy: TransactionsCreatedBy.ADMIN,
            ref: admin,
            status: TransactionsStatus.ACCEPTED,
        });
    };

    static async createWithdrawRequestTransaction(wallet: Types.ObjectId, amount: number, user: Types.ObjectId, description: string): Promise<ITransactionDocument | null> {
        return this.createTransaction({
            wallet,
            type: TransactionTypes.DEBIT,
            label: TransactionLabel.WITHDRAWAL,
            amount: amount,
            description,
            createdBy: TransactionsCreatedBy.USER,
            ref: user,
            status: TransactionsStatus.PENDING,
        });
    };

    static async createReturnTransaction(wallet: Types.ObjectId, amount: number,): Promise<ITransactionDocument | null> {
        return this.createTransaction({
            wallet,
            type: TransactionTypes.CREDIT,
            label: TransactionLabel.RETURN,
            amount: amount,
            description: `Monthly return for ${new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}`,
            createdBy: TransactionsCreatedBy.SYSTEM,
            ref: null,
            status: TransactionsStatus.ACCEPTED,
        });
    };


    static async updateTransactionStatus(transactionId: Types.ObjectId, status: TransactionsStatus): Promise<ITransactionDocument | null> {
        const updatedTransaction = await Transaction.findByIdAndUpdate(transactionId, {
            status,
        }, { new: true });
        if (!updatedTransaction) return null;
        return updatedTransaction;
    };

    static async getTransactions(transactions: Types.ObjectId[], page: number, limit: number) {

        const transactionsList = await Transaction.find({
            _id: { $in: transactions }
        })
            .sort({ _id: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        if (!transactionsList) return null;

        return transactionsList;
    };

};


//TODO: the wallet __v is not incrementing, when we add a new transaction.