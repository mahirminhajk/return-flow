import { Types } from "mongoose";
import { IAdminDocument } from "../models/Admin";
import { BadRequestErr, comparePassword, generateAdminToken, generateUserToken, NotFoundErr, verifyAdminToken, verifyUserToken } from "../utils";
import { AdminService } from "./admin.service";
import { IUserDocument } from "../models/User";
import { ErrTypes } from "../types";
import { UserService } from "./user.service";

//* strategy pattern: auth strategy
interface AuthStrategy {
    generateToken(payload: { _id: string, phone: string }): string | null;
    verifyToken(token: string): { _id: string, phone: string, admin?: boolean } | null;
    getUserByPhone(phone: string): Promise<IAdminDocument | IUserDocument | null>;
    getUserById(id: Types.ObjectId): Promise<IAdminDocument | IUserDocument | null>;
};

//* strategy implementation: admin
class AdminAuthStrategy implements AuthStrategy {
    generateToken(payload: { _id: string, phone: string }): string {
        return generateAdminToken(payload);
    }

    verifyToken(token: string): { _id: string, phone: string, admin: boolean } | null {
        return verifyAdminToken(token);
    }

    getUserByPhone(phone: string): Promise<IAdminDocument | null> {
        return AdminService.getAdminByPhone(phone);
    }

    getUserById(id: Types.ObjectId): Promise<IAdminDocument | null> {
        return AdminService.getAdminById(id);
    }
};

//* strategy implementation: user
class UserAuthStrategy implements AuthStrategy {

    generateToken(payload: { _id: string, phone: string }): string {
        return generateUserToken(payload);
    }

    verifyToken(token: string): { _id: string, phone: string } | null {
        return verifyUserToken(token);
    }

    getUserByPhone(phone: string): Promise<IUserDocument | null> {
        return UserService.getUserByPhone(phone);
    }

    getUserById(id: Types.ObjectId): Promise<IUserDocument | null> {
        return UserService.getUserById(id);
    }

};

//* auth service
class AuthService {
    private authStrategy: AuthStrategy;

    constructor(authStrategy: AuthStrategy) {
        this.authStrategy = authStrategy;
    }

    public async login({ phone, password }: { phone: string, password: string }): Promise<IAdminDocument | IUserDocument> {
        const user = await this.authStrategy.getUserByPhone(phone);
        if (!user) {
            throw new BadRequestErr('Phone number not found.', ErrTypes.PHONE_NOT_FOUND);
        }

        const isPasswordMatch = comparePassword(password, user.getPassword());
        if (!isPasswordMatch) {
            throw new BadRequestErr('Invalid credentials.', ErrTypes.INVALID_CREDENTIALS);
        }

        if (process.env.NODE_ENV !== 'test') {
            if (this.authStrategy instanceof AdminAuthStrategy) {
                console.log('🟩 Admin login');
            } else if (this.authStrategy instanceof UserAuthStrategy) {
                console.log('🟩 User login');
            }
        }

        return user;
    }

    public getToken(user: IAdminDocument | IUserDocument): string | null {
        if (user) {
            const { _id, phone } = user;
            const id = (_id as Types.ObjectId).toString();
            const token = this.authStrategy.generateToken({ _id: id, phone });

            return token;
        }
        return null;
    };

    public async verifyUser(token: string): Promise<IAdminDocument | IUserDocument | null> {
        const payload = this.authStrategy.verifyToken(token);

        if (!payload) {
            return null;
        }

        const user = await this.authStrategy.getUserById(new Types.ObjectId(payload._id));
        return user;
    }

    public logout() {
        if (process.env.NODE_ENV !== 'test') {
            if (this.authStrategy instanceof AdminAuthStrategy) {
                console.log('🟩 Admin logout');
            } else if (this.authStrategy instanceof UserAuthStrategy) {
                console.log('🟩 User logout');
            }
        }
    }
};

export const AdminAuthService = new AuthService(new AdminAuthStrategy());
export const UserAuthService = new AuthService(new UserAuthStrategy());