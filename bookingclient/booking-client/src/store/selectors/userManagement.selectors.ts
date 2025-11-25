// src/store/slices/userManagement.selectors.ts
import type { RootState } from "@/store";

export const selectFilters = (state: RootState) => state.userManagement.filters;

export const selectDialogState = (state: RootState) =>
  state.userManagement.dialog;

export const selectDeleteConfirmState = (state: RootState) =>
  state.userManagement.deleteConfirm;

export const selectIsSubmitting = (state: RootState) =>
  state.userManagement.isSubmitting;

export const selectSearchTerm = (state: RootState) =>
  state.userManagement.filters.search;

export const selectPageNumber = (state: RootState) =>
  state.userManagement.filters.pageNumber;

export const selectPageSize = (state: RootState) =>
  state.userManagement.filters.pageSize;

export const selectIsDialogOpen = (state: RootState) =>
  state.userManagement.dialog.open;

export const selectDialogMode = (state: RootState) =>
  state.userManagement.dialog.mode;

export const selectSelectedUser = (state: RootState) =>
  state.userManagement.dialog.user;

export const selectIsDeleteConfirmOpen = (state: RootState) =>
  state.userManagement.deleteConfirm.open;

export const selectUserToDelete = (state: RootState) =>
  state.userManagement.deleteConfirm.user;

export const selectUserDialogData = (state: RootState) =>
  state.userManagement.dialog.user;
