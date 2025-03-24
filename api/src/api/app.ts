import express, { ErrorRequestHandler } from 'express';
import cookieParser from "cookie-parser";
import cors from "cors";

import combinedRouter from "./routes";
import { errHandler } from "./middlewares";

const app = express();

//* middleware
app.use(cors({
    origin: true,
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'dev') {
    //* only dev middlewares   
    app.use(require('morgan')('dev'));
};

//* app routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});
app.use('/api/v1', combinedRouter);

//* not found route
app.use((req, res, next) => {
    const data = {
        message: "Not found",
        status: 404,
        path: req.originalUrl,
        method: req.method,
    }
    console.log("⚠️ Router Not found", data);

    res.status(404)
        .json(data);
});

//* error handler
app.use(errHandler as ErrorRequestHandler);

export default app;