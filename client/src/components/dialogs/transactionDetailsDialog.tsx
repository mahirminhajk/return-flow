import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ITransaction } from "@/types/ITransaction";
import { TableCell, TableRow } from "../ui/table";
import {
  formatDateWithDayAndMonth,
  formatDateWithTime,
} from "@/lib/dateAndTime";

function TransactionDetailsDialog({
  transaction,
}: {
  transaction: ITransaction;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <TableRow
          key={transaction._id}
          className="cursor-pointer hover:bg-gray-100"
        >
          <TableCell className="whitespace-nowrap">
            {formatDateWithDayAndMonth(transaction.createdAt)}
          </TableCell>
          <TableCell>{transaction.label}</TableCell>
          <TableCell
            className={
              transaction.type === "CREDIT" ? "text-green-500" : "text-red-500"
            }
          >
            {transaction.type}
          </TableCell>
          <TableCell className="md:text-right lg:text-right">
            ₹{transaction.amount}
          </TableCell>
        </TableRow>
      </DialogTrigger>
      <DialogContent className="max-w-[310px] lg:max-w-fit md:max-w-fit">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>
            Here are the details for the transaction made on{" "}
            <span className="font-semibold">
              {formatDateWithTime(transaction.createdAt)}.
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-2">
          <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:space-x-4">
            <p className="text-xs sm:text-sm md:text-base lg:text-lg">
              <strong>Type:</strong>{" "}
              <span
                className={
                  transaction.type === "CREDIT"
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {transaction.type}
              </span>
            </p>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg">
              <strong>Amount:</strong> ₹{transaction.amount}
            </p>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg">
              <strong>Label:</strong> {transaction.label}
            </p>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg">
              <strong>Status:</strong> {transaction.status}
            </p>
          </div>
          <p>Remark: {transaction.description}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default TransactionDetailsDialog;
