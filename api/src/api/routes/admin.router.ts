import { Router, Response, NextFunction } from "express";

import { addTransactionToMultipleUsersValidator, addTransactionValidator, changeUserPasswordByAdminValidator, createAdminValidator, createUserValidator, getUsersDetailsForAdminValidator, removeTransactionValidator, updateTransactionValidator, updateUserByAdminValidator } from "../middlewares/validation/admin.validation";
import { ErrTypes, IWallet, RequestWithAdmin, TransactionsCreatedBy, TransactionsStatus } from "../../types";
import { verifyAdmin } from "../middlewares/verifyAdmin";
import { validateRequest } from "../middlewares";
import { BadRequestErr, NotFoundErr, UnauthorizedErr } from "../../utils";
import { UserService } from "../../services/user.service";
import { ApiResponse } from "../../utils/apiResponse";
import { AdminService } from "../../services/admin.service";
import { TransactionService } from "../../services/transactions.service";
import { WalletService } from "../../services/wallet.service";
import { Types } from "mongoose";
import { NotificationService } from "../../services/notification.service";
import { DashboardService } from "../../services/dashboard";

const router = Router();

//* create new user: POST /create-user
router.post("/create-user", verifyAdmin, createUserValidator, validateRequest, async (req: RequestWithAdmin, res: Response, next: NextFunction) => {
    try {
        const { name, phone, password, investedDate, invested, returnAmount } = req.body;
        const admin = req.admin;

        if (!admin) {
            return next(new UnauthorizedErr("You are not authorized to perform this action."));
        }

        //* check if user already exists
        const user = await UserService.getUserByPhone(phone);
        if (user) {
            return next(new BadRequestErr("User already exists.", ErrTypes.BAD_REQUEST));
        }

        //* create new user
        const newUser = await UserService.createUser({ name, phone, password, invested, investedDate, returnAmount }, admin._id);
        if (!newUser) {
            return next(new BadRequestErr("Failed to create new user.", ErrTypes.SERVER_ERROR));
        }

        //* send success response
        res.status(201).json(ApiResponse.success("User created successfully.", newUser));

    } catch (error) {
        next(error);
    }
});

//* create new admin: POST /create-admin
router.post("/create-admin", verifyAdmin, createAdminValidator, validateRequest, async (req: RequestWithAdmin, res: Response, next: NextFunction) => {
    try {
        const { name, phone, password } = req.body;
        const admin = req.admin;

        if (!admin) {
            return next(new UnauthorizedErr("You are not authorized to perform this action."));
        }

        //* check if admin already exists
        const user = await AdminService.getAdminByPhone(phone);
        if (user) {
            return next(new BadRequestErr("Admin already exists.", ErrTypes.BAD_REQUEST));
        }

        //* create new admin
        const newAdmin = await AdminService.createAdmin({ name, phone, password }, admin._id);
        if (!newAdmin) {
            return next(new BadRequestErr("Failed to create new admin.", ErrTypes.SERVER_ERROR));
        }

        //* send success response
        res.status(201).json(ApiResponse.success("Admin created successfully.", newAdmin));

    } catch (error) {
        next(error);
    }
});

//* update transaction status: PATCH /transaction/status
router.patch("/transaction/status", verifyAdmin, updateTransactionValidator, validateRequest, async (req: RequestWithAdmin, res: Response, next: NextFunction) => {
    try {
        const { transactionId, status } = req.body;
        const admin = req.admin;

        if (!admin) {
            return next(new UnauthorizedErr("You are not authorized to perform this action."));
        }

        //* update transaction status
        const updatedTransaction = await TransactionService.updateTransactionStatus(transactionId, status as TransactionsStatus);
        if (!updatedTransaction) {
            return next(new NotFoundErr("Transaction not found."));
        }

        //* send success response
        res.status(200).json(ApiResponse.success("Transaction status updated successfully.", {
            transaction: updatedTransaction,
        }));

    } catch (error) {
        next(error);
    }
});

