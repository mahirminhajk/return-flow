import { Router, Request, Response, NextFunction } from "express";
import { verifyUser } from "../middlewares/verifyUser";
import { ErrTypes, RequestWithUser } from "../../types";
import { withdrawRequestValidator } from "../middlewares/validation/user.validation";
import { validateRequest } from "../middlewares";
import { BadRequestErr, UnauthorizedErr } from "../../utils";
import { ApiResponse } from "../../utils/apiResponse";
import { UserService } from "../../services/user.service";
import { TransactionService } from "../../services/transactions.service";
import { Types } from "mongoose";
import { NotificationService } from "../../services/notification.service";

const router = Router();

//* request withdraw: POST /wallet/request-withdraw
router.post("/wallet/request-withdraw", verifyUser, withdrawRequestValidator, validateRequest, async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const { amount, description } = req.body;

        const user = req.user;
        if (!user) return next(new UnauthorizedErr("Unauthorized, please login."));

        //* logic to request withdraw
        const { newWallet, requestTransaction } = await UserService.requestWithdraw(user, amount, description);

        res.status(200).json(ApiResponse.success("Withdraw request submitted successfully.", {
            wallet: newWallet,
            transaction: requestTransaction,
        }));

        //* create notification for admin
        await NotificationService.createNotificationForWithdrawalRequest(user._id as unknown as string, amount, user.name);
    } catch (error) {
        next(error);
    }
});

//* get transactions: GET /wallet/transactions?page=1&limit=10 
router.get("/wallet/transactions", verifyUser, async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        if (!user) return next(new UnauthorizedErr("Unauthorized, please login."));

        if (!('transactions' in user.wallet!)) {
            return next(new BadRequestErr("Invalid wallet information.", ErrTypes.BAD_REQUEST));
        }
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

export default router;