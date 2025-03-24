import { ReactNode, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Table, TableBody } from "../ui/table";
import { useGetTransactions } from "@/api/apiHooks/userApiHooks";
import { useAppDispatch } from "@/hooks/storeHooks";
import { updateWallet } from "@/store/slices/userSlice";
import { SkeletonLoaderForCard } from "../app/appSkeletonLoader";
import { ErrorMessage } from "../app/appErrorMessage";
import TransactionDetailsDialog from "../dialogs/transactionDetailsDialog";
import { ITransaction } from "@/types/ITransaction";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/routes";

function LastThreeTransactionCardLayout({ children }: { children: ReactNode }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Last 3 wallet transactions</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

const queryParams = { page: "1", limit: "3" };

function LastThreeTransactionCard() {
  const { toast } = useToast();
  const { data, isLoading, isError, isSuccess, error } =
    useGetTransactions(queryParams);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isError) {
      const customError = error as Error & { type?: string };
      if (customError.type === "UNAUTHORIZED") {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Session expired. Please login again.",
        });
        navigate(ROUTES.LOGIN);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not fetch transactions",
        });
      }
    }
  }, [isError, toast]);

  if (isLoading) {
    return (
      <LastThreeTransactionCardLayout>
        <SkeletonLoaderForCard />
      </LastThreeTransactionCardLayout>
    );
  }

  if (isError) {
    return (
      <LastThreeTransactionCardLayout>
        <ErrorMessage message="Could not fetch transactions." color="red" />
      </LastThreeTransactionCardLayout>
    );
  }

  if (isSuccess && data?.data?.transactions?.length !== 0) {
    dispatch(
      updateWallet({
        balance: data.data.wallet.balance,
        updatedAt: data.data.wallet.updatedAt,
      })
    );

    return (
      <LastThreeTransactionCardLayout>
        <Table>
          <TableBody>
            {data.data.transactions.map((transaction: ITransaction) => (
              <TransactionDetailsDialog
                transaction={transaction}
                key={transaction._id}
              />
            ))}
          </TableBody>
        </Table>
      </LastThreeTransactionCardLayout>
    );
  }

  return (
    <LastThreeTransactionCardLayout>
      <ErrorMessage message="No transactions yet." color="green" />
    </LastThreeTransactionCardLayout>
  );
}

export default LastThreeTransactionCard;