//* add transaction: POST /transaction/add/:userId
router.post("/transaction/add/:userId", verifyAdmin, addTransactionValidator, validateRequest, async (req: RequestWithAdmin, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        const { userId } = req.params;
        const admin = req.admin;

        if (!admin) {
            return next(new UnauthorizedErr("You are not authorized to perform this action."));
        }

        //* user
        const user = await UserService.getUserById(new Types.ObjectId(userId));
        if (!user) {
            return next(new NotFoundErr("User not found."));
        }

        if (!user.wallet) {
            return next(new BadRequestErr("User wallet not found.", ErrTypes.SERVER_ERROR));
        }

        //* create transaction
        const transaction = await TransactionService.createTransaction({
            amount: data.amount as number,
            description: data.description,
            label: data.label,
            type: data.type,
            createdBy: TransactionsCreatedBy.ADMIN,
            ref: admin._id,
            wallet: user.wallet!._id,
            status: TransactionsStatus.ACCEPTED
        });
        if (!transaction) {
            return next(new BadRequestErr("Failed to create transaction.", ErrTypes.SERVER_ERROR));
        }

        //* add transaction
        const wallet = await WalletService.addTransactionToWallet(user.wallet._id, transaction);
        if (!wallet) {
            return next(new BadRequestErr("Failed to add transaction.", ErrTypes.SERVER_ERROR));
        }

        //* send success response
        res.status(201).json(ApiResponse.success("Transaction added successfully.", {
            transaction,
            wallet
        }));

    } catch (error) {
        next(error);
    }
});

//* add transaction to multiple users: POST /transaction/add
router.post("/transaction/add", verifyAdmin, addTransactionToMultipleUsersValidator, validateRequest, async (req: RequestWithAdmin, res: Response, next: NextFunction) => {
    try {
        const { userIds, ...data } = req.body;

        const admin = req.admin;

        if (!admin) {
            return next(new UnauthorizedErr("You are not authorized to perform this action."));
        }

        //* remove duplicates from user ids
        const uniqueUserIds = Array.from(new Set(userIds)).map(id => new Types.ObjectId(id as string));

        //* create transaction
        await UserService.addTransactionToMultipleUsers(uniqueUserIds, data, admin._id);

        //* send success response
        res.status(201).json(ApiResponse.success("Transaction added successfully.", {}));
    } catch (error) {
        next(error);
    }
});

//* get a single user transactions: GET user/transactions
router.get("/user/transactions", verifyAdmin, async (req: RequestWithAdmin, res: Response, next: NextFunction) => {
    try {
        const admin = req.admin;
        const { id } = req.query;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        if (!admin) {
            return next(new UnauthorizedErr("You are not authorized to perform this action."));
        }

        //* get user
        const user = await UserService.getUserById(new Types.ObjectId(id as string));
        if (!user || !user.wallet) {
            return next(new NotFoundErr("User not found."));
        }
        if (!('transactions' in user.wallet!)) {
            return next(new BadRequestErr("Invalid wallet information.", ErrTypes.BAD_REQUEST));
        }

        //* get user transactions
        const transactions = await TransactionService.getTransactions(user.wallet.transactions as unknown as Types.ObjectId[], page, limit);

        //* pagination
        const total = user.wallet.transactions.length;
        const totalPages = Math.ceil(total / limit);
        const pagination = {
            page,
            limit,
            total,
            totalPages,
        }

        res.status(200).json(ApiResponse.success("Transactions fetched successfully.", {
            transactions,
            wallet: user.wallet,
            pagination,
        }));

    } catch (error) {
        next(error);
    }
});

//* remove transaction: DELETE /transaction/remove/:transactionId
router.delete("/transaction/remove/:transactionId", verifyAdmin, removeTransactionValidator, validateRequest, async (req: RequestWithAdmin, res: Response, next: NextFunction) => {
    try {
        const { transactionId } = req.params;
        const admin = req.admin;

        if (!admin) {
            return next(new UnauthorizedErr("You are not authorized to perform this action."));
        }

        //* remove transaction
        const { wallet, deletedTransaction } = await WalletService.removeTransactionFromWallet(new Types.ObjectId(transactionId));
        if (!deletedTransaction) {
            return next(new NotFoundErr("Transaction not found."));
        }

        //* send success response
        res.status(200).json(ApiResponse.success("Transaction deleted successfully.", {
            wallet,
            deletedTransaction
        }));

    } catch (error) {
        next(error);
    }
});

//* get all users: GET /users?page=1&limit=10?search=michael
router.get("/users", verifyAdmin, async (req: RequestWithAdmin, res: Response, next: NextFunction) => {
    try {
        const admin = req.admin;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string;

        if (!admin) {
            return next(new UnauthorizedErr("You are not authorized to perform this action."));
        }

        //* get all users
        const { users, total } = await UserService.getAllUsers(page, limit, search);

        //* pagination
        const totalPages = Math.ceil(total / limit);
        const pagination = {
            page,
            limit,
            total,
            totalPages,
        }

        //* send success response
        res.status(200).json(ApiResponse.success("Users fetched successfully.", {
            users,
            pagination
        }));

    } catch (error) {
        next(error);
    }
});

