import { Route, Routes } from "react-router-dom";

import SidebarLayout from "@/layouts/adminLayout";
import BottomTabBarLayout from "@/layouts/userLayout";
import { ROUTES } from "@/config/routes";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/user/Login";
import AdminLogin from "@/pages/admin/AdminLogin";
import Dashboard from "@/pages/user/Dashboard";
import Wallet from "@/pages/user/Wallet";
import Profile from "./pages/user/Profile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Users from "./pages/admin/Users";
import Settings from "./pages/admin/Settings";
import {
  ProtectedAdminRoutes,
  ProtectedUserRoutes,
} from "./components/protectes";
import RequestWithdrawal from "./pages/user/RequestWithdrawal";
import { useAppSelector } from "./hooks/storeHooks";
import AdminCreateUser from "./pages/admin/AdminCreateUser";
import UserDetails from "./pages/admin/AdminUserDetails";
import Notification from "@/pages/admin/Notification";

function App() {
  const user = useAppSelector((state) => state.user);

  if (user.isLogined && user.isAdmin) {
    return (
      <Routes>
        {/* Pages with Sidebar */}
        <Route element={<ProtectedAdminRoutes />}>
          <Route element={<SidebarLayout />}>
            <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />
            <Route path={ROUTES.ADMIN_USERS} element={<Users />} />
            <Route
              path={ROUTES.ADMIN_CREATE_USER}
              element={<AdminCreateUser />}
            />
            <Route
              path={ROUTES.ADMIN_USER_DETAILS()}
              element={<UserDetails />}
            />

            <Route
              path={ROUTES.ADMIN_NOTIFICATION}
              element={<Notification />}
            />
            <Route path={ROUTES.ADMIN_SETTINGS} element={<Settings />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLogin />} />
      </Routes>
    );
  } else if (user.isLogined && !user.isAdmin) {
    return (
      <Routes>
        <Route element={<ProtectedUserRoutes />}>
          <Route element={<BottomTabBarLayout />}>
            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
            <Route path={ROUTES.WALLET} element={<Wallet />} />
            <Route
              path={ROUTES.REQUEST_WITHDRAWAL}
              element={<RequestWithdrawal />}
            />
            <Route path={ROUTES.PROFILE} element={<Profile />} />
          </Route>
        </Route>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLogin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  } else {
    return (
      <Routes>
        {/* Public pages */}
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLogin />} />
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }
}

export default App;
