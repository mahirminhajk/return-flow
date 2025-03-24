import { Notification } from "../models/Notification";

export class NotificationService {
    static async createNotification(notification: any) {
        return Notification.create(notification);
    }

    //* factory method
    static async createNotificationForWithdrawalRequest(
        userId: string,
        amount: number,
        name: string,
    ) {
        return this.createNotification({
            title: `Withdrawal Request from ${name}`,
            message: `A withdrawal request of ₹${amount} has been made by ${name}.`,
            type: "withdrawal_request",
            userId,
        });
    }

    static async getNotifications(limit: number) {
        //* sort by createdAt in descending order
        return Notification.find().sort({ createdAt: -1 }).limit(limit);
    };

}