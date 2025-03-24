import { useQuery, useMutation } from "@tanstack/react-query";
import {
  adminAddTransactionToUsers,
  adminChangePassword,
  adminChangeUserPassword,
  adminCreateUser,
  adminDeleteUser,
  adminGetAllPosters,
  adminGetAllUsers,
  adminGetDashboardData,
  adminGetNotifications,
  adminGetTopDestinations,
  adminGetTransactionsOfAUser,
  adminGetUserDetails,
  adminUpdateTransactionStatus,
  adminUpdateUser,
} from "../base/adminApi";
import { API_ROUTES } from "@/config/apiRoutes";
import { queryClient } from "@/main";

export const useAdminCreateUser = () => {
  return useMutation({
    mutationFn: adminCreateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "users",
          {
            limit: "10",
            page: "1",
            search: "",
          },
        ],
        refetchType: "all",
      });
    },
  });
};

export const useAdminGetAllUsers = (
  queryParams: typeof API_ROUTES.ADMIN_GET_ALL_USERS.queryParams
) => {
  return useQuery({
    queryKey: ["users", queryParams],
    queryFn: () => adminGetAllUsers(queryParams),
    enabled: !!queryParams.page, // Only fetch data if page is provided
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useAdminGetUserDetails = (
  params: typeof API_ROUTES.ADMIN_GET_USER_DETAILS.params
) => {
  return useQuery({
    queryKey: ["user", params],
    queryFn: () => adminGetUserDetails(params),
    enabled: !!params.id, // Only fetch data if id is provided
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useAdminChangeUserPassword = (
  param: typeof API_ROUTES.ADMIN_CHANGE_USER_PASSWORD.params
) => {
  return useMutation({
    mutationFn: (data: typeof API_ROUTES.ADMIN_CHANGE_USER_PASSWORD.data) =>
      adminChangeUserPassword(param, data),
  });
};

export const useAdminUpdateUser = (
  param: typeof API_ROUTES.ADMIN_UPDATE_USER.params
) => {
  return useMutation({
    mutationFn: (data: typeof API_ROUTES.ADMIN_UPDATE_USER.data) =>
      adminUpdateUser(param, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "users",
          {
            limit: "10",
            page: "1",
            search: "",
          },
        ],
        refetchType: "all",
      });
    },
  });
};

export const useAdminDeleteUser = () => {
  return useMutation({
    mutationFn: adminDeleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "users",
          {
            limit: "10",
            page: "1",
            search: "",
          },
        ],
        refetchType: "all",
      });
    },
  });
};

export const useAdminAddTransactionToUsers = () => {
  return useMutation({
    mutationFn: adminAddTransactionToUsers,
  });
};

export const useAdminUpdateTransactionStatus = () => {
  return useMutation({
    mutationFn: adminUpdateTransactionStatus,
  });
};

export const useAdminGetTransactionsOfAUser = (
  params: typeof API_ROUTES.ADMIN_GET_SINGLE_USER_TRANSACTIONS.queryParams
) => {
  return useQuery({
    queryKey: ["user-transaction", params],
    queryFn: () => adminGetTransactionsOfAUser(params),
    enabled: !!params.page, // Only fetch data if page is provided
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useAdminChangePassword = () => {
  return useMutation({
    mutationFn: adminChangePassword,
  });
};

export const useAdminGetNotifications = (
  queryParams: typeof API_ROUTES.ADMIN_GET_NOTIFICATIONS.queryParams
) => {
  return useQuery({
    queryKey: ["notifications", queryParams],
    queryFn: () => adminGetNotifications(queryParams),
    refetchInterval: 1000 * 30, // 5 minutes
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });
};

export const useAdminGetAllPosters = () => {
  return useQuery({
    queryKey: ["posters"],
    queryFn: adminGetAllPosters,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useAdminGetAllTopDestinations = () => {
  return useQuery({
    queryKey: ["top-destinations"],
    queryFn: adminGetTopDestinations,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useAdminGetDashboardData = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: adminGetDashboardData,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};
