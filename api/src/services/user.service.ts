import mongoose, { Types } from "mongoose";
import { User, IUserDocument } from "../models/User";
import { IUser, IWallet } from "../types/models";
import { BadRequestErr, BaseErr, hashPassword } from "../utils";
import { ErrTypes, TransactionLabel, TransactionsCreatedBy, TransactionsStatus, TransactionTypes } from "../types";
import { WalletService } from "./wallet.service";
import { TransactionService } from "./transactions.service";

export class UserService {
    static async getUserByPhone(phone: string): Promise<IUserDocument | null> {
        const user = await User.findOne({
            phone,
        });
        if (!user) return null;
        return user;
    };

    static async getUserById(id: Types.ObjectId): Promise<IUserDocument | null> {
        const user = await User.findById(id).populate([
            { path: "wallet" },
            { path: "createdBy", select: "name" },
        ]);
        if (!user) return null;
        return user;
    }

    static async createUser(user: IUser, createdBy: Types.ObjectId): Promise<IUserDocument | null> {
        //* hash password
        if (!user.password) throw new BadRequestErr("Password is required.", ErrTypes.VALIDATION_ERROR);
        const hashedPassword = hashPassword(user.password);

        //* create wallet
        const wallet = await WalletService.createWallet(createdBy);
        if (!wallet) throw new BadRequestErr("Failed to create wallet.", ErrTypes.SERVER_ERROR);

        const newUser = await User.create({
            ...user,
            password: hashedPassword,
            createdBy,
            wallet,
        });
        if (!newUser) return null;
        return newUser;
    }

    static async requestWithdraw(user: IUserDocument, amount: number, description: string) {

        //* check balance here
        const wallet = user.wallet as IWallet;
        if (!user.wallet || wallet.balance < amount) throw new BadRequestErr("Insufficient balance.", ErrTypes.BAD_REQUEST);

        try {
            //* create transaction
            const requestTransaction = await TransactionService.createWithdrawRequestTransaction(
                (user.wallet as any)._id as Types.ObjectId,
                amount,
                user._id as Types.ObjectId,
                description,
            );
            if (!requestTransaction) throw new BadRequestErr("Failed to create transaction.", ErrTypes.SERVER_ERROR);

            const newWallet = await WalletService.addTransactionToWallet(
                (user.wallet as any)._id as Types.ObjectId,
                requestTransaction,
            );
            if (!newWallet) throw new BadRequestErr("Failed to update wallet.", ErrTypes.SERVER_ERROR);

            return {
                requestTransaction,
                newWallet,
            }
        } catch (error) {
            console.log("❌ Error in requestWithdraw: ", error);
            if (error instanceof BaseErr) throw error;
            else throw new BadRequestErr("Failed to request withdraw.", ErrTypes.SERVER_ERROR);
        }
    };

    static async getAllUsers(page: number, limit: number, search?: string): Promise<{ users: IUserDocument[]; total: number }> {
        // Construct the query object
        const query: any = {};

        if (search) {
            if (/^\d+$/.test(search)) { // Check if the search string is a number
                query.phone = { $regex: search, $options: "i" }; // Case-insensitive regex
            } else {
                query.name = { $regex: search, $options: "i" }; // Case-insensitive regex
            }
        }

        // Get the total count of matching users
        const total = await User.countDocuments(query);

        // Fetch the paginated users
        const users = await User.find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ updatedAt: -1 }) // Sort by updatedAt
            .setOptions({ noWalletPopulate: true });

        return { users, total };
    }

    static async changePasswordByAdmin(userId: Types.ObjectId, newPassword: string): Promise<IUserDocument | null> {
        const newHashedPassword = hashPassword(newPassword);
        const updatedUser = await User.
            findByIdAndUpdate(userId, { password: newHashedPassword }, { new: true });
        if (!updatedUser) return null;
        return updatedUser;
    };

    static async deleteUser(userId: Types.ObjectId): Promise<IUserDocument | null> {
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) return null;
        return deletedUser;
    }

    static async updateUserByAdmin(userId: Types.ObjectId, updatedUser: {
        name?: string;
        phone?: string;
        invested?: number;
        returnAmount?: number;
        investedDate?: Date;
        status?: string;
    }): Promise<IUserDocument | null> {
        const user = await User.findByIdAndUpdate(userId, updatedUser, { new: true });
        if (!user) return null;
        return user;
    };

    static async addTransactionToMultipleUsers(userIds: Types.ObjectId[], transactionData: {
        type: TransactionTypes;
        label: TransactionLabel;
        amount: number;
        description: string;
    }, adminId: Types.ObjectId): Promise<void> {
        const transaction = {
            ...transactionData,
            createdBy: TransactionsCreatedBy.ADMIN,
            ref: adminId,
            status: TransactionsStatus.ACCEPTED,
        }

        for (const userId of userIds) {
            const user = await User.findById(userId);
            if (!user) continue;

            const wallet = user.wallet;
            if (!wallet) continue;

            const newTransaction = await TransactionService.createTransaction({
                wallet: wallet._id,
                ...transaction,
            });
            if (!newTransaction) continue;

            //* unshift transaction to wallet
            await WalletService.addTransactionToWallet(wallet._id, newTransaction);
        }
    };
}
