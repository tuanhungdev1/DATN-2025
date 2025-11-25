// src/pages/admin/UserManagement/components/hooks/useUserDialogs.ts
import { useState, useCallback } from "react";
import type { UserProfile } from "@/types/user.types";

export interface DialogState {
  open: boolean;
  mode: "create" | "edit" | "view";
  user?: UserProfile;
}

export const useUserDialogs = () => {
  const [dialogState, setDialogState] = useState<DialogState>({
    open: false,
    mode: "view",
  });

  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);

  const handleOpenDialog = useCallback(
    (mode: "create" | "edit" | "view", user?: UserProfile) => {
      setDialogState({ open: true, mode, user });
    },
    []
  );

  const handleCloseDialog = useCallback(() => {
    setDialogState({ open: false, mode: "view" });
  }, []);

  const handleOpenDeleteConfirm = useCallback((user: UserProfile) => {
    setUserToDelete(user);
    setOpenDeleteConfirm(true);
  }, []);

  const handleCloseDeleteConfirm = useCallback(() => {
    setOpenDeleteConfirm(false);
    setUserToDelete(null);
  }, []);

  return {
    dialogState,
    handleOpenDialog,
    handleCloseDialog,
    openDeleteConfirm,
    handleOpenDeleteConfirm,
    handleCloseDeleteConfirm,
    userToDelete,
  };
};
