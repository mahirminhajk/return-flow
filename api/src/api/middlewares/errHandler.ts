import { Request, Response, NextFunction } from "express";

import { BaseErr } from "../../utils";

export const errHandler = (
    err: BaseErr,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (process.env.NODE_ENV === 'dev') console.log('❌ ' + err || "Something went wrong");

    if (res.headersSent) {
        console.error("⚠️ Headers already sent. Skipping error handler.", err);
        return;
    }

    if (err instanceof BaseErr) {
        return res.status(err.code).json(err.serializeErr());
    }

    res.status(500).json({
        message: "Something went wrong",
        type: "SERVER_ERROR",
    });
};

