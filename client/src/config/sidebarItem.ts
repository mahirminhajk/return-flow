import {
  BellRingIcon,
  LucideLayoutDashboard,
  SettingsIcon as Settings,
  UserIcon as User,
} from "lucide-react";
import { ROUTES } from "./routes";

export const sideItems = [
  {
    title: "Dashboard",
    url: ROUTES.ADMIN_DASHBOARD,
    icon: LucideLayoutDashboard,
  },
  {
    title: "Users",
    url: ROUTES.ADMIN_USERS,
    icon: User,
  },
  {
    title: "Notification",
    url: ROUTES.ADMIN_NOTIFICATION,
    icon: BellRingIcon,
  },
  {
    title: "Settings",
    url: ROUTES.ADMIN_SETTINGS,
    icon: Settings,
  },
];
