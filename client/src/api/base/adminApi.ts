import { API_ROUTES } from "@/config/apiRoutes";
import axiosClient from "../axios/axiosClient";
import { catchApiErr } from "@/api/features/catchApiErr";

export const adminCreateUser = async (
  data: typeof API_ROUTES.ADMIN_CREATE_USER.data
) => {
  try {
    const res = await axiosClient.post(API_ROUTES.ADMIN_CREATE_USER.path, data);
    return res.data;
  } catch (error) {
    catchApiErr(error);
  }
};

export const adminGetAllUsers = async (
  queryParams: typeof API_ROUTES.ADMIN_GET_ALL_USERS.queryParams
) => {
  try {
    const res = await axiosClient.get(API_ROUTES.ADMIN_GET_ALL_USERS.path, {
      params: queryParams,
    });
    return res.data;
  } catch (error) {
    catchApiErr(error);
  }
};

export const adminGetUserDetails = async (
  params: typeof API_ROUTES.ADMIN_GET_USER_DETAILS.params
) => {
  try {
    const res = await axiosClient.get(
      API_ROUTES.ADMIN_GET_USER_DETAILS.path(params.id)
    );
    return res.data;
  } catch (error) {
    catchApiErr(error);
  }
};

export const adminChangeUserPassword = async (
  params: typeof API_ROUTES.ADMIN_CHANGE_USER_PASSWORD.params,
  data: typeof API_ROUTES.ADMIN_CHANGE_USER_PASSWORD.data
) => {
  try {
    const res = await axiosClient.patch(
      API_ROUTES.ADMIN_CHANGE_USER_PASSWORD.path(params.id),
      data
    );
    return res.data;
  } catch (error) {
    catchApiErr(error);
  }
};

export const adminUpdateUser = async (
  params: typeof API_ROUTES.ADMIN_UPDATE_USER.params,
  data: typeof API_ROUTES.ADMIN_UPDATE_USER.data
) => {
  try {
    const res = await axiosClient.patch(
      API_ROUTES.ADMIN_UPDATE_USER.path(params.id),
      data
    );
    return res.data;
  } catch (error) {
    catchApiErr(error);
  }
};

export const adminDeleteUser = async (
  params: typeof API_ROUTES.ADMIN_DELETE_USER.params
) => {
  try {
    const res = await axiosClient.delete(
      API_ROUTES.ADMIN_DELETE_USER.path(params.id)
    );
    return res.data;
  } catch (error) {
    catchApiErr(error);
  }
};

export const adminAddTransactionToUsers = async (
  data: typeof API_ROUTES.ADMIN_ADD_TRANSACTION_TO_USERS.data
) => {
  try {
    const res = await axiosClient.post(
      API_ROUTES.ADMIN_ADD_TRANSACTION_TO_USERS.path,
      data
    );
    return res.data;
  } catch (error) {
    catchApiErr(error);
  }
};

export const adminUpdateTransactionStatus = async (
  data: typeof API_ROUTES.ADMIN_UPDATE_TRANSACTION_STATUS.data
) => {
  try {
    const res = await axiosClient.patch(
      API_ROUTES.ADMIN_UPDATE_TRANSACTION_STATUS.path,
      data
    );
    return res.data;
  } catch (error) {
    catchApiErr(error);
  }
};

export const adminGetTransactionsOfAUser = async (
  queryParams: typeof API_ROUTES.ADMIN_GET_SINGLE_USER_TRANSACTIONS.queryParams
) => {
  try {
    const res = await axiosClient.get(
      API_ROUTES.ADMIN_GET_SINGLE_USER_TRANSACTIONS.path,
      {
        params: queryParams,
      }
    );
    return res.data;
  } catch (error) {
    catchApiErr(error);
  }
};

export const adminChangePassword = async (
  data: typeof API_ROUTES.ADMIN_CHANGE_PASSWORD.data
) => {
  try {
    const res = await axiosClient.patch(
      API_ROUTES.ADMIN_CHANGE_PASSWORD.path,
      data
    );
    return res.data;
  } catch (error) {
    catchApiErr(error);
  }
};

export const adminGetNotifications = async (
  queryParams: typeof API_ROUTES.ADMIN_GET_NOTIFICATIONS.queryParams
) => {
  try {
    const res = await axiosClient.get(API_ROUTES.ADMIN_GET_NOTIFICATIONS.path, {
      params: queryParams,
    });
    return res.data;
  } catch (error) {
    catchApiErr(error);
  }
};

export const adminGetAllPosters = async () => {
  try {
    const res = await axiosClient.get(API_ROUTES.ADMIN_GET_ALL_POSTERS.path);
    return res.data;
  } catch (error) {
    catchApiErr(error);
  }
};

export const adminGetTopDestinations = async () => {
  try {
    const res = await axiosClient.get(
      API_ROUTES.ADMIN_GET_TOP_DESTINATIONS.path
    );
    return res.data;
  } catch (error) {
    catchApiErr(error);
  }
};

export const adminGetDashboardData = async () => {
  try {
    const res = await axiosClient.get(API_ROUTES.ADMIN_GET_DASHBOARD_DATA.path);
    return res.data;
  } catch (error) {
    catchApiErr(error);
  }
};
