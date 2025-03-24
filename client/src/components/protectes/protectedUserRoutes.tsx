import { ROUTES } from "@/config/routes";
import { useAppDispatch, useAppSelector } from "@/hooks/storeHooks";
import { useToast } from "@/hooks/use-toast";
import { clearUser, setUser } from "@/store/slices/userSlice";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Spinner from "../ui/spinner";
import axiosClient from "@/api/axios/axiosClient";

function ProtectedUserRoutes() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      setLoading(true);
      if (user.isLogined && !user.isAdmin) {
        try {
          const response = await axiosClient.post("/auth/verify/user", {
            phone: user.phone,
          });
          if (response.status === 200) {
            dispatch(setUser(response.data.data.user));
            setLoading(false);
          } else {
            toast({
              title: "Session Expired",
              description: "Please login to continue.",
              variant: "destructive",
            });
            dispatch(clearUser());
            setLoading(false);
            navigate(ROUTES.LOGIN, {
              replace: true,
            });
          }
        } catch {
          toast({
            title: "Session Expired",
            description: "Please login to continue.",
            variant: "destructive",
          });
          dispatch(clearUser());
          setLoading(false);
          navigate(ROUTES.LOGIN, {
            replace: true,
          });
        } finally {
          setLoading(false);
        }
      }
    };

    verifyUser();
  }, [user.isLogined]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-blue-50">
        <Spinner size={10} />
        <p className="mt-4 text-lg font-semibold text-gray-700">
          Loading, please wait...
        </p>
      </div>
    );
  }

  return <Outlet />;
}

export default ProtectedUserRoutes;
