import { useLocation, Link } from "react-router-dom";
import { tabs } from "@/config/tabs";

// DASHBOARD: "/",
// WALLET: "/wallet",
// PROFILE: "/profile",
// REQUEST_WITHDRAWAL: "/wallet/request-withdrawal",

function BottomTabBar() {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-md shadow-black">
      <nav className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const isActive =
            location.pathname === tab.url ||
            location.pathname.startsWith(`${tab.url}/`);

          return (
            <Link
              key={tab.title}
              to={tab.url}
              className={`flex flex-col items-center justify-center gap-1 ${
                isActive ? "text-primary" : "text-gray-600"
              }`}
            >
              <tab.icon
                className={`w-6 h-6 ${
                  isActive ? "text-primary" : "text-gray-600"
                }`}
              />
              <span className="text-sm">{tab.title}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default BottomTabBar;
