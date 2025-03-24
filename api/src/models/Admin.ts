import { Document, model, Schema } from "mongoose";
import { IAdmin } from "../types/models";

export interface IAdminDocument extends IAdmin, Document {
    getPassword(): string;
};

const adminSchema = new Schema<IAdminDocument>({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },

    createdBy: { type: Schema.Types.ObjectId, ref: "Admin", default: null },
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

adminSchema.methods.getPassword = function () {
    return this.password;
}

export const Admin = model<IAdminDocument>("Admin", adminSchema);
