/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { removeToast } from "@/store/slices/toastSlice";
import { useTheme } from "@mui/material";

export const ToastProvider: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { toasts } = useAppSelector((state) => state.toast);

  useEffect(() => {
    toasts.forEach((toastItem) => {
      if (!toastItem.id) return;

      const toastOptions = {
        duration: toastItem.duration,
        position: toastItem.position as any,
        style: {
          background: theme.palette.background.paper,
          color: theme.palette.text.primary,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: theme.shape.borderRadius,
          boxShadow: theme.shadows[4],
          padding: "12px 16px",
          fontSize: "14px",
        },
      };

      switch (toastItem.type) {
        case "success":
          toast.success(toastItem.message, {
            ...toastOptions,
            id: toastItem.id, // Quan trọng: để tránh duplicate
            iconTheme: {
              primary: theme.palette.success.main,
              secondary: "#fff",
            },
          });
          break;
        case "error":
          toast.error(toastItem.message, {
            ...toastOptions,
            id: toastItem.id,
            iconTheme: {
              primary: theme.palette.error.main,
              secondary: "#fff",
            },
          });
          break;
        case "warning":
          toast(toastItem.message, {
            ...toastOptions,
            id: toastItem.id,
            icon: "⚠️",
          });
          break;
        case "info":
          toast(toastItem.message, {
            ...toastOptions,
            id: toastItem.id,
            icon: "ℹ️",
          });
          break;
        case "loading":
          toast.loading(toastItem.message, {
            ...toastOptions,
            id: toastItem.id,
          });
          break;
        default:
          toast(toastItem.message, {
            ...toastOptions,
            id: toastItem.id,
          });
      }

      // Remove toast from Redux sau khi đã hiển thị
      dispatch(removeToast(toastItem.id));
    });
  }, [toasts, theme, dispatch]);

  // Render Toaster container
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerStyle={{
        top: 20,
        right: 20,
      }}
      toastOptions={{
        // Default options cho tất cả toasts
        duration: 3000,
        style: {
          background: theme.palette.background.paper,
          color: theme.palette.text.primary,
        },
      }}
    />
  );
};
