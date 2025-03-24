import { Controller, useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { DatePicker } from "../ui/datePicker";
import { Button } from "../ui/button";
import { yupResolver } from "@hookform/resolvers/yup";
import { createUserValidationSchema } from "@/lib/validationSchema";
import { useAdminCreateUser } from "@/api/apiHooks/adminApiHooks";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/routes";
import Spinner from "../ui/spinner";
import { formatDateFormInput } from "@/lib/dateAndTime";
import { Label } from "../ui/label";
import CountryCodeSelector from "../input/countryCodeSelector";
import { useState } from "react";

function CreateUserForm() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [selectCountryCode, setSelectCountryCode] = useState("91");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(createUserValidationSchema),
    defaultValues: {
      invested: 0,
      returnAmount: 0,
    },
  });

  const { mutate: createUser, isPending } = useAdminCreateUser();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    const phoneWithCountryCode = `${selectCountryCode}${data.phone}`;
    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }

    const formattedDate = formatDateFormInput(data.investedDate);

    createUser(
      {
        ...data,
        investedDate: formattedDate,
        phone: phoneWithCountryCode,
      },
      {
        onSuccess: (res) => {
          toast({
            variant: "default",
            title: "Success",
            description: `${res.data.name} created successfully`,
          });
          navigate(ROUTES.ADMIN_USERS);
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
    <div className="min-h-fit bg-gray-50 py-8 px-4 md:px-12 lg:px-20">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Create User
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <div>
          <Input
            placeholder="Name"
            {...register("name")}
            error={errors.name?.message}
          />
        </div>
        <div className="flex items-center gap-2">
          <CountryCodeSelector
            selectCountryCode={selectCountryCode}
            setSelectCountryCode={setSelectCountryCode}
          />
          <Input
            placeholder="Phone"
            {...register("phone")}
            error={errors.phone?.message}
          />
        </div>
        <div>
          <Input
            placeholder="Password"
            type="password"
            {...register("password")}
            error={errors.password?.message}
          />
        </div>
        <div>
          <Input
            placeholder="Confirm Password"
            type="password"
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />
        </div>
        <div>
          <Input
            placeholder="Invested Amount"
            type="number"
            {...register("invested")}
            error={errors.invested?.message}
          />
        </div>
        <div>
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
          <Button
            type="submit"
            className="w-full bg-green-400 hover:bg-green-500"
            disabled={isPending}
          >
            {isPending ? (
              <div className="flex items-center justify-center gap-3">
                <Spinner size={5} />
                Creating User...
              </div>
            ) : (
              "Create User"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreateUserForm;
