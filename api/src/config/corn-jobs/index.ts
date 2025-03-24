import monthlyAutoTransactions from "./monthlyAutoTransactions";

const initCronJobs = () => {
    monthlyAutoTransactions();
    console.log("🟩 Cron Jobs Initialized");
};

export default initCronJobs;