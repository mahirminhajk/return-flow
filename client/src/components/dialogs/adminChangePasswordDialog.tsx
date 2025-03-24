import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"; // Input component from shadcn/ui
import { Button } from "@/components/ui/button"; // Button component from shadcn/ui
import { Key } from "lucide-react"; // Import icons from lucide-react
import { useAdminChangePassword } from "@/api/apiHooks/adminApiHooks";
import { useToast } from "@/hooks/use-toast";

function AdminChangePasswordDialog() {
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const onOpenChange = () => setOpen(!open);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const { mutate: changePassword, isPending } = useAdminChangePassword();

  const handleUpdatePassword = () => {
    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }
    // Clear error if passwords match
    setError("");
    // Call the changePassword mutation
    changePassword(
      { oldPassword, newPassword },
      {
        onSuccess: () => {
          setOpen(false); // Close the dialog
          // Reset fields after submission
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");
          // Show success toast
          toast({
            title: "Password Updated",
            description: "Your password has been updated successfully.",
          });
        },
        onError: (error) => {
          const errorMessage = error.message;
          setError(errorMessage || "An error occurred. Please try again.");
          toast({
            title: "Error",
            description: errorMessage || "An error occurred. Please try again.",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Key className="w-6 h-6 text-blue-500" /> {/* Icon */}
              <CardTitle>Change Password</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Update your account password securely.
            </CardDescription>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Enter your old password and set a new password.
          </DialogDescription>
        </DialogHeader>

        {/* Old Password Input */}
        <div className="space-y-4">
          <Input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />

          {/* New Password Input */}
          <Input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          {/* Confirm Password Input */}
          <Input
            type="text"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {/* Error Message */}
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <DialogFooter>
          <Button
            onClick={handleUpdatePassword}
            className="w-full bg-blue-500 hover:bg-blue-400"
            disabled={isPending}
          >
            {isPending ? "Updating Password..." : "Update Password"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AdminChangePasswordDialog;
