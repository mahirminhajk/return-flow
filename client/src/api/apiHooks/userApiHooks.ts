import { useQuery, useMutation } from "@tanstack/react-query";
import { getTransactions, requestWithdrawal } from "../base/userApi";
import { API_ROUTES } from "@/config/apiRoutes";
import { queryClient } from "@/main";

export const useGetTransactions = (
  params: typeof API_ROUTES.GET_TRANSACTIONS.queryParams
) => {
  return useQuery({
    queryKey: ["transactions", params],
    queryFn: () => getTransactions(params),
    enabled: !!params.page, // Only fetch data if page is provided
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useRequestWithdrawal = () => {
  return useMutation({
    mutationFn: requestWithdrawal,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "transactions",
          {
            limit: "10",
            page: "1",
          },
        ],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: [
          "transactions",
          {
            limit: "3",
            page: "1",
          },
        ],
        refetchType: "all",
      });
    },
  });
};
