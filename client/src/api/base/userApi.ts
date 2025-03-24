import { API_ROUTES } from "@/config/apiRoutes";
import axiosClient from "@/api/axios/axiosClient";
import { catchApiErr } from "@/api/features/catchApiErr";

export const getTransactions = async (
  queryParams: typeof API_ROUTES.GET_TRANSACTIONS.queryParams
) => {
  try {
    const res = await axiosClient.get(API_ROUTES.GET_TRANSACTIONS.path, {
      params: queryParams,
    });
    return res.data;
  } catch (error) {
    catchApiErr(error);
  }
};

export const requestWithdrawal = async (
  data: typeof API_ROUTES.REQUEST_WITHDRAWAL.data
) => {
  try {
    const res = await axiosClient.post(
      API_ROUTES.REQUEST_WITHDRAWAL.path,
      data
    );
    return res.data;
  } catch (error) {
    catchApiErr(error);
  }
};
