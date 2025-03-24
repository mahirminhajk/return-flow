import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import AdminTransactionsTable from "@/components/tables/adminTransactionsTable";
import { useToast } from "@/hooks/use-toast";
import { useAdminGetUserDetails } from "@/api/apiHooks/adminApiHooks";
import { ROUTES } from "@/config/routes";
import { useEffect, useState } from "react";
import DeleteUserDialog from "@/components/dialogs/deleteUserDialog";
import UpdateUserPassByAdmin from "@/components/dialogs/updateUserPassByAdmin";
import EditUserDialog from "@/components/dialogs/editUserDialog";
import AddTransactionToMulUsersDialog from "@/components/dialogs/addTransactionToMulUsrsDialog";
import { formatDate } from "@/lib/dateAndTime";

function UserDetailsError({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Main User Card */}
      <Card>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}

function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isUserNotFound, setUserNotFound] = useState(false);
  const [isUserIdInvalid, setIsUserIdInvalid] = useState(false);

  const { data, isLoading, isError, error, isSuccess, refetch } =
    useAdminGetUserDetails({
      id: id!,
    });

  useEffect(() => {
    if (isSuccess) console.log(data);

    if (isError) {
      const customError = error as Error & { type?: string };
      if (customError.type === "UNAUTHORIZED") {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Session expired. Please login again.",
        });
        navigate(ROUTES.ADMIN_LOGIN, { replace: true });
      } else if (customError.type === "NOT_FOUND") {
        setUserNotFound(true);
        toast({
          variant: "destructive",
          title: "Error",
          description: "User not found",
        });
      } else if (customError.type === "VALIDATION_ERROR") {
        setIsUserIdInvalid(true);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Invalid User ID",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not fetch transactions",
        });
      }
    }
  }, [isError, data, error]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        {/* Main User Card */}
        <Card>
          <CardContent>
            <div className="animate-pulse space-y-4">
              <div className="flex justify-between">
                <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
                <div className="w-1/4 h-4 bg-gray-300 rounded"></div>
              </div>
              <div className="flex justify-between">
                <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
                <div className="w-1/4 h-4 bg-gray-300 rounded"></div>
              </div>
              <div className="flex justify-between">
                <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
                <div className="w-1/4 h-4 bg-gray-300 rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    if (isUserNotFound) {
      return (
        <UserDetailsError>
          <CardHeader>
            <h2 className="text-lg font-semibold text-red-500">
              User not found
            </h2>
          </CardHeader>
        </UserDetailsError>
      );
    } else if (isUserIdInvalid) {
      return (
        <UserDetailsError>
          <CardHeader>
            <h2 className="text-lg font-semibold text-red-500">
              Invalid User ID
            </h2>
          </CardHeader>
        </UserDetailsError>
      );
    } else {
      return (
        <UserDetailsError>
          <CardHeader>
            <h2 className="text-lg font-semibold text-red-500">
              Error fetching user details
            </h2>
          </CardHeader>
        </UserDetailsError>
      );
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Main User Card */}
      <Card>
        <CardContent className="p-4 flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">
          {/* User Info Section */}
          <div className="space-y-3 text-center lg:text-left">
            <h1 className="text-xl font-bold lg:text-2xl uppercase">
              {data?.data?.user?.name}
            </h1>
            <p className="text-gray-600">{data?.data?.user?.phone}</p>
            <Badge
              variant={
                data?.data?.user?.status === "ACTIVE"
                  ? "secondary"
                  : "destructive"
              }
              className="text-sm lg:text-base"
            >
              {data?.data?.user?.status}
            </Badge>
            <p className="font-semibold">
              Created By:{" "}
              <span className="font-medium text-blue-600 cursor-pointer">
                {data?.data?.user?.createdBy.name}
              </span>
            </p>
          </div>

          {/* Wallet Balance Section */}
          <div className="text-center lg:text-right">
            <p className="text-sm text-gray-500">Wallet Balance</p>
            <h2 className="text-3xl font-bold text-green-500 lg:text-4xl">
              ₹{data?.data?.user?.wallet.balance}
            </h2>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 lg:items-end">
            <div className="flex gap-2 justify-center lg:justify-end">
              <EditUserDialog user={data?.data?.user} refetch={refetch} />

              <UpdateUserPassByAdmin
                userId={data?.data?.user?._id}
                name={data?.data?.user?.name}
              />
            </div>
            <div className="flex gap-2 justify-center lg:justify-end">
              <AddTransactionToMulUsersDialog
                getAllSelectedUsersIds={() => [data?.data?.user?._id]}
                getAllSelectedUsersNames={() => data?.data?.user?.name}
                refetch={refetch}
                isSingleUser={true}
                userBalance={data?.data?.user?.wallet.balance}
              />
              <DeleteUserDialog
                userId={data?.data?.user?._id}
                name={data?.data?.user?.name}
              />
            </div>
          </div>
        </CardContent>

        {/* Investment Summary Section */}
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-4">Investment Summary</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex justify-between">
              <p className="font-semibold">Invested Amount:</p>
              <p>₹{data?.data?.user?.invested}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-semibold">Return Amount:</p>
              <p>₹{data?.data?.user?.returnAmount}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-semibold">Invested Date:</p>
              <p>{formatDate(data?.data?.user?.investedDate)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Card */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Transactions</h2>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <AdminTransactionsTable id={data?.data?.user?._id} />
        </CardContent>
      </Card>
    </div>
  );
}

export default UserDetails;
