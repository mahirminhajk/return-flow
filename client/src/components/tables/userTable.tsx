import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "../ui/checkbox";
import { useState } from "react";
import SelectAndAddTransactions from "../others/selectAndAddTransactions";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/routes";
import { SkeletonLoaderForTable } from "../app/appSkeletonLoader";
import { ErrorMessage } from "../app/appErrorMessage";

const UserTableStructure = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mt-4">
      <Table>
        <TableHeader>
          <TableRow className="uppercase">
            <TableHead>Select</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{children}</TableBody>
      </Table>
    </div>
  );
};

interface UserTableProps {
  children: React.ReactNode;
  data: {
    _id: string;
    name: string;
    phone: string;
    status: string;
  }[];
  isLoading: boolean;
  isEmpty: boolean;
  isError: boolean;
  errorMess: string;
}

function UserTable({
  children,
  data,
  isLoading,
  isEmpty = false,
  isError = false,
  errorMess,
}: UserTableProps) {
  const navigate = useNavigate();

  const [selectedUsers, setSelectedUsers] = useState<
    { _id: string; name: string }[]
  >([]);

  const handleCheck = (user: { _id: string; name: string }) => {
    const isChecked = selectedUsers.some((u) => u._id === user._id);
    setSelectedUsers((prev) => {
      if (!isChecked) {
        return [...prev, user]; // Add user to selected list
      }
      //else remove user from selected list
      return prev.filter((u) => u._id !== user._id);
    });
  };

  const handleClearChecks = () => {
    setSelectedUsers([]);
  };

  // Generate display names based on selected users
  const getDisplayNames = () => {
    const names = selectedUsers.map((u) => u.name);
    if (names.length <= 5) {
      return names.join(", ");
    }
    return `${names.slice(0, 4).join(", ")}... ${names[names.length - 1]}`;
  };

  if (isLoading) {
    return (
      <UserTableStructure>
        <SkeletonLoaderForTable />
        <SkeletonLoaderForTable />
        <SkeletonLoaderForTable />
      </UserTableStructure>
    );
  }

  if (isError) {
    return (
      <UserTableStructure>
        <TableRow>
          <TableCell colSpan={5}>
            <div className="flex items-center gap-2 justify-center">
              <ErrorMessage message={errorMess} color="red" />
            </div>
          </TableCell>
        </TableRow>
      </UserTableStructure>
    );
  }

  if (isEmpty) {
    return (
      <UserTableStructure>
        <TableRow>
          <TableCell colSpan={5}>
            <div className="flex items-center gap-2 justify-center">
              <ErrorMessage message="No users found" color="blue" />
            </div>
          </TableCell>
        </TableRow>
      </UserTableStructure>
    );
  }

  return (
    <div className="mt-4">
      {/* Display selected names */}
      <SelectAndAddTransactions
        selectedUsers={selectedUsers}
        handleClearChecks={handleClearChecks}
        getDisplayNames={getDisplayNames}
      />

      <Table>
        <TableCaption>{children}</TableCaption>
        <TableHeader>
          <TableRow className="uppercase">
            <TableHead>Select</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((user) => {
            const userDetailsPage = ROUTES.ADMIN_USER_DETAILS(user._id);
            return (
              <TableRow key={user._id} className="cursor-pointer">
                <TableCell
                  onClick={() => {
                    handleCheck({
                      _id: user._id,
                      name: user.name,
                    });
                  }}
                >
                  <Checkbox
                    name={user._id}
                    checked={selectedUsers.some((u) => u._id === user._id)}
                  />
                </TableCell>
                <TableCell onClick={() => navigate(userDetailsPage)}>
                  {user.name}
                </TableCell>
                <TableCell onClick={() => navigate(userDetailsPage)}>
                  {user.phone}
                </TableCell>
                <TableCell
                  className={
                    user.status === "ACTIVE" ? "text-green-500" : "text-red-500"
                  }
                  onClick={() => navigate(userDetailsPage)}
                >
                  {user.status}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default UserTable;
