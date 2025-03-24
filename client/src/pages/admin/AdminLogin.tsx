import { useAdminLogin } from "@/api/apiHooks/authHooks";
import { LoginForm } from "@/components/forms/loginForm";
import { ROUTES } from "@/config/routes";
import { useAppDispatch } from "@/hooks/storeHooks";
import { useToast } from "@/hooks/use-toast";
import { setAdmin } from "@/store/slices/userSlice";
import Logo from "@/assets/logo.png";
import { Link, useNavigate } from "react-router-dom";

function AdminLogin() {
  const { mutate: login, isPending } = useAdminLogin();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogin = (data: { phone: string; password: string }) => {
    login(data, {
      onSuccess: (res) => {
        toast({
          title: "Login successful",
          description: `Welcome, ${res.data.admin.name}`,
        });

        dispatch(
          setAdmin({
            name: res.data.admin.name,
            _id: res.data.admin._id,
            phone: res.data.admin.phone,
          })
        );
        navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
      },
      onError: (error) => {
        console.log(error);

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
          <div className="flex h-16 w-16 items-center justify-center rounded-md">
            <img src={Logo} alt="logo" />
          </div>
          <p className="text-xl font-bold text-center text-primary">
            ADMIN PANEL
          </p>
        </Link>
        <LoginForm
          handleLogin={handleLogin}
          isAdminLogin={true}
          isPending={isPending}
        />
      </div>
    </div>
  );
}

export default AdminLogin;
