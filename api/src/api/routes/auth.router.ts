import { Router, Request, Response, NextFunction } from "express";

import { ErrTypes, RequestWithAdmin, RequestWithUser } from "../../types";
import { verifyAdmin } from "../middlewares/verifyAdmin";
import { validateRequest } from "../middlewares";
import { BadRequestErr, getMilliseconds, UnauthorizedErr } from "../../utils";
import { ApiResponse } from "../../utils/apiResponse";
import { loginValidator } from "../middlewares/validation/auth.validation";
import { AdminAuthService, UserAuthService } from "../../services/auth.service";
import { CONSTANTS } from "../../config/constants";
import { verifyUser } from "../middlewares/verifyUser";

const router = Router();

//* user login: POST /login/user
router.post("/login/user", loginValidator, validateRequest, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { phone, password } = req.body;

        const user = await UserAuthService.login({ phone, password });
        if (!user) {
            return next(new BadRequestErr('Phone number not in system.', ErrTypes.SERVER_ERROR));
        }

        const authToken = UserAuthService.getToken(user);
        //* calculate cookie max age
        const cookieMaxAge = getMilliseconds(process.env.JWT_EXPIRES_IN_USER as `${number}h` | `${number}m` | `${number}d` | `${number}s`);

        //* send success response
        res.status(200)
            .cookie(CONSTANTS.TOKEN_NAME, authToken, { httpOnly: true, maxAge: cookieMaxAge, sameSite: "strict" })
            .json(ApiResponse.success("User login successfully.", {
                user
            }));

    } catch (error) {
        next(error);
    }
});

//* user logout: POST /logout/user
router.post("/logout/user", verifyUser, async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {

        //* clear cookie
        res.clearCookie(CONSTANTS.TOKEN_NAME);

        //* send success response
        res.status(200).json(ApiResponse.success("User logout successfully.", req.user!));

    } catch (error) {
        next(error);
    }
});

//* user verify: POST /verify/user
router.post("/verify/user", verifyUser, async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {

        const user = req.user;
        if (!user) {
            return next(new UnauthorizedErr("Unauthorized, please login."));
        }

        //* send success response
        res.status(200).json(ApiResponse.success("User verified successfully.", {
            user,
            verify: true
        }));

    } catch (error) {
        next(error);
    }
});

//* admin login: POST /login/admin
router.post("/login/admin", loginValidator, validateRequest, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { phone, password } = req.body;

        const admin = await AdminAuthService.login({ phone, password });
        if (!admin) {
            return next(new BadRequestErr('Phone number not found.', ErrTypes.SERVER_ERROR));
        }

        const authToken = AdminAuthService.getToken(admin);
        //* calculate cookie max age
        const cookieMaxAge = getMilliseconds(process.env.JWT_EXPIRES_IN_ADMIN as `${number}h` | `${number}m` | `${number}d` | `${number}s`);
        //* send success response
        res.status(200)
            .cookie(CONSTANTS.TOKEN_NAME, authToken, { httpOnly: true, maxAge: cookieMaxAge })
            .json(ApiResponse.success("Admin login successfully.", {
                admin
            }));

    } catch (error) {
        next(error);
    }
});

//* admin verify: POST /verify/admin
router.post("/verify/admin", verifyAdmin, async (req: RequestWithAdmin, res: Response, next: NextFunction) => {
    try {

        const admin = req.admin;
        if (!admin) {
            return next(new UnauthorizedErr("Unauthorized, please login."));
        }

        //* send success response
        res.status(200).json(ApiResponse.success("Admin verified successfully.", {
            admin
        }));

    } catch (error) {
        next(error);
    }
});

//* admin logout: POST /logout/admin
router.post("/logout/admin", verifyAdmin, async (req: RequestWithAdmin, res: Response, next: NextFunction) => {
    try {
        //* clear cookie
        res.clearCookie(CONSTANTS.TOKEN_NAME);

        //* send success response
        res.status(200).json(ApiResponse.success("Admin logout successfully.", req.admin!));

    } catch (error) {
        next(error);
    }
});

export default router;

//TODO: when the user login res send, there is a _id and id field. Remove the id field from the response.