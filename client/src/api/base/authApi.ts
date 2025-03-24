import { API_ROUTES } from "@/config/apiRoutes";
import axiosClient from "@/api/axios/axiosClient";
import { catchApiErr } from "@/api/features/catchApiErr";

export const login = async (data: typeof API_ROUTES.LOGIN.data) => {
  try {
    const res = await axiosClient.post(API_ROUTES.LOGIN.path, data);
    return res.data;
  } catch (error) {
    catchApiErr(error);
  }
};

export const adminLogin = async (data: typeof API_ROUTES.ADMIN_LOGIN.data) => {
  try {
    const res = await axiosClient.post(API_ROUTES.ADMIN_LOGIN.path, data);
    return res.data;
  } catch (error) {
    catchApiErr(error);
  }
};

export const logout = async (data: typeof API_ROUTES.LOGOUT.data) => {
  try {
    const res = await axiosClient.post(API_ROUTES.LOGOUT.path, data);
    return res.data;
  } catch (error) {
    catchApiErr(error);
  }
};

export const adminLogout = async (
  data: typeof API_ROUTES.ADMIN_LOGOUT.data
) => {
  try {
    const res = await axiosClient.post(API_ROUTES.ADMIN_LOGOUT.path, data);
    return res.data;
  } catch (error) {
    catchApiErr(error);
  }
};
