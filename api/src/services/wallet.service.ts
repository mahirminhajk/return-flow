import { Types } from "mongoose";
import { IWalletDocument, Wallet } from "../models/Wallet";
import { IWallet } from "../types/models";
import { TransactionService } from "./transactions.service";
import { ErrTypes, TransactionLabel, TransactionsCreatedBy, TransactionsStatus, TransactionTypes } from "../types";
import { ITransactionDocument } from "../models/Transactions";
import { BadRequestErr, NotFoundErr } from "../utils";

export class WalletService {
    static async createWallet(adminId: Types.ObjectId): Promise<Types.ObjectId | null> {
        const newWallet = await Wallet.create({
            balance: 0,
        });
        if (!newWallet) return null;
        //* create transaction
        // if (investedAmount > 0) {
        //     const transactions: Types.ObjectId[] = [];
        //     const newTransaction = await TransactionService.createInitialInvestmentTransaction(
        //         newWallet._id as Types.ObjectId,
        //         investedAmount,
        //         adminId,
        //     );
        //     if (!newTransaction) throw new Error("Failed to create transaction.");
        //     transactions.push(newTransaction._id as Types.ObjectId);

        //     //* update wallet
        //     newWallet.transactions = transactions;
        //     await newWallet.save();
        // };

        return newWallet._id as Types.ObjectId;
    }

    static async addTransactionToWallet(wallet: Types.ObjectId, transaction: ITransactionDocument): Promise<IWalletDocument | null> {
        const amount = transaction.type === TransactionTypes.CREDIT ? transaction.amount : -transaction.amount;
        const updateWallet = await Wallet.findByIdAndUpdate(wallet, {
            $inc: { balance: amount },
            $push: {
                transactions: {
                    $each: [transaction._id],
                    $position: 0,
                }
            },
        }, { new: true });
        if (!updateWallet) return null;
        return updateWallet as IWalletDocument;
    };

    static async removeTransactionFromWallet(transactionId: Types.ObjectId): Promise<{
        wallet: IWalletDocument | null;
        deletedTransaction: ITransactionDocument | null;
    }> {
        const transaction = await TransactionService.getTransactionById(transactionId);
        if (!transaction) throw new NotFoundErr("Transaction not found.");

        const amount = transaction.type === TransactionTypes.CREDIT ? -transaction.amount : transaction.amount;
        const updateWallet = await Wallet.findByIdAndUpdate(transaction.wallet, {
            $inc: { balance: amount },
            $pull: {
                transactions: transaction._id,
            },
        }, { new: true });

        if (!updateWallet) throw new BadRequestErr("Failed to remove transaction.", ErrTypes.SERVER_ERROR);

        return {
            wallet: updateWallet as IWalletDocument,
            deletedTransaction: transaction,
        };

    };

};