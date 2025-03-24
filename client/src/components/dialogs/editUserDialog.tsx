import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { updateUserValidationSchema } from "@/lib/validationSchema";
import { useAdminUpdateUser } from "@/api/apiHooks/adminApiHooks";
import { HaveCountryCode } from "@/lib/haveCountryCode";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/routes";
import Spinner from "../ui/spinner";
import { DatePicker } from "../ui/datePicker";
import { Label } from "../ui/label";
import { useState } from "react";
import { formatDateFormInput } from "@/lib/dateAndTime";

interface EditUserDialogProps {
  user: {
    _id: string;
    name: string;
    phone: string;
    invested: string;
    returnAmount: string;
    investedDate: string;
  };
  refetch: () => void;
}

function EditUserDialog({ user, refetch }: EditUserDialogProps) {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const onOpenChange = () => setOpen(!open);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(updateUserValidationSchema),
    defaultValues: {
      name: user.name,
      phone: user.phone,
      invested: parseInt(user.invested),
      investedDate: new Date(user.investedDate),
      returnAmount: parseInt(user.returnAmount),
    },
  });

  const { mutate: updateUser, isPending } = useAdminUpdateUser({
    id: user._id,
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    if (!HaveCountryCode(data.phone)) {
      setError("phone", {
        type: "manual",
        message: "Country code is required",
      });
      return;
    }
    const formattedDate = formatDateFormInput(data.investedDate);

    updateUser(
      {
        ...data,
        investedDate: formattedDate,
      },
      {
        onSuccess: () => {
          refetch();
          setOpen(false);
          toast({
            variant: "default",
            title: "Success",
            description: "user updated successfully",
          });
        },
        onError: (error) => {
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
              description: customError.message,
            });
          }
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 hover:bg-blue-600 text-sm">
          Edit User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Update User</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <div>
            <Label>Name</Label>
            <Input
              placeholder="Name"
              {...register("name")}
              error={errors.name?.message}
            />
          </div>
          <div>
            <Label>Phone</Label>
            <Input
              placeholder="Phone"
              {...register("phone")}
              error={errors.phone?.message}
            />
          </div>
          <div>
            <Label>Invested Amount</Label>
            <Input
              placeholder="Invested Amount"
              type="number"
              {...register("invested")}
              error={errors.invested?.message}
            />
          </div>
          <div>
            <Label>Return Amount</Label>
            <Input
              placeholder="Return Amount"
              type="number"
              {...register("returnAmount")}
              error={errors.returnAmount?.message}
            />
          </div>
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <Label>Invested Date</Label>
            <Controller
              name="investedDate"
              control={control}
              defaultValue={new Date()}
              render={({ field }) => (
                <DatePicker
                  label="Invested Date"
                  {...field}
                  onChange={(date) => field.onChange(date)}
                />
              )}
            />
            {errors.investedDate?.message && (
              <p className="text-red-500 text-sm mt-1">
                {errors.investedDate?.message}
              </p>
            )}
          </div>
          <div className="col-span-full">
            <DialogFooter>
              <Button type="submit">
                {" "}
                {isPending ? (
                  <div className="flex items-center justify-center gap-3">
                    <Spinner size={5} />
                    Updating User...
                  </div>
                ) : (
                  "Update User"
                )}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditUserDialog;
