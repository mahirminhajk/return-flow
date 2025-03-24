import { WalletBalanceCard } from "@/components/cards";
import TransactionsTable from "@/components/tables/transactionsTable";
import { useAppSelector } from "@/hooks/storeHooks";

function Wallet() {
  const user = useAppSelector((state) => state.user);

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-8 mb-10 lg:w-1/2 mx-auto">
      {/* Wallet Info Card */}
      <WalletBalanceCard
        balance={user.wallet?.balance}
        updatedAt={user.wallet?.updatedAt}
      />

      {/*transactions table */}
      <TransactionsTable />
    </div>
  );
}

export default Wallet;
