import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

import { RequestValidationErr } from "../../utils";

export const validateRequest = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const firstError = errors.array()[0];
        if (firstError) {
            if (firstError.type === "field") return next(new RequestValidationErr(firstError.msg, firstError.path));
        }
        return next(new RequestValidationErr("Validation failed", "unknown"));

    }

    next();
};