/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/admin/UserManagement/hooks/useUserManagement.ts
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import {
  setFilter,
  setFilters,
  clearFilters,
  setPageNumber,
  setPageSize,
  openDialog,
  closeDialog,
  openDeleteConfirm,
  closeDeleteConfirm,
  setSubmitting,
  setDialogUser,
} from "@/store/slices/userManagementSlice";
import type { User, UserFilters } from "@/types/user.types";
import { useEffect, useRef } from "react";

export const useUserManagement = () => {
  const dispatch = useDispatch();
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const filters = useSelector(
    (state: RootState) => state.userManagement.filters
  );
  const pageNumber = useSelector(
    (state: RootState) => state.userManagement.pageNumber
  );
  const pageSize = useSelector(
    (state: RootState) => state.userManagement.pageSize
  );
  const dialogState = useSelector(
    (state: RootState) => state.userManagement.dialog
  );
  const deleteConfirmState = useSelector(
    (state: RootState) => state.userManagement.deleteConfirm
  );
  const isSubmitting = useSelector(
    (state: RootState) => state.userManagement.isSubmitting
  );

  const selectedUser = useSelector(
    (state: RootState) => state.userManagement.dialog.user
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);
  return {
    // Filters
    filters,
    handleSetFilter: <K extends keyof UserFilters>(
      key: K,
      value: UserFilters[K],
      debounceMs: number = 0
    ) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      if (debounceMs > 0) {
        debounceTimerRef.current = setTimeout(() => {
          dispatch(setFilter({ key, value }));
          debounceTimerRef.current = null;
        }, debounceMs);
      } else {
        dispatch(setFilter({ key, value }));
      }
    },
    handleSetFilters: (newFilters: Partial<UserFilters>) => {
      dispatch(setFilters(newFilters));
    },
    handleClearFilters: () => {
      dispatch(clearFilters());
    },

    // Pagination
    pageNumber,
    pageSize,
    handleSetPageNumber: (page: number) => {
      dispatch(setPageNumber(page));
    },
    handleSetPageSize: (size: number) => {
      dispatch(setPageSize(size));
    },

    // Dialog
    dialogState,
    handleOpenDialog: (mode: "create" | "edit" | "view", user?: any) => {
      dispatch(openDialog({ mode, user }));
    },
    handleCloseDialog: () => {
      dispatch(closeDialog());
    },

    // Delete confirm
    deleteConfirmState,
    handleOpenDeleteConfirm: (user: any) => {
      dispatch(openDeleteConfirm(user));
    },
    handleCloseDeleteConfirm: () => {
      dispatch(closeDeleteConfirm());
    },

    // Submitting
    isSubmitting,
    handleSetSubmitting: (value: boolean) => {
      dispatch(setSubmitting(value));
    },

    selectedUser,
    handleSetSelectedUser: (user: User) => {
      dispatch(setDialogUser(user));
    },
  };
};
