import { useAppSelector } from "@/hooks/storeHooks";
import {
  LastThreeTransactionCard,
  InvestedCard,
  InvestedReturnsCard,
  WalletBalanceCard,
  AccountInfoCard,
} from "@/components/cards";

function Dashboard() {
  const user = useAppSelector((state) => state.user);

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-8 mb-10 lg:w-1/2 mx-auto">
      {/* User Info Card */}
      <AccountInfoCard
        name={user.name}
        phone={user.phone}
        createdAt={user.createdAt}
      />

      {/* Wallet Info Card */}
      <WalletBalanceCard
        balance={user.wallet?.balance}
        updatedAt={user.wallet?.updatedAt}
      />

      {/* Investment & Returns Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
        {/* Invested Card */}
        <InvestedCard
          invested={user.invested}
          investedDate={user.investedDate}
        />

        {/* Returns Card */}
        <InvestedReturnsCard returnAmount={user.returnAmount} />
      </div>

      {/* Recent Transactions Card */}
      <LastThreeTransactionCard />
    </div>
  );
}

export default Dashboard;
