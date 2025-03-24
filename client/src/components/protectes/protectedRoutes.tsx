import { useAppSelector } from "@/hooks/storeHooks";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoutes() {
  const user = useAppSelector((state) => state.user);

  if (!user.isLogined) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoutes;
