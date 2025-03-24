import { useAdminDeleteUser } from "@/api/apiHooks/adminApiHooks";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface DeleteUserDialogProps {
  userId: string;
  name: string;
}

function DeleteUserDialog({ userId, name }: DeleteUserDialogProps) {
  const { mutate: deleteUser, isPending } = useAdminDeleteUser();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDeleteUser = () => {
    deleteUser(
      {
        id: userId,
      },
      {
        onSuccess: () => {
          toast({
            title: "User deleted",
            description: `${name} has been successfully deleted`,
          });
          navigate(ROUTES.ADMIN_USERS, { replace: true });
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Failed to delete user",
            description: "An error occurred while deleting the user",
          });
        },
      }
    );
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="destructive" className="text-sm">
          Delete User
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the user
            and remove user data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            className="bg-red-500 hover:bg-red-600"
            onClick={handleDeleteUser}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteUserDialog;
