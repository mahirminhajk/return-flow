import {
  Table,
  TableCaption,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { useGetTransactions } from "@/api/apiHooks/userApiHooks";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import AppPagination from "../app/appPagination";
import { SkeletonLoaderForTable } from "../app/appSkeletonLoader";
import { ErrorMessage } from "../app/appErrorMessage";
import { ITransaction } from "@/types/ITransaction";
import TransactionDetailsDialog from "../dialogs/transactionDetailsDialog";
import { useNavigate } from "react-router-dom";
import { ITEMS_PER_PAGE } from "@/config";
import { ROUTES } from "@/config/routes";
import TransactionsTableLayout from "../layout/transactionsTableLayout";

function TransactionsTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const { toast } = useToast();
  const navigate = useNavigate();

  const queryParams = {
    page: currentPage.toString(),
    limit: ITEMS_PER_PAGE.toString(),
  };
  const { data, isLoading, isError, isSuccess, error } =
    useGetTransactions(queryParams);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage === 1) return;

    setCurrentPage((prev) => prev - 1);
  };
  const handleNextPage = () => {
    if (currentPage === maxPage) return;
    setCurrentPage((prev) => prev + 1);
  };

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

    if (isSuccess && data?.data?.transactions?.length !== 0) {
      setMaxPage(data?.data?.pagination?.totalPages);
      setCurrentPage(data?.data?.pagination?.page);
    }
  }, [isError, isSuccess, data, error, navigate, toast]);

  if (isLoading) {
    return (
      <div>
        <Table>
          <TransactionsTableLayout>
            <SkeletonLoaderForTable />
            <SkeletonLoaderForTable />
          </TransactionsTableLayout>
        </Table>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <Table>
          <TransactionsTableLayout>
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                <ErrorMessage
                  color="red"
                  message="Could not fetch transactions"
                />
              </TableCell>
            </TableRow>
          </TransactionsTableLayout>
        </Table>
      </div>
    );
  }

  if (isSuccess && data?.data?.transactions?.length !== 0) {
    return (
      <div>
        <Table>
          <TableCaption>
            <AppPagination
              currentPage={currentPage}
              maxPage={maxPage}
              handlePageChange={handlePageChange}
              handlePreviousPage={handlePreviousPage}
              handleNextPage={handleNextPage}
            />
          </TableCaption>
          <TransactionsTableLayout>
            {data?.data?.transactions.map((transaction: ITransaction) => (
              <TransactionDetailsDialog
                transaction={transaction}
                key={transaction._id}
              />
            ))}
          </TransactionsTableLayout>
        </Table>
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TransactionsTableLayout>
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              <ErrorMessage color="green" message="No transactions yet" />
            </TableCell>
          </TableRow>
        </TransactionsTableLayout>
      </Table>
    </div>
  );
}

export default TransactionsTable;
