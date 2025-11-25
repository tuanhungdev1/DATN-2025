/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useAdminPaymentActions.ts
import { useCallback } from "react";
import {
  useRefundPaymentMutation,
  useMarkPaymentAsFailedMutation,
} from "@/services/endpoints/payment.api";
import { useToast } from "@/hooks/useToast";

interface UseAdminPaymentActionsParams {
  onSuccess?: () => void;
}

export const useAdminPaymentActions = (
  params?: UseAdminPaymentActionsParams
) => {
  const { onSuccess } = params || {};
  const toast = useToast();

  const [refundTrigger] = useRefundPaymentMutation();
  const [markFailedTrigger] = useMarkPaymentAsFailedMutation();

  const handleAction = useCallback(
    async <T>(
      action: () => ReturnType<typeof refundTrigger | typeof markFailedTrigger>,
      successMsg: string
    ): Promise<boolean> => {
      try {
        await action().unwrap();
        toast.success(successMsg);
        onSuccess?.();
        return true;
      } catch (error: any) {
        toast.error(error?.data?.message || "Thao tác thất bại");
        return false;
      }
    },
    [onSuccess, toast]
  );

  const handleRefundPayment = useCallback(
    async (
      paymentId: number,
      data: { refundAmount: number; refundReason: string }
    ): Promise<boolean> => {
      if (!data.refundReason.trim()) {
        toast.error("Vui lòng nhập lý do hoàn tiền");
        return false;
      }
      if (data.refundAmount <= 0) {
        toast.error("Số tiền hoàn phải lớn hơn 0");
        return false;
      }
      return handleAction(
        () => refundTrigger({ id: paymentId, data }),
        "Hoàn tiền thành công"
      );
    },
    [handleAction, refundTrigger, toast]
  );

  const handleMarkPaymentAsFailed = useCallback(
    async (
      paymentId: number,
      data: { failureReason: string }
    ): Promise<boolean> => {
      if (!data.failureReason.trim()) {
        toast.error("Vui lòng nhập lý do thất bại");
        return false;
      }
      return handleAction(
        () => markFailedTrigger({ id: paymentId, data }),
        "Đã đánh dấu giao dịch thất bại"
      );
    },
    [handleAction, markFailedTrigger, toast]
  );

  return {
    handleRefundPayment,
    handleMarkPaymentAsFailed,
  };
};
