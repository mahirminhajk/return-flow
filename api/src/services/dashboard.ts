import { User } from "../models/User";
import { Transaction } from "../models/Transactions";
import { format, subMonths } from "date-fns";


export class DashboardService {
    static async getData() {
        const totalUsers = await User.countDocuments();
        const totalTransactions = await Transaction.countDocuments();

        const lastSixMonths = Array.from({ length: 6 }, (_, i) => {
            const date = subMonths(new Date(), i);
            return {
                month: format(date, "MMMM"),
                year: format(date, "yyyy"),
            };
        }).reverse();

        const userStats = await Promise.all(
            lastSixMonths.map(async ({ month, year }) => {
                const startDate = new Date(`${year}-${month}-01`);
                const endDate = new Date(startDate);
                endDate.setMonth(endDate.getMonth() + 1);

                const count = await User.countDocuments({
                    createdAt: {
                        $gte: startDate,
                        $lt: endDate,
                    },
                });
                return { month, desktop: count };
            })
        );

        const transactionStats = await Promise.all(
            lastSixMonths.map(async ({ month, year }) => {
                const startDate = new Date(`${year}-${month}-01`);
                const endDate = new Date(startDate);
                endDate.setMonth(endDate.getMonth() + 1);

                const count = await Transaction.countDocuments({
                    createdAt: {
                        $gte: startDate,
                        $lt: endDate,
                    },
                });
                return { month, desktop: count };
            })
        );

        return {
            totalUsers,
            totalTransactions,
            userStats,
            transactionStats,
        };
    }
};

