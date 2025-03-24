import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ITransaction } from "@/types/ITransaction";
import { TableCell, TableRow } from "../ui/table";
import { formatDateWithTime } from "@/lib/dateAndTime";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { Button } from "../ui/button";
import { useAdminUpdateTransactionStatus } from "@/api/apiHooks/adminApiHooks";
import { useToast } from "@/hooks/use-toast";

function AdminTransactionDetailsDialog({
  transaction,
  refetch,
}: {
  transaction: ITransaction;
  refetch: () => void;
}) {
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const onOpenChange = () => setOpen(!open);

  const [status, setStatus] = useState(transaction.status);
  const [isStatusChanged, setIsStatusChanged] = useState(false);

  const { mutate: updateTransactionStatus, isPending } =
    useAdminUpdateTransactionStatus();

  const handleRadioChange = (value: "ACCEPTED" | "PENDING") => {
    if (value !== transaction.status) setIsStatusChanged(true);
    else setIsStatusChanged(false);
    setStatus(value);
  };

  const handleStatusChange = () => {
    updateTransactionStatus(
      {
        transactionId: transaction._id,
        status,
      },
      {
        onSuccess: () => {
          setIsStatusChanged(false);
          setOpen(false);
          refetch();
          toast({
            title: "Transaction status updated successfully",
          });
        },
        onError: () => {
          toast({
            title: "Failed to update transaction status",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <TableRow
          key={transaction._id}
          className="cursor-pointer hover:bg-gray-100"
        >
          <TableCell
            className={
              transaction.type === "CREDIT" ? "text-green-500" : "text-red-500"
            }
          >
            {transaction.type}
          </TableCell>
          <TableCell>{transaction.label}</TableCell>
          <TableCell>₹{transaction.amount}</TableCell>
          <TableCell>
            <Badge
              variant={
                transaction.status === "PENDING"
                  ? "destructive"
                  : transaction.status === "ACCEPTED"
                  ? "secondary"
                  : "destructive"
              }
            >
              {transaction.status}
            </Badge>
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
          </div>
          <p>description: {transaction.description}</p>
          <div>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg">
              <strong>Status:</strong> {transaction.status}
            </p>
            <div>
              <RadioGroup
                defaultValue={status}
                value={status}
                onValueChange={handleRadioChange}
                className="flex"
                disabled={isPending}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PENDING" id="pending" />
                  <Label>Pending</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ACCEPTED" id="accepted" />
                  <Label className="text-green-500">Accepted</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
        {isStatusChanged && (
          <DialogFooter>
            <Button
              className="justify-end bg-green-500 hover:bg-green-400"
              onClick={handleStatusChange}
              disabled={isPending}
            >
              Update Status
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default AdminTransactionDetailsDialog;
