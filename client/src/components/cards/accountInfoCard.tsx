import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { formatDate } from "@/lib/dateAndTime";

interface AccountInfoCardProps {
  name?: string;
  phone?: string;
  createdAt?: Date;
}

function AccountInfoCard({ name, phone, createdAt }: AccountInfoCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
        <CardDescription>Details about your account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>
            <strong>Name:</strong> {name || "NaN"}
          </p>
          <p>
            <strong>Phone:</strong> {phone || "NaN"}
          </p>
          <p>
            <strong>Account Created:</strong> {formatDate(createdAt!) || "NaN"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default AccountInfoCard;
