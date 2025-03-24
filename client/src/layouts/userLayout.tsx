import BottomTabBar from "@/components/app/appBottomTabBar";
import { tabs } from "@/config/tabs";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function BottomTabBarLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Match the current tab with subpages
  const currentTab = tabs.find(
    (tab) =>
      location.pathname === tab.url ||
      location.pathname.startsWith(`${tab.url}/`)
  );

  const isSubpage = currentTab && location.pathname !== currentTab.url;

  return (
    <>
      {/* Main content */}
      <div className="flex flex-col min-h-screen">
        <header className="p-4 bg-primary text-white flex items-center uppercase">
          {/* Back button for subpages */}
          {isSubpage && (
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 bg-white text-primary rounded-full"
            >
              <ArrowLeft className="w-3 h-3" />
            </button>
          )}
          {currentTab?.title}
        </header>
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>

      {/* Bottom Tab Bar */}
      <BottomTabBar />
    </>
  );
}

export default BottomTabBarLayout;
