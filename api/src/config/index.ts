import { connectDatabase } from "./database/database";
import initCronJobs from "./corn-jobs";

export const serverSetup = async () => {
    try {
        await connectDatabase();
        initCronJobs();
        console.log("✅ Server setup is successful");
    } catch (error) {
        throw console.log('🟥 Error in server setup', error);
    }
};