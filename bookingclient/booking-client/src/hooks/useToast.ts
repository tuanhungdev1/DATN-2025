import { useCallback } from "react";
import { useAppDispatch } from "@/store/hooks";
import {
  showToast,
  type ToastOptions,
  type ToastType,
} from "@/store/slices/toastSlice";

export const useToast = () => {
  const dispatch = useAppDispatch();

  const show = useCallback(
    (options: Omit<ToastOptions, "id" | "type"> & { type: ToastType }) => {
      dispatch(showToast(options));
    },
    [dispatch]
  );

  const success = useCallback(
    (
      message: string,
      options?: Omit<ToastOptions, "id" | "type" | "message">
    ) => {
      dispatch(showToast({ message, type: "success", ...options }));
    },
    [dispatch]
  );

  const error = useCallback(
    (
      message: string,
      options?: Omit<ToastOptions, "id" | "type" | "message">
    ) => {
      dispatch(showToast({ message, type: "error", ...options }));
    },
    [dispatch]
  );

  const warning = useCallback(
    (
      message: string,
      options?: Omit<ToastOptions, "id" | "type" | "message">
    ) => {
      dispatch(showToast({ message, type: "warning", ...options }));
    },
    [dispatch]
  );

  const info = useCallback(
    (
      message: string,
      options?: Omit<ToastOptions, "id" | "type" | "message">
    ) => {
      dispatch(showToast({ message, type: "info", ...options }));
    },
    [dispatch]
  );

  const loading = useCallback(
    (
      message: string,
      options?: Omit<ToastOptions, "id" | "type" | "message">
    ) => {
      dispatch(showToast({ message, type: "loading", ...options }));
    },
    [dispatch]
  );

  return {
    show,
    success,
    error,
    warning,
    info,
    loading,
  };
};
