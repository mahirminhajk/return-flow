import { Types } from "mongoose";
import { Admin, IAdminDocument } from "../models/Admin";
import { IAdmin } from "../types/models";
import { BadRequestErr, comparePassword, hashPassword } from "../utils";
import { ErrTypes } from "../types";

export class AdminService {
    static async createAdmin(admin: IAdmin, createdBy?: Types.ObjectId): Promise<IAdminDocument | null> {
        //* hash password
        if (!admin.password) throw new BadRequestErr("Password is required.", ErrTypes.VALIDATION_ERROR);
        const hashedPassword = hashPassword(admin.password);

        const newAdmin = await Admin.create({
            ...admin,
            password: hashedPassword,
            createdBy,
        });
        if (!newAdmin) return null;
        return newAdmin;
    }

    static async getAdminByPhone(phone: string): Promise<IAdminDocument | null> {
        const admin = await Admin.findOne({ phone });
        if (!admin) return null;
        return admin;
    }

    static async getAdminById(id: Types.ObjectId): Promise<IAdminDocument | null> {
        const admin = await Admin.findById(id);
        if (!admin) return null;
        return admin;
    }

    static async changePassword(adminId: Types.ObjectId, oldPassword: string, newPassword: string): Promise<IAdminDocument | null> {
        const admin = await Admin.findById(adminId);
        if (!admin) return null;

        //* check old password
        const isMatch = comparePassword(oldPassword, admin.getPassword());
        if (!isMatch) throw new BadRequestErr("password is incorrect.", ErrTypes.VALIDATION_ERROR);

        //* hash new password
        const hashedPassword = hashPassword(newPassword);

        admin.password = hashedPassword;
        await admin.save();

        return admin;
    };
}
