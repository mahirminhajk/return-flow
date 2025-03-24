import { SquareDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddTransactionToMulUsersDialog from "@/components/dialogs/addTransactionToMulUsrsDialog";

interface SelectAndAddTransactionsProps {
  selectedUsers: { _id: string; name: string }[];
  handleClearChecks: () => void;
  getDisplayNames: () => string;
}

function SelectAndAddTransactions({
  selectedUsers,
  handleClearChecks,
  getDisplayNames,
}: SelectAndAddTransactionsProps) {
  const getAllSelectedUsersIds = () => {
    return Array.from(new Set(selectedUsers.map((user) => user._id)));
  };

  const getAllSelectedUsersNames = () => {
    return selectedUsers.map((user) => user.name).join(", ");
  };

  if (selectedUsers.length > 0) {
    return (
      <div className="mb-4 p-4 border rounded bg-gray-50 flex flex-col sm:flex-row justify-between items-center">
        <div className="mb-4 sm:mb-0">
          <span className="font-bold">Selected: </span>
          {getDisplayNames()}
        </div>
        <div className="flex space-x-2">
          <AddTransactionToMulUsersDialog
            getAllSelectedUsersIds={getAllSelectedUsersIds}
            getAllSelectedUsersNames={getAllSelectedUsersNames}
          />
          <Button
            className="bg-red-500 hover:bg-red-600 flex items-center space-x-2"
            onClick={handleClearChecks}
          >
            <SquareDot scale={20} />
            <span>Clear</span>
          </Button>
        </div>
      </div>
    );
  }

  return null;
}

export default SelectAndAddTransactions;

// type: TransactionTypes.CREDIT,
// amount: 100,
// label: TransactionLabel.INVESTMENT,
// description: "Test investment"
