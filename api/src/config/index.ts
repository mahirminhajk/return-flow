import { connectDatabase } from "./database/database";
import initCronJobs from "./corn-jobs";
import { initialAdmin } from "./initialAdmin/initialAdmin";

export const serverSetup = async () => {
    try {
        await connectDatabase();
        initCronJobs();
        await initialAdmin();
        console.log("✅ Server setup is successful");
    } catch (error) {
        throw console.log('🟥 Error in server setup', error);
    }
};