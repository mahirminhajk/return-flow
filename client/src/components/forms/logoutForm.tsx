import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useLogout } from "@/api/apiHooks/authHooks";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch } from "@/hooks/storeHooks";
import { useNavigate } from "react-router-dom";
import Spinner from "../ui/spinner";
import { clearUser } from "@/store/slices/userSlice";
import { ROUTES } from "@/config/routes";

interface LogoutFormProps {
  //   type: "user" | "admin";
  phone: string;
}

function LogoutForm({ phone }: LogoutFormProps) {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { mutate: logout, isPending } = useLogout();

  const handleLogout = () => {
    logout(
      { phone },
      {
        onSuccess: () => {
          dispatch(clearUser());
          navigate(ROUTES.LOGIN);
          toast({
            variant: "default",
            title: "Logged out",
            description: "You have been logged out.",
          });
        },
        onError: (err) => {
          toast({
            variant: "destructive",
            title: "Logged out failed",
            description: err.message,
          });
          dispatch(clearUser());
          navigate(ROUTES.LOGIN);
        },
      }
    );
  };

  return (
    <Button className="bg-red-500" onClick={handleLogout} disabled={isPending}>
      {isPending ? <Spinner size={5} /> : <LogOut size={20} />}
      <span>Logout</span>
    </Button>
  );
}

export default LogoutForm;
