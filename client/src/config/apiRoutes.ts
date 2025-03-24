export type ApiRoute = {
  path: string; // API endpoint
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"; // HTTP method
  data?: unknown; // Data type of the request
  queryParams?: Record<string, string | number | boolean>; // Query parameters
  params?: Record<string, string | number | boolean>; // Path parameters
};

export const API_ROUTES = {
  LOGIN: {
    path: "/auth/login/user",
    method: "POST",
    data: {
      phone: "string",
      password: "string",
    },
  },
  LOGOUT: {
    path: "/auth/logout/user",
    method: "POST",
    data: {
      phone: "string",
    },
  },
  GET_TRANSACTIONS: {
    path: "/user/wallet/transactions",
    method: "GET",
    queryParams: {
      page: "string",
      limit: "string",
    },
  },
  REQUEST_WITHDRAWAL: {
    path: "/user/wallet/request-withdraw",
    method: "POST",
    data: {
      amount: "number",
      description: "string",
    },
  },

  ADMIN_LOGIN: {
    path: "/auth/login/admin",
    method: "POST",
    data: {
      phone: "string",
      password: "string",
    },
  },
  ADMIN_CREATE_USER: {
    path: "/admin/create-user",
    method: "POST",
    data: {
      name: "string",
      phone: "string",
      password: "string",
      invested: "number",
      returnAmount: "number",
      investedDate: "string",
    },
  },
  ADMIN_GET_ALL_USERS: {
    path: "/admin/users",
    method: "GET",
    queryParams: {
      page: "string",
      limit: "string",
      search: "string",
    },
  },
  ADMIN_GET_USER_DETAILS: {
    path: (id = ":id") => `/admin/user/${id}`,
    method: "GET",
    params: {
      id: "string",
    },
  },
  ADMIN_CHANGE_USER_PASSWORD: {
    path: (id = ":id") => `/admin/user/change-password/${id}`,
    method: "PATCH",
    params: {
      id: "string",
    },
    data: {
      password: "string",
    },
  },
  ADMIN_UPDATE_USER: {
    path: (id = ":id") => `/admin/user/update/${id}`,
    method: "PATCH",
    params: {
      id: "string",
    },
    data: {
      name: "string",
      phone: "string",
      invested: "number",
      returnAmount: "number",
      investedDate: "string",
    },
  },
  ADMIN_DELETE_USER: {
    path: (id = ":id") => `/admin/user/delete/${id}`,
    method: "DELETE",
    params: {
      id: "string",
    },
  },
  ADMIN_ADD_TRANSACTION_TO_USERS: {
    path: "/admin/transaction/add",
    method: "POST",
    data: {
      userIds: [] as string[],
      type: "string",
      label: "string",
      amount: "number",
      description: "string",
    },
  },
  ADMIN_UPDATE_TRANSACTION_STATUS: {
    path: "/admin/transaction/status",
    method: "PATCH",
    data: {
      transactionId: "string",
      status: "string",
    },
  },
  ADMIN_GET_SINGLE_USER_TRANSACTIONS: {
    path: "/admin/user/transactions",
    method: "GET",
    queryParams: {
      id: "string",
      page: "string",
      limit: "string",
    },
  },
  ADMIN_LOGOUT: {
    path: "/auth/logout/admin",
    method: "POST",
    data: {
      phone: "string",
    },
  },
  ADMIN_CHANGE_PASSWORD: {
    path: "/admin/change-password",
    method: "PATCH",
    data: {
      oldPassword: "string",
      newPassword: "string",
    },
  },
  ADMIN_GET_NOTIFICATIONS: {
    path: "/admin/notifications",
    method: "GET",
    queryParams: {
      limit: "string",
    },
  },
  ADMIN_GET_ALL_POSTERS: {
    path: "wm/posters",
    method: "GET",
  },
  ADMIN_GET_TOP_DESTINATIONS: {
    path: "wm/top-destinations",
    method: "GET",
  },
  ADMIN_GET_DASHBOARD_DATA: {
    path: "/admin/dashboard",
    method: "GET",
  },
};

export type ApiRoutesKey = keyof typeof API_ROUTES;
export type ApiRouteDetails<K extends ApiRoutesKey> = (typeof API_ROUTES)[K];
