import { Document, model, Schema } from "mongoose";
import { UserStatusTypes } from "../types";
import { IUser } from "../types/models";
import { Query } from "mongoose";

export interface IUserDocument extends IUser, Document {
    getPassword(): string;
    noWalletPopulate?: boolean;
};

const userSchema = new Schema<IUserDocument>({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },

    invested: { type: Number, required: true },
    returnAmount: { type: Number, required: true },
    investedDate: { type: Date, required: true },

    createdBy: { type: Schema.Types.ObjectId, ref: "Admin" },
    wallet: { type: Schema.Types.ObjectId, ref: "Wallet" },

    status: { type: String, enum: Object.values(UserStatusTypes), default: UserStatusTypes.ACTIVE },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: (doc, ret) => {
            delete ret.password;
        }
    },
    toObject: {
        virtuals: true,
        versionKey: false,
        transform: (doc, ret) => {
            delete ret.password;
        }
    }
});

userSchema.methods.getPassword = function () {
    return this.password;
}

//* middleware to auto populate wallet.
userSchema.pre(/^find/, function (next) {
    if (!(this as Query<any, IUserDocument>).getOptions().noWalletPopulate) {
        (this as any).populate("wallet");
    }
    next();
});

export const User = model<IUserDocument>("User", userSchema);
