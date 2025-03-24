import { Home, User, Wallet } from "lucide-react";
import { ROUTES } from "./routes";

export const tabs = [
  { title: "Home", url: ROUTES.DASHBOARD, icon: Home },
  { title: "Wallet", url: ROUTES.WALLET, icon: Wallet },
  { title: "Profile", url: ROUTES.PROFILE, icon: User },
];
