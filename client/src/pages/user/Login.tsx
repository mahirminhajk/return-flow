import { LoginForm } from "@/components/forms/loginForm";
import { ROUTES } from "@/config/routes";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "@/api/apiHooks/authHooks";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch } from "@/hooks/storeHooks";
import { setUser } from "@/store/slices/userSlice";
import Logo from "@/assets/logo.png";

const Login = () => {
  const { mutate: login, isPending } = useLogin();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogin = (data: { phone: string; password: string }) => {
    login(data, {
      onSuccess: (res) => {
        toast({
          title: "Login successful",
          description: `Welcome, ${res.data.user.name}`,
        });

        dispatch(
          setUser({
            name: res.data.user.name,
            _id: res.data.user._id,
            phone: res.data.user.phone,
            wallet: res.data.user.wallet,
            invested: res.data.user.invested,
            returnAmount: res.data.user.returnAmount,
            investedDate: res.data.user.investedDate,
            createdAt: res.data.user.createdAt,
            updatedAt: res.data.user.updatedAt,
          })
        );
        navigate(ROUTES.DASHBOARD, { replace: true });
      },
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: error.message,
        });
      },
    });
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          to={ROUTES.MAIN}
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="flex h-16 w-16  items-center justify-center rounded-md">
            <img src={Logo} alt="logo" />
          </div>
          <p className="text-xl font-bold text-center text-primary">
            RETURN FLOW 
          </p>
        </Link>
        <LoginForm
          handleLogin={handleLogin}
          isAdminLogin={false}
          isPending={isPending}
        />
      </div>
    </div>
  );
};

export default Login;
