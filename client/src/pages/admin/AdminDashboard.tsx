import { useAdminGetDashboardData } from "@/api/apiHooks/adminApiHooks";
import { BarChartComp } from "@/components/chart/barChart";
import { PieChartComp } from "@/components/chart/pieChart";
import { useAppSelector } from "@/hooks/storeHooks";
import { Skeleton } from "@/components/ui/skeleton";

function AdminDashboard() {
  const user = useAppSelector((state) => state.user);

  const { data, isLoading } = useAdminGetDashboardData();

  if (isLoading) {
    return (
      <div>
        <p className="text-2xl font-bold text-gray-800">Welcome, {user.name}</p>
        <Skeleton className="h-10 w-full mt-4" />
        <Skeleton className="h-64 w-full mt-4" />
        <Skeleton className="h-64 w-full mt-4" />
      </div>
    );
  }

  return (
    <div>
      <div className="">
        <p className="text-2xl font-bold text-gray-800">Welcome, {user.name}</p>
      </div>
      <div className="mt-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Users</h1>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <PieChartComp
            chartData={[
              {
                browser: "Users",
                visitors: data.data?.totalUsers,
                fill: "#02621a",
              },
            ]}
            heading="Total Users"
          />
          <BarChartComp chartData={data.data?.userStats} label="Users" />
        </div>
      </div>

      <div className="mt-8">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Transactions</h1>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <PieChartComp
            chartData={[
              {
                browser: "Transactions",
                visitors: data.data?.totalTransactions,
                fill: "#02621a",
              },
            ]}
            heading="Total Transactions"
          />
          <BarChartComp
            chartData={data.data?.transactionStats}
            label="Transactions"
          />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
