import { Document, model, Schema } from "mongoose";
import { IWallet } from "../types/models";

export interface IWalletDocument extends IWallet, Document { };

const walletSchema = new Schema<IWalletDocument>({
    balance: { type: Number, default: 0 },
    transactions: [{ type: Schema.Types.ObjectId, ref: "Transaction" }],
}, { timestamps: true });

export const Wallet = model<IWalletDocument>("Wallet", walletSchema);