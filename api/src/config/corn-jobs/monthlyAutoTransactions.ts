import cron from "node-cron";
import { User } from "../../models/User";
import { TransactionService } from "../../services/transactions.service";
import { WalletService } from "../../services/wallet.service";

const runDailyAutoTransactions = async () => {
    console.log("🟩 Daily Auto Transactions start at " + new Date().toISOString());

    const today = new Date();
    const todayDate = today.getUTCDate(); // ✅ Fix: Get day in UTC

    console.log("🛠 Extracted Day (UTC):", todayDate);

    const users = await User.find({
        $expr: { $eq: [{ $dayOfMonth: "$investedDate" }, todayDate] }
    });

    for (const user of users) {
        console.log("✅ Processing user:", user.name, "| Invested Date:", user.investedDate);

        if (new Date(user.investedDate) <= today && user.wallet) {
            const transaction = await TransactionService.createReturnTransaction(user.wallet._id, user.returnAmount);

            if (transaction) {
                await WalletService.addTransactionToWallet(user.wallet._id, transaction);
                console.log("✅ Transaction created for", user.name);
            }
        } else {
            console.log("❌ Future investment date, skipping:", user.name);
        }
    }

    console.log("🟥 Daily Auto Transactions end at " + new Date().toISOString());
};


// const dailyAutoTransactions = () => {
//     cron.schedule("5 0 * * *", async () => { // Runs daily at midnight
//         await runDailyAutoTransactions();
//     });
// };

const dailyAutoTransactions = () => {
    cron.schedule("5 0 * * *", async () => {
        console.log("🚀 Cron Job Running...");
        await runDailyAutoTransactions();
    }, {
        scheduled: true,
        timezone: "UTC"  // Ensures it runs at the correct UTC time
    });
};

export default dailyAutoTransactions;
