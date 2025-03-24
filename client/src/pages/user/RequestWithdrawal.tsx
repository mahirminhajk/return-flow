import { useRequestWithdrawal } from "@/api/apiHooks/userApiHooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/hooks/storeHooks";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateWallet } from "@/store/slices/userSlice";
import { ROUTES } from "@/config/routes";

function RequestWithdrawal() {
  const balance = useAppSelector((state) => state.user.wallet?.balance);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [upiId, setUpiId] = useState("");
  const [accountDetails, setAccountDetails] = useState({
    accountNumber: "",
    ifscCode: "",
    name: "",
    bankName: "",
  });
  const [error, setError] = useState("");
  const [balanceError, setBalanceError] = useState("");
  const [upiError, setUpiError] = useState("");
  const [accountError, setAccountError] = useState({
    accountNumber: "",
    ifscCode: "",
    name: "",
    bankName: "",
  });
  const [isUPISelected, setIsUPISelected] = useState(true);

  const { toast } = useToast();
  const { mutate: requestWithdrawal, isPending } = useRequestWithdrawal();

  const handleWithdrawal = () => {
    setError("");
    setAccountError({
      accountNumber: "",
      ifscCode: "",
      name: "",
      bankName: "",
    });
    setBalanceError("");
    setUpiError("");

    if (!withdrawalAmount || parseFloat(withdrawalAmount) <= 0) {
      setBalanceError("Please provide withdrawal amount");
      return;
    }
    if (parseFloat(withdrawalAmount) > balance!) {
      setBalanceError("Insufficient balance");
      return;
    }
    if (isUPISelected && !upiId) {
      setUpiError("Please provide UPI ID");
      return;
    } else if (!isUPISelected) {
      if (!accountDetails.accountNumber) {
        setAccountError({
          ...accountError,
          accountNumber: "Please provide account number",
        });
        return;
      }
      if (!accountDetails.ifscCode) {
        setAccountError({
          ...accountError,
          ifscCode: "Please provide IFSC code",
        });
        return;
      }
      if (!accountDetails.bankName) {
        setAccountError({
          ...accountError,
          bankName: "Please provide bank name",
        });
        return;
      }
      if (!accountDetails.name) {
        setAccountError({ ...accountError, name: "Please provide name" });
        return;
      }
    }

    const description = isUPISelected
      ? `UPI ID: ${upiId}`
      : `Account: A/C: ${accountDetails.accountNumber}, IFSC: ${accountDetails.ifscCode}, Bank: ${accountDetails.bankName}, Name: ${accountDetails.name}`;

    requestWithdrawal(
      {
        amount: withdrawalAmount,
        description,
      },
      {
        onSuccess: (data) => {
          dispatch(
            updateWallet({
              balance: data.data?.wallet?.balance,
              updatedAt: data.data?.wallet?.updatedAt,
            })
          );
          toast({
            title: "Withdrawal request sent",
            description: "Your withdrawal request has been sent successfully",
          });
          navigate(ROUTES.WALLET);
        },
        onError: (error) => {
          const customError = error as Error & { type?: string };
          setError(customError.message);
          if (customError.type === "UNAUTHORIZED") {
            toast({
              variant: "destructive",
              title: "Unauthorized",
              description: "Please login to continue",
            });
            navigate(ROUTES.LOGIN);
          } else {
            toast({
              variant: "destructive",
              title: "Withdrawal request failed",
              description: customError.message,
            });
          }
        },
      }
    );
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (parseFloat(e.target.value) > balance!) {
      setBalanceError("Insufficient balance");
    } else {
      setBalanceError("");
    }
    setWithdrawalAmount(e.target.value);
  };

  const handleUpiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpiId(e.target.value);
  };

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountDetails({
      ...accountDetails,
      [e.target.id]: e.target.value,
    });
  };

  const handleOnTabChange = (value: string) => {
    if (value === "upi") setIsUPISelected(true);
    else if (value === "account") setIsUPISelected(false);
  };

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-8 lg:w-1/2 mx-auto mb-10">
      {/* Balance Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Current Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className=" text-blue-500">
            ₹<span className="text-xl font-bold">{balance}</span>
          </p>
        </CardContent>
      </Card>
      {/* Withdrawal Form */}
      <Card>
        <CardHeader>
          <CardTitle>Request Withdrawal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label>Amount</Label>
          <Input
            placeholder="Enter amount to withdraw"
            value={withdrawalAmount}
            onChange={handleAmountChange}
            error={balanceError}
          />
          <Tabs
            defaultValue="upi"
            onValueChange={handleOnTabChange}
            className="w-full"
          >
            <div className="flex justify-center">
              <TabsList className="">
                <TabsTrigger value="upi">UPI</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="upi">
              <Label>UPI ID</Label>
              <Input
                placeholder="abcd@bank"
                value={upiId}
                onChange={handleUpiChange}
                error={upiError}
              />
            </TabsContent>
            <TabsContent value="account">
              <Label>Account Number</Label>
              <Input
                placeholder="1234567890"
                id="accountNumber"
                value={accountDetails.accountNumber}
                onChange={handleAccountChange}
                error={accountError.accountNumber}
              />
              <Label>IFSC Code</Label>
              <Input
                placeholder="SBIN0001234"
                id="ifscCode"
                value={accountDetails.ifscCode}
                onChange={(e) => {
                  setAccountDetails({
                    ...accountDetails,
                    ifscCode: e.target.value.toUpperCase(),
                  });
                }}
                error={accountError.ifscCode}
              />
              <Label>Bank Name</Label>
              <Input
                placeholder="Bank Name"
                id="bankName"
                value={accountDetails.bankName}
                onChange={handleAccountChange}
                error={accountError.bankName}
              />
              <Label>Name</Label>
              <Input
                placeholder="Account Holder Name"
                id="name"
                value={accountDetails.name}
                onChange={handleAccountChange}
                error={accountError.name}
              />
            </TabsContent>
          </Tabs>
          {error && <p className="text-red-500">{error}</p>}
        </CardContent>
      </Card>
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-500"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <p className="text-blue-700 text-sm">
              Note: Your withdrawal will be processed, and the amount will
              reflect in your account within 7 business days.
            </p>
          </div>
        </CardContent>
      </Card>
      {/* Submit Button */}
      <Button
        className="w-full bg-green-500 hover:bg-green-400"
        onClick={handleWithdrawal}
        disabled={balanceError !== ""}
      >
        {isPending ? (
          <div className="flex items-center">
            <Spinner size={4} />
            <span className="ml-2">Processing...</span>
          </div>
        ) : (
          "Send Request"
        )}
      </Button>
    </div>
  );
}

export default RequestWithdrawal;
