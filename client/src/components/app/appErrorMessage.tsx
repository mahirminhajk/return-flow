import { BadgeAlert } from "lucide-react";

export const ErrorMessage = ({
  message,
  color,
}: {
  message: string;
  color: string;
}) => (
  <div className="flex items-center gap-2">
    <BadgeAlert className={`text-${color}-500`} />
    <p className={`text-${color}-500 font-semibold`}>{message}</p>
  </div>
);
