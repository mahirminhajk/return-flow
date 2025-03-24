import { Response, NextFunction, RequestHandler } from "express";
import { CONSTANTS } from "../../config/constants";
import { UnauthorizedErr } from "../../utils";
import { RequestWithUser } from "../../types";
import { UserAuthService } from "../../services/auth.service";
import { IUserDocument } from "../../models/User";

export const verifyUser: RequestHandler = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const token = req.cookies[CONSTANTS.TOKEN_NAME];

    if (!token) {
        return next(new UnauthorizedErr("Unauthorized, please login."));
    }

    try {

        const user = await UserAuthService.verifyUser(token) as IUserDocument;

        if (user) {
            req.user = user;
            next();
        } else {
            return next(new UnauthorizedErr("Unauthorized, please login."));
        }
    } catch (error) {
        return next(new UnauthorizedErr("Unauthorized, please login."));
    }
};