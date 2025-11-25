/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/admin/ReviewManagement/hooks/useReviewActions.ts
import { useCallback } from "react";
import {
  useToggleReviewVisibilityMutation,
  useDeleteReviewMutation,
} from "@/services/endpoints/review.api";
import { useToast } from "@/hooks/useToast";
import type { Review } from "@/types/review.types";

export const useReviewActions = (refetch: () => void) => {
  const toast = useToast();

  const [toggleVisibility] = useToggleReviewVisibilityMutation();
  const [deleteReview] = useDeleteReviewMutation();

  const handleToggleVisibility = useCallback(
    async (reviewId: number) => {
      try {
        const result = await toggleVisibility(reviewId).unwrap();
        if (result.success) {
          toast.success("Đã cập nhật trạng thái hiển thị");
          refetch();
        }
      } catch (error: any) {
        toast.error(
          error?.data?.message || "Không thể cập nhật trạng thái hiển thị"
        );
      }
    },
    [toggleVisibility, toast, refetch]
  );

  const handleDeleteReview = useCallback(
    async (reviewId: number): Promise<boolean> => {
      try {
        const result = await deleteReview(reviewId).unwrap();
        if (result.success) {
          toast.success("Đã xóa đánh giá thành công");
          return true;
        }
        return false;
      } catch (error: any) {
        toast.error(error?.data?.message || "Không thể xóa đánh giá");
        return false;
      }
    },
    [deleteReview, toast]
  );

  const handleViewHostResponse = useCallback(
    (review: Review) => {
      // Open dialog hoặc navigate để xem chi tiết phản hồi
      toast.info(`Phản hồi: ${review.hostResponse}`);
    },
    [toast]
  );

  return {
    handleToggleVisibility,
    handleDeleteReview,
    handleViewHostResponse,
  };
};
