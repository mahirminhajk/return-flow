import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Link } from "react-router-dom";
import { ROUTES } from "@/config/routes";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginValidationSchema } from "@/lib/validationSchema";
import { HaveCountryCode } from "@/lib/haveCountryCode";
import Spinner from "@/components/ui/spinner";
import { useState } from "react";
import CountryCodeSelector from "../input/countryCodeSelector";

interface LoginFormProps {
  handleLogin: (data: { phone: string; password: string }) => void;
  isPending: boolean;
  isAdminLogin?: boolean;
}

export function LoginForm({
  className,
  handleLogin,
  isAdminLogin = false,
  isPending,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & LoginFormProps) {
  const [selectCountryCode, setSelectCountryCode] = useState("91");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(loginValidationSchema),
  });

  const onSubmit = (data: { phone: string; password: string }) => {
    const phoneWithCountryCode = `${selectCountryCode}${data.phone}`;
    const isPhoneWithCountryCode = HaveCountryCode(phoneWithCountryCode);
    if (!isPhoneWithCountryCode) {
      setError("phone", {
        type: "manual",
        message: "Please add country code",
      });
      return;
    }
    handleLogin({
      ...data,
      phone: phoneWithCountryCode,
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your phone number</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <div className="flex items-center gap-2">
                    <CountryCodeSelector
                      selectCountryCode={selectCountryCode}
                      setSelectCountryCode={setSelectCountryCode}
                    />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="phone"
                      pattern="^[0-9]*"
                      inputMode="numeric"
                      {...register("phone")}
                      error={errors.phone?.message}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="password"
                    {...register("password")}
                    error={errors.password?.message}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? <Spinner size={6} /> : "Login"}
                </Button>
              </div>
              <div className="text-center text-sm">
                <Link
                  to={isAdminLogin ? ROUTES.LOGIN : ROUTES.ADMIN_LOGIN}
                  className="underline underline-offset-4"
                >
                  {isAdminLogin ? "Login as user" : "Login as admin"}
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

{
  /* <div className="flex items-center">
<Label htmlFor="password">Password</Label>
{!isAdminLogin && (
  <Link
    to={ROUTES.MAIN}
    className="ml-auto text-sm underline-offset-4 hover:underline"
  >
    Forgot your password?
  </Link>
)}
</div> */
}
