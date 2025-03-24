import { AccountInfoCard } from "@/components/cards";
import LogoutForm from "@/components/forms/logoutForm";
import { useAppSelector } from "@/hooks/storeHooks";

function Profile() {
  const user = useAppSelector((state) => state.user);

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-8 mb-10 lg:w-1/2 mx-auto">
      <AccountInfoCard
        name={user.name}
        phone={user.phone}
        createdAt={user.createdAt}
      />
      <LogoutForm phone={user.phone} />
    </div>
  );
}

export default Profile;
