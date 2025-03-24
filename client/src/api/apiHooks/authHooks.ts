import { useMutation } from "@tanstack/react-query";

import { adminLogin, adminLogout, login, logout } from "../base/authApi";

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
  });
};

// export const useVerifyUser = () => {
//   return useMutation({
//     mutationFn: verifyUser,
//   });
// };

export const useLogout = () => {
  return useMutation({
    mutationFn: logout,
  });
};

export const useAdminLogin = () => {
  return useMutation({
    mutationFn: adminLogin,
  });
};

export const useAdminLogout = () => {
  return useMutation({
    mutationFn: adminLogout,
  });
};
