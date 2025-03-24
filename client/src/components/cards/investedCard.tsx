import { formatDate } from "@/lib/dateAndTime";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface InvestedCardProps {
  invested?: number;
  investedDate?: Date;
}

function InvestedCard({ invested, investedDate }: InvestedCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Invested</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>
            <strong>Amount:</strong> ₹{invested || "NaN"}
          </p>
          <p>
            <strong>Invested On:</strong>{" "}
            {investedDate ? formatDate(investedDate) : "NaN"}
          </p>
          <p className="text-xs text-gray-500">
            Note: Invested amount can only be withdrawn after 1 year from the
            investment date.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default InvestedCard;
