import { Router } from "express";

import adminRouter from "./admin.router";
import authRouter from "./auth.router";
import userRouter from "./user.router";

const combinedRouter = Router();

combinedRouter.use("/auth", authRouter);
combinedRouter.use("/admin", adminRouter);
combinedRouter.use("/user", userRouter);

export default combinedRouter;