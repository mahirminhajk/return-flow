import { Outlet, useLocation, useParams, matchPath } from "react-router-dom";
import { AppSidebar } from "@/components/app/appSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { breadcrumbConfig, BreadcrumbData } from "@/config/breadcrumbConfig";
import { AppBreadcrumb } from "@/components/app/appBreadcrumb";
import { Separator } from "@/components/ui/separator";

function resolveBreadcrumbs(
  pathname: string,
  config: Record<string, BreadcrumbData[]>,
  params: Record<string, string>
): BreadcrumbData[] {
  const matchingRoute = Object.keys(config).find((route) =>
    matchPath(route, pathname)
  );
  if (!matchingRoute) return [];

  // Replace dynamic segments in paths
  return config[matchingRoute].map((breadcrumb) => ({
    ...breadcrumb,
    path: breadcrumb.path
      ? breadcrumb.path.replace(
          /:([a-zA-Z]+)/g,
          (_, key) => params[key] || `:${key}`
        )
      : undefined,
  }));
}

function SidebarLayout() {
  const location = useLocation();
  const params = Object.fromEntries(
    Object.entries(useParams()).filter(([_, value]) => value !== undefined)
  ) as Record<string, string>;

  const breadcrumbs = resolveBreadcrumbs(
    location.pathname,
    breadcrumbConfig,
    params
  );

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <AppBreadcrumb routes={breadcrumbs} />
          </div>
        </header>
        <main className="p-4">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default SidebarLayout;
