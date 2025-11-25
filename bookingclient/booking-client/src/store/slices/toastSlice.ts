import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ToastType = "success" | "error" | "warning" | "info" | "loading";

export interface ToastOptions {
  id?: string;
  type: ToastType;
  message: string;
  duration?: number;
  position?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
}

interface ToastState {
  toasts: ToastOptions[];
  defaultDuration: number;
  defaultPosition: ToastOptions["position"];
}

const initialState: ToastState = {
  toasts: [],
  defaultDuration: 3000,
  defaultPosition: "top-right",
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    showToast: (state, action: PayloadAction<Omit<ToastOptions, "id">>) => {
      const toast: ToastOptions = {
        ...action.payload,
        id: Math.random().toString(36).substring(7),
        duration: action.payload.duration || state.defaultDuration,
        position: action.payload.position || state.defaultPosition,
      };
      state.toasts.push(toast);
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(
        (toast) => toast.id !== action.payload
      );
    },
    clearAllToasts: (state) => {
      state.toasts = [];
    },
    setDefaultDuration: (state, action: PayloadAction<number>) => {
      state.defaultDuration = action.payload;
    },
    setDefaultPosition: (
      state,
      action: PayloadAction<ToastOptions["position"]>
    ) => {
      state.defaultPosition = action.payload;
    },
  },
});

export const {
  showToast,
  removeToast,
  clearAllToasts,
  setDefaultDuration,
  setDefaultPosition,
} = toastSlice.actions;

export default toastSlice.reducer;
