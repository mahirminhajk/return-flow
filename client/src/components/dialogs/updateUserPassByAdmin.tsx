import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useAdminChangeUserPassword } from "@/api/apiHooks/adminApiHooks";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface UpdateUserPassByAdminProps {
  userId: string;
  name: string;
}

function UpdateUserPassByAdmin({ userId, name }: UpdateUserPassByAdminProps) {
  const [open, setOpen] = useState(false);
  const onOpenChange = () => setOpen(!open);

  const [updatedPassword, setUpdatedPassword] = useState("");
  const { toast } = useToast();

  const { mutate: changePassword, isPending } = useAdminChangeUserPassword({
    id: userId,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedPassword(e.target.value);
  };

  const handlePasswordChagne = () => {
    //* validate password
    if (updatedPassword.length < 8) {
      toast({
        variant: "destructive",
        title: "Password must be atleast 8 characters long.",
        description:
          "Please enter a password that is atleast 8 characters long.",
      });
      return;
    }

    changePassword(
      { password: updatedPassword },
      {
        onSuccess: () => {
          setUpdatedPassword("");
          setOpen(false);
          toast({
            title: "Password updated successfully.",
            description: `Password for user ${name} has been updated successfully.`,
          });
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Can't update password, please try again.",
            description: error.message,
          });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 hover:bg-blue-600 text-sm">
          Change Password
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Update the password for the user {name}.
          </DialogDescription>
        </DialogHeader>
        <div className="">
          <div className="">
            <Label htmlFor="name" className="text-right">
              New Password
            </Label>
            <Input
              id="name"
              placeholder="Enter new password"
              className="col-span-3"
              value={updatedPassword}
              onChange={handleInputChange}
              disabled={isPending}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            className="bg-green-500 hover:bg-green-600"
            onClick={handlePasswordChagne}
            disabled={isPending}
          >
            {isPending ? "Updating..." : "Update Password"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateUserPassByAdmin;
