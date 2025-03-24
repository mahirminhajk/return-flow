import 'dotenv/config';
import app from "./api/app"
import { serverSetup } from "./config";

const PORT = 8080;

const main = async () => {
    //* env variable check
    if (!process.env.NODE_ENV) throw new Error('NODE_ENV is not defined');
    if (!process.env.CLIENT_URL) throw new Error('CLIENT_URL is not defined');
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI is not defined');
    if (!process.env.JWT_SECRET_ADMIN) throw new Error('JWT_SECRET_ADMIN is not defined');
    if (!process.env.JWT_EXPIRES_IN_ADMIN) throw new Error('JWT_EXPIRES_IN_ADMIN is not defined');
    if (!process.env.JWT_SECRET_USER) throw new Error('JWT_SECRET_USER is not defined');
    if (!process.env.JWT_EXPIRES_IN_USER) throw new Error('JWT_EXPIRES_IN_USER is not defined');

    //* server setup
    await serverSetup();

    app.listen(PORT, () => {
        console.log('🟩 Server is running on port', PORT);
    });
};

main();
