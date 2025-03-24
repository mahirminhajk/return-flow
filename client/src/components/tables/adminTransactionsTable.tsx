import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AppPagination from "../app/appPagination";
import { useEffect, useState } from "react";
import AdminTransactionDetailsDialog from "../dialogs/adminTransactionDetailsDialog";
import { useAdminGetTransactionsOfAUser } from "@/api/apiHooks/adminApiHooks";
import { ITEMS_PER_PAGE } from "@/config";
import { ROUTES } from "@/config/routes";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import TransactionsTableLayout from "../layout/transactionsTableLayout";
import { SkeletonLoaderForTable } from "../app/appSkeletonLoader";
import { ErrorMessage } from "../app/appErrorMessage";
import { ITransaction } from "@/types/ITransaction";

interface AdminTransactionsTableProps {
  id: string;
}

function AdminTransactionsTable({ id }: AdminTransactionsTableProps) {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Handle page change
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const queryParams = {
    id,
    page: currentPage.toString(),
    limit: ITEMS_PER_PAGE.toString(),
  };
  const { data, isLoading, isError, isSuccess, error, refetch } =
    useAdminGetTransactionsOfAUser(queryParams);

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
        navigate(ROUTES.ADMIN_LOGIN);
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
      <Table className="min-w-full">
        <TableCaption>
          <AppPagination
            currentPage={currentPage}
            maxPage={maxPage}
            handlePageChange={handlePageChange}
            handlePreviousPage={handlePreviousPage}
            handleNextPage={handleNextPage}
          />
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Label</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.data?.transactions.map(
            (transaction: ITransaction, index: number) => (
              <AdminTransactionDetailsDialog
                key={index}
                transaction={{
                  _id: transaction._id,
                  type: transaction.type as "CREDIT" | "DEBIT",
                  description: transaction.description,
                  amount: transaction.amount,
                  label: transaction.label,
                  createdAt: new Date(transaction.createdAt),
                  status: transaction.status as "PENDING" | "ACCEPTED",
                }}
                refetch={refetch}
              />
            )
          )}
        </TableBody>
      </Table>
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

export default AdminTransactionsTable;
