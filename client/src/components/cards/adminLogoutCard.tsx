import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ROUTES } from "@/config/routes";
import { useAppDispatch, useAppSelector } from "@/hooks/storeHooks";
import { useToast } from "@/hooks/use-toast";
import { clearUser } from "@/store/slices/userSlice";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Spinner from "../ui/spinner";
import { useAdminLogout } from "@/api/apiHooks/authHooks";

function AdminLogoutCard() {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const phone = useAppSelector((state) => state.user.phone);

  const { mutate: logout, isPending } = useAdminLogout();

  const handleLogout = () => {
    logout(
      { phone },
      {
        onSuccess: () => {
          dispatch(clearUser());
          navigate(ROUTES.ADMIN_LOGIN);
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
          navigate(ROUTES.ADMIN_LOGIN);
        },
      }
    );
  };

  return (
    <Card
      className="cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={handleLogout}
    >
      <CardHeader>
        <div className="flex items-center gap-4">
          <LogOut className="w-6 h-6 text-red-500" /> {/* Icon */}
          <CardTitle>Logout</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription>
          {isPending ? (
            <div className="flex items-center gap-2">
              <Spinner size={5} />
              <span>Logging out...</span>
            </div>
          ) : (
            "Sign out of your account securely."
          )}
        </CardDescription>
      </CardContent>
    </Card>
  );
}

export default AdminLogoutCard;
