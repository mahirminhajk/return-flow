import { Response, NextFunction, RequestHandler } from "express";
import { CONSTANTS } from "../../config/constants";
import { UnauthorizedErr } from "../../utils";
import { IAdmin } from "../../types/models";
import { Types } from "mongoose";
import { RequestWithAdmin } from "../../types";
import { AdminAuthService } from "../../services/auth.service";

export const verifyAdmin: RequestHandler = async (req: RequestWithAdmin, res: Response, next: NextFunction) => {
    const token = req.cookies[CONSTANTS.TOKEN_NAME];

    if (!token) {
        return next(new UnauthorizedErr("Unauthorized, please login."));
    }

    try {
        const user = await AdminAuthService.verifyUser(token);

        if (user) {
            req.admin = user as IAdmin & { _id: Types.ObjectId; };
            next();
        } else {
            return next(new UnauthorizedErr("Unauthorized, please login."));
        }
    } catch (error) {
        return next(new UnauthorizedErr("Unauthorized, please login."));
    }
};