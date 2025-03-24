import { ROUTES } from "./routes";

export interface BreadcrumbData {
  label: string;
  path?: string; // Optional, for links
}

export const breadcrumbConfig: Record<string, BreadcrumbData[]> = {
  [ROUTES.ADMIN_DASHBOARD]: [{ label: "Dashboard" }],
  [ROUTES.ADMIN_USERS]: [
    { label: "Home", path: ROUTES.ADMIN_DASHBOARD },
    { label: "Users" },
  ],
  [ROUTES.ADMIN_CREATE_USER]: [
    { label: "Home", path: ROUTES.ADMIN_DASHBOARD },
    { label: "Users", path: ROUTES.ADMIN_USERS },
    { label: "Create User" },
  ],
  [ROUTES.ADMIN_USER_DETAILS()]: [
    { label: "Home", path: ROUTES.ADMIN_DASHBOARD },
    { label: "Users", path: ROUTES.ADMIN_USERS },
    { label: "User Detail" },
  ],
  [ROUTES.ADMIN_NOTIFICATION]: [
    { label: "Home", path: ROUTES.ADMIN_DASHBOARD },
    { label: "Notifications" },
  ],
  [ROUTES.ADMIN_WEBSITE]: [
    { label: "Home", path: ROUTES.ADMIN_DASHBOARD },
    { label: "Website Controler" },
  ],
  [ROUTES.ADMIN_WEBSITE_POSTERS]: [
    { label: "Home", path: ROUTES.ADMIN_DASHBOARD },
    { label: "Website Controler", path: ROUTES.ADMIN_WEBSITE },
    { label: "Posters" },
  ],
  [ROUTES.ADMIN_WEBSITE_TOP_DESTINATION]: [
    { label: "Home", path: ROUTES.ADMIN_DASHBOARD },
    { label: "Website Controler", path: ROUTES.ADMIN_WEBSITE },
    { label: "Top Destination" },
  ],
  [ROUTES.ADMIN_SETTINGS]: [
    { label: "Home", path: ROUTES.ADMIN_DASHBOARD },
    { label: "Settings" },
  ],
};
