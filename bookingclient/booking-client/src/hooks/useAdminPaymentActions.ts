/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from "react";
import {
  useRefundPaymentMutation,
  useMarkPaymentAsFailedMutation,
} from "@/services/endpoints/payment.api";
import { useToast } from "@/hooks/useToast";
import type { RefundPayment, MarkPaymentFailed } from "@/types/payment.types";

interface UseAdminPaymentActionsProps {
  onSuccess?: () => void;
}

export const useAdminPaymentActions = ({
  onSuccess,
}: UseAdminPaymentActionsProps = {}) => {
  const toast = useToast();

  const [refundPayment, { isLoading: isRefunding }] =
    useRefundPaymentMutation();
  const [markAsFailed, { isLoading: isMarkingFailed }] =
    useMarkPaymentAsFailedMutation();

  // Refund payment
  const handleRefundPayment = useCallback(
    async (paymentId: number, data: RefundPayment): Promise<boolean> => {
      try {
        await refundPayment({ id: paymentId, data }).unwrap();
        toast.success("Hoàn tiền thành công");
        onSuccess?.();
        return true;
      } catch (error: any) {
        const errorMessage =
          error?.data?.message || "Có lỗi xảy ra khi hoàn tiền";
        toast.error(errorMessage);
        return false;
      }
    },
    [refundPayment, toast, onSuccess]
  );

  // Mark payment as failed
  const handleMarkPaymentAsFailed = useCallback(
    async (paymentId: number, data: MarkPaymentFailed): Promise<boolean> => {
      try {
        await markAsFailed({ id: paymentId, data }).unwrap();
        toast.success("Đã đánh dấu thanh toán thất bại");
        onSuccess?.();
        return true;
      } catch (error: any) {
        const errorMessage =
          error?.data?.message ||
          "Có lỗi xảy ra khi đánh dấu thanh toán thất bại";
        toast.error(errorMessage);
        return false;
      }
    },
    [markAsFailed, toast, onSuccess]
  );

  return {
    handleRefundPayment,
    handleMarkPaymentAsFailed,
    isRefunding,
    isMarkingFailed,
  };
};
