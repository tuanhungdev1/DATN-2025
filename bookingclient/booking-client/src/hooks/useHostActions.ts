/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/admin/HostManagement/hooks/useHostActions.ts
import { useCallback } from "react";
import {
  useRemoveHostProfileMutation,
  useApproveHostProfileMutation,
  useRejectHostProfileMutation,
  useReviewHostProfileMutation,
} from "@/services/endpoints/hostProfile.api";
import { useToast } from "@/hooks/useToast";

export const useHostActions = (refetch: () => void) => {
  const toast = useToast();

  const [removeHost] = useRemoveHostProfileMutation();
  const [approveHost] = useApproveHostProfileMutation();
  const [rejectHost] = useRejectHostProfileMutation();
  const [reviewHost] = useReviewHostProfileMutation();

  const handleDeleteHost = useCallback(
    async (userId: number) => {
      try {
        await removeHost(userId).unwrap();
        toast.success("Đã xóa host thành công");
        refetch();
        return true;
      } catch (error: any) {
        toast.error(error?.data?.message || "Không thể xóa host");
        return false;
      }
    },
    [removeHost, toast, refetch]
  );

  const handleApproveHost = useCallback(
    async (id: number, note?: string) => {
      try {
        await approveHost({
          id,
          data: { note },
        }).unwrap();
        toast.success("Đã duyệt host thành công");
        refetch();
        return true;
      } catch (error: any) {
        toast.error(error?.data?.message || "Không thể duyệt host");
        return false;
      }
    },
    [approveHost, toast, refetch]
  );

  const handleRejectHost = useCallback(
    async (id: number, reason: string) => {
      try {
        await rejectHost({
          id,
          data: { reason },
        }).unwrap();
        toast.success("Đã từ chối host");
        refetch();
        return true;
      } catch (error: any) {
        toast.error(error?.data?.message || "Không thể từ chối host");
        return false;
      }
    },
    [rejectHost, toast, refetch]
  );

  const handleReviewHost = useCallback(
    async (id: number, status: string, note?: string) => {
      try {
        await reviewHost({
          id,
          data: { status, note },
        }).unwrap();
        toast.success("Đã xét duyệt host");
        refetch();
        return true;
      } catch (error: any) {
        toast.error(error?.data?.message || "Không thể xét duyệt host");
        return false;
      }
    },
    [reviewHost, toast, refetch]
  );

  return {
    handleDeleteHost,
    handleApproveHost,
    handleRejectHost,
    handleReviewHost,
  };
};
