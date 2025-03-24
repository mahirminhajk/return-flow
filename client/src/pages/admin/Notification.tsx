import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAdminGetNotifications } from "@/api/apiHooks/adminApiHooks";
import { Skeleton } from "@/components/ui/skeleton"; // For loading state
import { NOTIFICATION_ITEMS_PER_PAGE } from "@/config";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/routes";

// Define the Notification type
interface Notification {
  title: string;
  message: string;
  userId: string;
  createdAt: string; // ISO date string
}

// Group notifications by date
const groupNotificationsByDate = (
  notifications: Notification[]
): Record<string, Notification[]> => {
  return notifications.reduce((acc, notification) => {
    const date = new Date(notification.createdAt).toLocaleDateString("en-GB"); // Convert to local date string
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(notification);
    return acc;
  }, {} as Record<string, Notification[]>);
};

function Notification() {
  const navigate = useNavigate();

  const { data, isLoading } = useAdminGetNotifications({
    limit: NOTIFICATION_ITEMS_PER_PAGE.toString(),
  });

  // Extract notifications from the API response
  const notifications = data?.data.notifications || [];

  // Group notifications by date
  const groupedNotifications = groupNotificationsByDate(notifications);

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Notifications</h1>
        {[...Array(3)].map((_, index) => (
          <div key={index} className="mb-6">
            <Skeleton className="h-6 w-24 mb-3" /> {/* Date skeleton */}
            {[...Array(2)].map((_, i) => (
              <Card key={i} className="mb-3">
                <CardHeader className="p-3">
                  <Skeleton className="h-5 w-3/4" /> {/* Title skeleton */}
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <Skeleton className="h-4 w-full" /> {/* Message skeleton */}
                </CardContent>
              </Card>
            ))}
          </div>
        ))}
      </div>
    );
  }

  // Zero notifications state
  if (notifications.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Notifications</h1>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">No notifications found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      {Object.entries(groupedNotifications).map(([date, notifications]) => (
        <div key={date} className="mb-6">
          {/* Date Heading */}
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="text-sm font-medium">
              {date}
            </Badge>
            <Separator className="flex-1" />
          </div>

          {/* Notification List */}
          {notifications.map((notification, index) => (
            <Card
              key={index}
              className="mb-3 cursor-pointer"
              onClick={() =>
                navigate(ROUTES.ADMIN_USER_DETAILS(notification.userId))
              }
            >
              <CardHeader className="p-3">
                <CardTitle className="text-base">
                  {notification.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <p className="text-sm text-gray-600">{notification.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Notification;
