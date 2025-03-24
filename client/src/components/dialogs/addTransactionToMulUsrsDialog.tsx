import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm, Controller } from "react-hook-form";
import { adminAddTransactionValidationSchema } from "@/lib/validationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminAddTransactionToUsers } from "@/api/apiHooks/adminApiHooks";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { queryClient } from "@/main";

interface AddTransactionDialogProps {
  getAllSelectedUsersIds: () => string[];
  getAllSelectedUsersNames: () => string;
  refetch?: () => void;
  isSingleUser?: boolean;
  userBalance?: number;
}

interface FormValues {
  type: "CREDIT" | "DEBIT";
  amount: number;
  label: "INVESTMENT" | "WITHDRAWAL" | "SERVICE" | "OTHERS";
  description: string;
}

function AddTransactionToMulUsersDialog({
  getAllSelectedUsersIds,
  getAllSelectedUsersNames,
  refetch,
  isSingleUser = false,
  userBalance,
}: AddTransactionDialogProps) {
  const [opne, setOpen] = useState(false);
  const onOpenChange = () => setOpen(!opne);

  const { toast } = useToast();

  const { mutate: addTransactions, isPending } =
    useAdminAddTransactionToUsers();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(adminAddTransactionValidationSchema),
    defaultValues: {
      type: "CREDIT",
      label: "OTHERS",
      amount: 0,
      description: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    const userIds = getAllSelectedUsersIds();
    const modifyedData = {
      userIds,
      type: data.type as "CREDIT" | "DEBIT",
      amount: data.amount.toString(),
      label: data.label as "INVESTMENT" | "WITHDRAWAL" | "SERVICE" | "OTHERS",
      description: data.description as string,
    };
    if (
      isSingleUser &&
      userBalance !== undefined &&
      data.type === "DEBIT" &&
      userBalance < data.amount
    ) {
      toast({
        title: "Insufficient balance",
        description: `User has only ₹${userBalance} in balance`,
        variant: "destructive",
      });
      return;
    }
    addTransactions(modifyedData, {
      onSuccess: () => {
        if (refetch) refetch();
        setOpen(false);
        if (isSingleUser) {
          queryClient.invalidateQueries({
            queryKey: [
              "user-transaction",
              {
                id: userIds[0].toString(),
                limit: "10",
                page: "1",
              },
            ],
            refetchType: "all",
          });
        }
        toast({
          title: "Success",
          description: "Transaction added successfully",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to add transaction",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <Dialog open={opne} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 hover:bg-blue-600 flex items-center space-x-2">
          <IndianRupee scale={20} />
          <span>Add Transactions</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription>
            Fill in the details to record a transaction.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Transaction Type</Label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      disabled={isPending}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="CREDIT" className="text-green-500">
                            Credit
                          </SelectItem>
                          <SelectItem value="DEBIT" className="text-red-500">
                            Debit
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  {...register("amount")}
                  className="w-full"
                  placeholder="Enter amount"
                  disabled={isPending}
                />
                {errors.amount && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.amount.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="label">Transaction Label</Label>
              <Controller
                name="label"
                control={control}
                render={({ field }) => (
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    disabled={isPending}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select label" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="INVESTMENT">Investment</SelectItem>
                        <SelectItem value="WITHDRAWAL">Withdrawal</SelectItem>
                        <SelectItem value="SERVICE">Service</SelectItem>
                        <SelectItem value="OTHERS">Others</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Enter a transaction description"
                disabled={isPending}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <div className="flex flex-col w-full">
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Adding..." : "Add Transaction"}
              </Button>
              <div>
                <p className="text-xs text-orange-500">
                  <strong>Warning:</strong> This transaction will be applied to
                  the following {isSingleUser ? "user" : "users"}:{" "}
                  {getAllSelectedUsersNames()}.
                </p>
              </div>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddTransactionToMulUsersDialog;
