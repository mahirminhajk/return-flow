import AdminLogoutCard from "@/components/cards/adminLogoutCard";
import AdminChangePasswordDialog from "@/components/dialogs/adminChangePasswordDialog";

function Settings() {
  return (
    <div className="flex flex-col gap-4 p-6">
      {/* Change Password Card */}
      <AdminChangePasswordDialog />

      {/* Logout Card */}
      <AdminLogoutCard />
    </div>
  );
}

export default Settings;
