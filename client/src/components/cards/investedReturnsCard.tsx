import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface InvestedReturnsCardProps {
  returnAmount?: number;
}

function InvestedReturnsCard({ returnAmount }: InvestedReturnsCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Returns</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          <strong>Return Amount:</strong> ₹
          {returnAmount ? `${returnAmount}/month` : "NaN"}
        </p>
      </CardContent>
    </Card>
  );
}

export default InvestedReturnsCard;
