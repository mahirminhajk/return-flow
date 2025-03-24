export const ROUTES = {
  MAIN: "/",

  ADMIN_LOGIN: "/admin/login",
  ADMIN_DASHBOARD: "/",
  ADMIN_NOTIFICATION: "/admin/notification",
  ADMIN_WEBSITE: "/admin/website",
  ADMIN_WEBSITE_POSTERS: "/admin/website/posters",
  ADMIN_WEBSITE_TOP_DESTINATION: "/admin/website/top-destination",
  ADMIN_USERS: "/admin/users",
  ADMIN_CREATE_USER: "/admin/users/create",
  ADMIN_SETTINGS: "/admin/settings",
  ADMIN_USER_DETAILS: (id = ":id") => `/admin/users/${id}`,

  LOGIN: "/login",
  DASHBOARD: "/",
  WALLET: "/wallet",
  PROFILE: "/profile",
  REQUEST_WITHDRAWAL: "/wallet/request-withdrawal",
};