//* get user details by id: GET /user/:id
router.get("/user/:userId", verifyAdmin, getUsersDetailsForAdminValidator, validateRequest, async (req: RequestWithAdmin, res: Response, next: NextFunction) => {
    try {
        const admin = req.admin;
        const { userId } = req.params;

        if (!admin) {
            return next(new UnauthorizedErr("You are not authorized to perform this action."));
        }

        //* get user
        const user = await UserService.getUserById(new Types.ObjectId(userId));

        if (!user) {
            return next(new NotFoundErr("User not found."));
        }

        //* send success response
        res.status(200).json(ApiResponse.success("User fetched successfully.", {
            user
        }));

    } catch (error) {
        next(error);
    }
});

//* change user password: PATCH /user/change-password/:userId
router.patch("/user/change-password/:userId", verifyAdmin, changeUserPasswordByAdminValidator, validateRequest, async (req: RequestWithAdmin, res: Response, next: NextFunction) => {
    try {
        const admin = req.admin;
        const { userId } = req.params;
        const { password } = req.body;

        if (!admin) {
            return next(new UnauthorizedErr("You are not authorized to perform this action."));
        }

        //* change password
        const updatedUser = await UserService.changePasswordByAdmin(new Types.ObjectId(userId), password);
        if (!updatedUser) {
            return next(new NotFoundErr("User not found."));
        }

        //* send success response
        res.status(200).json(ApiResponse.success("Password changed successfully.", {}));
    } catch (error) {
        next(error);
    }
});

//* delete user account: DELETE /user/delete/:userId
router.delete("/user/delete/:userId", verifyAdmin, getUsersDetailsForAdminValidator, validateRequest, async (req: RequestWithAdmin, res: Response, next: NextFunction) => {
    try {
        const admin = req.admin;
        const { userId } = req.params;

        if (!admin) {
            return next(new UnauthorizedErr("You are not authorized to perform this action."));
        }

        //* delete user
        const deletedUser = await UserService.deleteUser(new Types.ObjectId(userId));
        if (!deletedUser) {
            return next(new NotFoundErr("User not found."));
        }

        //* send success response
        res.status(200).json(ApiResponse.success("User deleted successfully.", {}));
    } catch (error) {
        next(error);
    }
});

//* update user account: PATCH /user/update/:userId
router.patch("/user/update/:userId", verifyAdmin, updateUserByAdminValidator, validateRequest, async (req: RequestWithAdmin, res: Response, next: NextFunction) => {
    try {
        const admin = req.admin;
        const { userId } = req.params;
        const data = req.body;

        if (!admin) {
            return next(new UnauthorizedErr("You are not authorized to perform this action."));
        }

        //* update user
        const updatedUser = await UserService.updateUserByAdmin(new Types.ObjectId(userId), data);
        if (!updatedUser) {
            return next(new NotFoundErr("User not found."));
        }

        //* send success response
        res.status(200).json(ApiResponse.success("User updated successfully.", {
            user: updatedUser
        }));
    } catch (error) {
        next(error);
    }
});

//* change admin password: PATCH /change-password
router.patch("/change-password", verifyAdmin, async (req: RequestWithAdmin, res: Response, next: NextFunction) => {
    try {
        const admin = req.admin;
        const { oldPassword, newPassword } = req.body;

        if (!admin) {
            return next(new UnauthorizedErr("You are not authorized to perform this action."));
        }

        //* change password
        const updatedAdmin = await AdminService.changePassword(admin._id, oldPassword, newPassword);
        if (!updatedAdmin) {
            return next(new NotFoundErr("Admin not found."));
        }

        //* send success response
        res.status(200).json(ApiResponse.success("Password changed successfully.", {}));
    } catch (error) {
        next(error);
    }
});

//* get all notifications: GET /notifications
router.get("/notifications", verifyAdmin, async (req: RequestWithAdmin, res: Response, next: NextFunction) => {
    try {
        const admin = req.admin;
        const limit = parseInt(req.query.limit as string) || 100;

        if (!admin) {
            return next(new UnauthorizedErr("You are not authorized to perform this action."));
        }

        //* get notifications
        const notifications = await NotificationService.getNotifications(limit);

        //* send success response
        res.status(200).json(ApiResponse.success("Notifications fetched successfully.", {
            notifications
        }));

    } catch (error) {
        next(error);
    }
});

//* dashboard data: GET /dashboard
router.get("/dashboard", verifyAdmin, async (req: RequestWithAdmin, res: Response, next: NextFunction) => {
    try {
        const admin = req.admin;

        if (!admin) {
            return next(new UnauthorizedErr("You are not authorized to perform this action."));
        }

        //* get dashboard data
        const data = await DashboardService.getData();

        //* send success response
        res.status(200).json(ApiResponse.success("Dashboard data fetched successfully.", data));

    } catch (error) {
        next(error);
    }
});

export default router;