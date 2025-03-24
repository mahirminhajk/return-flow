import axiosClient from "@/api/axios/axiosClient";
import { ROUTES } from "@/config/routes";
import { useAppDispatch, useAppSelector } from "@/hooks/storeHooks";
import { useToast } from "@/hooks/use-toast";
import { clearUser, setAdmin } from "@/store/slices/userSlice";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Spinner from "../ui/spinner";

function ProtectedAdminRoutes() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      setLoading(true);
      if (user.isLogined && user.isAdmin) {
        try {
          const response = await axiosClient.post("/auth/verify/admin", {
            phone: user.phone,
          });

          if (response.status === 200) {
            dispatch(setAdmin(response.data.data.admin));
            setLoading(false);
          } else {
            toast({
              title: "Session Expired",
              description: "Please login to continue.",
              variant: "destructive",
            });
            dispatch(clearUser());
            navigate(ROUTES.ADMIN_LOGIN, {
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
          navigate(ROUTES.ADMIN_LOGIN, {
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
          Loading,admin please wait...
        </p>
      </div>
    );
  }

  return <Outlet />;

  // const isAdminArea = useAppSelector(
  //   (state) =>
  //     state.user.isAdmin &&
  //     (state.user.phone !== "" || state.user.phone !== null)
  // );
  // if (isAdminArea) return <Outlet />;
  // else {
  //   return <Navigate to="/login" replace />;
  // }
}

export default ProtectedAdminRoutes;
