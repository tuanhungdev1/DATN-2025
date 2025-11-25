// src/store/slices/userManagementSlice.ts
import type { User, UserFilters } from "@/types/user.types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface DialogState {
  open: boolean;
  mode: "create" | "edit" | "view";
  user?: User | null;
}

export interface DeleteConfirmState {
  open: boolean;
  user?: User | null;
}

export interface UserManagementState {
  filters: UserFilters;
  dialog: DialogState;
  deleteConfirm: DeleteConfirmState;
  isSubmitting: boolean;
  pageNumber: number;
  pageSize: number;
}

const initialState: UserManagementState = {
  filters: {
    search: "",
    sortBy: undefined,
    sortOrder: undefined,
    isActive: undefined,
    isLocked: undefined,
    isEmailConfirmed: undefined,
    roles: undefined,
    createdAtFrom: undefined,
    createdAtTo: undefined,
    pageNumber: 0,
    pageSize: 0,
  },
  pageNumber: 1,
  pageSize: 10,
  dialog: {
    open: false,
    mode: "view",
  },
  deleteConfirm: {
    open: false,
    user: null,
  },
  isSubmitting: false,
};

const userManagementSlice = createSlice({
  name: "userManagement",
  initialState,
  reducers: {
    // Filter actions
    setFilter: <K extends keyof UserFilters>(
      state: {
        filters: {
          [x: string]: string | number | boolean | string[] | undefined;
        };
        pageNumber: number;
      },
      action: PayloadAction<{ key: K; value: UserFilters[K] }>
    ) => {
      state.filters[action.payload.key] = action.payload.value;
      state.pageNumber = 1;
    },
    setDialogUser: (state, action: PayloadAction<User | null>) => {
      state.dialog.user = action.payload;
    },

    setFilters: (state, action: PayloadAction<Partial<UserFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pageNumber = 1;
    },

    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.pageNumber = 1;
    },

    // Pagination actions
    setPageNumber: (state, action: PayloadAction<number>) => {
      state.pageNumber = action.payload;
    },

    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.pageNumber = 1;
    },

    // Dialog actions
    openDialog: (
      state,
      action: PayloadAction<{ mode: "create" | "edit" | "view"; user?: User }>
    ) => {
      state.dialog = {
        open: true,
        mode: action.payload.mode,
        user: action.payload.user,
      };
    },

    closeDialog: (state) => {
      state.dialog = {
        open: false,
        mode: "view",
      };
    },

    // Delete confirm actions
    openDeleteConfirm: (state, action: PayloadAction<User>) => {
      state.deleteConfirm = {
        open: true,
        user: action.payload,
      };
    },

    closeDeleteConfirm: (state) => {
      state.deleteConfirm = {
        open: false,
        user: null,
      };
    },

    // Submitting action
    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload;
    },
  },
});

export const {
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
} = userManagementSlice.actions;

export default userManagementSlice.reducer;
