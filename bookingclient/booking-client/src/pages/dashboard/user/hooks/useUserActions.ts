/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/admin/UserManagement/components/hooks/useUserActions.ts
import {
  useDeleteUserMutation,
  useCreateUserMutation,
  useUpdateUserMutation,
  useChangeUserStatusMutation,
  useLockUserMutation,
  useUnlockUserMutation,
} from "@/services/endpoints/user.api";
import { useToast } from "@/hooks/useToast";
import type { UserProfile, CreateUser, UpdateUser } from "@/types/user.types";

export const useUserActions = (onSuccess?: () => void) => {
  const toast = useToast();

  const [deleteUser] = useDeleteUserMutation();
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [changeUserStatus] = useChangeUserStatusMutation();
  const [lockUser] = useLockUserMutation();
  const [unlockUser] = useUnlockUserMutation();

  const handleCreateUser = async (data: CreateUser) => {
    try {
      toast.loading("Creating user...");
      await createUser(data).unwrap();
      toast.success("User created successfully");
      onSuccess?.();
      return true;
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create user");
      return false;
    }
  };

  const handleUpdateUser = async (id: number, data: UpdateUser) => {
    try {
      toast.loading("Updating user...");
      await updateUser({ id, data }).unwrap();
      toast.success("User updated successfully");
      onSuccess?.();
      return true;
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update user");
      return false;
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      toast.loading("Deleting user...");
      await deleteUser(id).unwrap();
      toast.success("User deleted successfully");
      onSuccess?.();
      return true;
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete user");
      return false;
    }
  };

  const handleToggleUserStatus = async (user: UserProfile) => {
    try {
      toast.loading("Updating user status...");
      await changeUserStatus({
        id: user.id,
        isActive: !user.isActive,
      }).unwrap();
      toast.success("User status updated successfully");
      onSuccess?.();
      return true;
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update user status");
      return false;
    }
  };

  const handleLockUser = async (id: number) => {
    try {
      toast.loading("Locking user...");
      await lockUser(id).unwrap();
      toast.success("User locked successfully");
      onSuccess?.();
      return true;
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to lock user");
      return false;
    }
  };

  const handleUnlockUser = async (id: number) => {
    try {
      toast.loading("Unlocking user...");
      await unlockUser(id).unwrap();
      toast.success("User unlocked successfully");
      onSuccess?.();
      return true;
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to unlock user");
      return false;
    }
  };

  return {
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
    handleToggleUserStatus,
    handleLockUser,
    handleUnlockUser,
  };
};
