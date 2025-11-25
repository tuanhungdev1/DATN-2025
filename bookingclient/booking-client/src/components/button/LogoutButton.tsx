// src/components/LogoutButton.tsx
import { useLogoutMutation } from "@/services/endpoints/auth.api";
import { useNavigate } from "react-router-dom";
import AppButton from "./AppButton";
import { ROUTES } from "@/constants/routes/routeConstants";
import { persistor } from "@/store";

export const LogoutButton = () => {
  const navigate = useNavigate();
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      navigate(ROUTES.LOGIN);
      // Xóa toàn bộ persist storage
      await persistor.purge();

      // Hoặc chỉ xóa auth persist
      // await persistor.flush();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <AppButton onClick={handleLogout} disabled={isLoading}>
      {isLoading ? "Logging out..." : "Logout"}
    </AppButton>
  );
};
