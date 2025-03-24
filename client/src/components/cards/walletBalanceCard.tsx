import { formatDate } from "@/lib/dateAndTime";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Link } from "react-router-dom";
import { ROUTES } from "@/config/routes";

interface WalletCardProps {
  balance?: number;
  updatedAt?: Date;
}

function WalletBalanceCard({ balance, updatedAt }: WalletCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Wallet</CardTitle>
        <CardDescription>Manage your wallet balance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <strong className="text-lg">Balance:</strong>
            <span className=" text-blue-500">
              ₹
              <span className="text-2xl font-bold">
                {balance !== null && balance !== undefined
                  ? balance.toFixed(2)
                  : "0.00"}
              </span>
            </span>
          </div>
          <p>
            <strong>Last Updated:</strong>{" "}
            {updatedAt ? formatDate(updatedAt) : "NaN"}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Link
          to={ROUTES.REQUEST_WITHDRAWAL}
          className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-zinc-900/90"
        >
          Request Withdrawal
        </Link>
      </CardFooter>
    </Card>
  );
}

export default WalletBalanceCard;
