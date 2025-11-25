/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useReview.ts
import { useCallback } from "react";
import { useToast } from "@/hooks/useToast";
import {
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useAddHostResponseMutation,
  useUpdateHostResponseMutation,
  useDeleteHostResponseMutation,
  useMarkReviewHelpfulMutation,
  useToggleReviewVisibilityMutation,
  useToggleHelpfulMutation,
} from "@/services/endpoints/review.api";
import type {
  CreateReview,
  UpdateReview,
  HostResponse,
} from "@/types/review.types";

export const useReview = () => {
  const { success, error, loading } = useToast();

  // Mutations
  const [createTrigger, createResult] = useCreateReviewMutation();
  const [updateTrigger, updateResult] = useUpdateReviewMutation();
  const [deleteTrigger, deleteResult] = useDeleteReviewMutation();
  const [addResponseTrigger, addResponseResult] = useAddHostResponseMutation();
  const [updateResponseTrigger, updateResponseResult] =
    useUpdateHostResponseMutation();
  const [deleteResponseTrigger, deleteResponseResult] =
    useDeleteHostResponseMutation();
  const [helpfulTrigger, helpfulResult] = useMarkReviewHelpfulMutation();
  const [toggleVisibilityTrigger, toggleVisibilityResult] =
    useToggleReviewVisibilityMutation();
  // SAU (mới)
  const [toggleHelpfulTrigger, toggleHelpfulResult] =
    useToggleHelpfulMutation();

  // === CREATE REVIEW ===
  const createReview = useCallback(
    async (data: CreateReview) => {
      loading("Đang gửi đánh giá...");

      try {
        const result = await createTrigger(data).unwrap();
        success("Đánh giá đã được gửi thành công!");
        return result;
      } catch (err: any) {
        const message =
          err?.data?.message || err?.message || "Gửi đánh giá thất bại";
        error(message);
        throw err;
      }
    },
    [createTrigger, loading, success, error]
  );

  const toggleHelpful = useCallback(
    async (reviewId: number) => {
      try {
        const result = await toggleHelpfulTrigger(reviewId).unwrap();
        if (result.data && result.data.isNowHelpful) {
          success("Cảm ơn bạn đã đánh giá hữu ích!");
        } else {
          success("Đã hủy đánh dấu hữu ích");
        }
        return result.data;
      } catch (err: any) {
        const message = err?.data?.message || "Không thể thay đổi đánh dấu";
        error(message);
        throw err;
      }
    },
    [toggleHelpfulTrigger, success, error]
  );

  // === UPDATE REVIEW ===
  const updateReview = useCallback(
    async (id: number, data: UpdateReview) => {
      loading("Đang cập nhật đánh giá...");

      try {
        const result = await updateTrigger({ id, data }).unwrap();
        success("Cập nhật đánh giá thành công!");
        return result;
      } catch (err: any) {
        const message =
          err?.data?.message || err?.message || "Cập nhật thất bại";
        error(message);
        throw err;
      }
    },
    [updateTrigger, loading, success, error]
  );

  // === DELETE REVIEW ===
  const deleteReview = useCallback(
    async (id: number) => {
      loading("Đang xóa đánh giá...");

      try {
        await deleteTrigger(id).unwrap();
        success("Xóa đánh giá thành công!");
        return true;
      } catch (err: any) {
        const message = err?.data?.message || "Xóa thất bại";
        error(message);
        throw err;
      }
    },
    [deleteTrigger, loading, success, error]
  );

  // === ADD HOST RESPONSE ===
  const addHostResponse = useCallback(
    async (reviewId: number, data: HostResponse) => {
      loading("Đang gửi phản hồi...");

      try {
        await addResponseTrigger({ id: reviewId, data }).unwrap();
        success("Phản hồi đã được gửi!");
        return true;
      } catch (err: any) {
        const message = err?.data?.message || "Gửi phản hồi thất bại";
        error(message);
        throw err;
      }
    },
    [addResponseTrigger, loading, success, error]
  );

  // === UPDATE HOST RESPONSE ===
  const updateHostResponse = useCallback(
    async (reviewId: number, data: HostResponse) => {
      loading("Đang cập nhật phản hồi...");

      try {
        await updateResponseTrigger({ id: reviewId, data }).unwrap();
        success("Cập nhật phản hồi thành công!");
        return true;
      } catch (err: any) {
        const message = err?.data?.message || "Cập nhật thất bại";
        error(message);
        throw err;
      }
    },
    [updateResponseTrigger, loading, success, error]
  );

  // === DELETE HOST RESPONSE ===
  const deleteHostResponse = useCallback(
    async (reviewId: number) => {
      loading("Đang xóa phản hồi...");

      try {
        await deleteResponseTrigger(reviewId).unwrap();
        success("Xóa phản hồi thành công!");
        return true;
      } catch (err: any) {
        const message = err?.data?.message || "Xóa thất bại";
        error(message);
        throw err;
      }
    },
    [deleteResponseTrigger, loading, success, error]
  );

  // === MARK AS HELPFUL ===
  const markAsHelpful = useCallback(
    async (reviewId: number) => {
      try {
        await helpfulTrigger(reviewId).unwrap();
        success("Cảm ơn bạn đã đánh giá hữu ích!");
        return true;
      } catch (err: any) {
        const message = err?.data?.message || "Không thể đánh dấu";
        error(message);
        throw err;
      }
    },
    [helpfulTrigger, success, error]
  );

  // === TOGGLE VISIBILITY (Admin) ===
  const toggleVisibility = useCallback(
    async (reviewId: number) => {
      loading("Đang thay đổi trạng thái hiển thị...");

      try {
        await toggleVisibilityTrigger(reviewId).unwrap();
        success("Thay đổi hiển thị thành công!");
        return true;
      } catch (err: any) {
        const message = err?.data?.message || "Thay đổi thất bại";
        error(message);
        throw err;
      }
    },
    [toggleVisibilityTrigger, loading, success, error]
  );

  // === RETURN ALL HANDLERS + STATES ===
  return {
    // Mutations
    createReview,
    updateReview,
    deleteReview,
    addHostResponse,
    updateHostResponse,
    deleteHostResponse,
    markAsHelpful,
    toggleVisibility,
    toggleHelpful,

    // Mutation States (optional: for loading UI)
    isCreating: createResult.isLoading,
    isUpdating: updateResult.isLoading,
    isDeleting: deleteResult.isLoading,
    isAddingResponse: addResponseResult.isLoading,
    isUpdatingResponse: updateResponseResult.isLoading,
    isDeletingResponse: deleteResponseResult.isLoading,
    isToggling: toggleVisibilityResult.isLoading,
    isTogglingHelpful: toggleHelpfulResult.isLoading,
  };
};
