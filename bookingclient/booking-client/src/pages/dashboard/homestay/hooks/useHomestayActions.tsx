/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useHomestayActions.ts
import { useCallback } from "react";
import {
  useCreateHomestayMutation,
  useUpdateHomestayMutation,
  useDeleteHomestayMutation,
  useApproveHomestayMutation,
  useRejectHomestayMutation,
} from "@/services/endpoints/homestay.api";
import { useToast } from "@/hooks/useToast";
import type { CreateHomestay, UpdateHomestay } from "@/types/homestay.types";

export const useHomestayActions = (refetch: () => void) => {
  const toast = useToast();

  const [createHomestay] = useCreateHomestayMutation();
  const [updateHomestay] = useUpdateHomestayMutation();
  const [deleteHomestay] = useDeleteHomestayMutation();
  const [approveHomestay] = useApproveHomestayMutation();
  const [rejectHomestay] = useRejectHomestayMutation();

  // Create homestay
  const handleCreateHomestay = useCallback(
    async (data: CreateHomestay) => {
      try {
        await createHomestay(data).unwrap();
        toast.success("Homestay created successfully");
        refetch();
        return true;
      } catch (error: any) {
        console.error("Create homestay error:", error);
        const errorMessage =
          error?.data?.message || error?.message || "Failed to create homestay";
        toast.error(errorMessage);
        return false;
      }
    },
    [createHomestay, toast, refetch]
  );

  // Update homestay
  const handleUpdateHomestay = useCallback(
    async (id: number, data: UpdateHomestay) => {
      try {
        await updateHomestay({ id, data }).unwrap();
        toast.success("Homestay updated successfully");
        refetch();
        return true;
      } catch (error: any) {
        console.error("Update homestay error:", error);
        const errorMessage =
          error?.data?.message || error?.message || "Failed to update homestay";
        toast.error(errorMessage);
        return false;
      }
    },
    [updateHomestay, toast, refetch]
  );

  // Delete homestay
  const handleDeleteHomestay = useCallback(
    async (id: number) => {
      try {
        await deleteHomestay(id).unwrap();
        toast.success("Homestay deleted successfully");
        refetch();
        return true;
      } catch (error: any) {
        console.error("Delete homestay error:", error);
        const errorMessage =
          error?.data?.message || error?.message || "Failed to delete homestay";
        toast.error(errorMessage);
        return false;
      }
    },
    [deleteHomestay, toast, refetch]
  );

  // Approve homestay
  const handleApproveHomestay = useCallback(
    async (id: number, approvalNote: string) => {
      try {
        await approveHomestay({
          id,
          data: {
            isApproved: true,
            approvalNote,
            autoActivate: true,
          },
        }).unwrap();
        toast.success("Homestay approved successfully");
        refetch();
        return true;
      } catch (error: any) {
        console.error("Approve homestay error:", error);
        const errorMessage =
          error?.data?.message ||
          error?.message ||
          "Failed to approve homestay";
        toast.error(errorMessage);
        return false;
      }
    },
    [approveHomestay, toast, refetch]
  );

  // Reject homestay
  const handleRejectHomestay = useCallback(
    async (id: number, rejectionReason: string) => {
      try {
        await rejectHomestay({
          id,
          rejectionReason,
        }).unwrap();
        toast.success("Homestay rejected successfully");
        refetch();
        return true;
      } catch (error: any) {
        console.error("Reject homestay error:", error);
        const errorMessage =
          error?.data?.message || error?.message || "Failed to reject homestay";
        toast.error(errorMessage);
        return false;
      }
    },
    [rejectHomestay, toast, refetch]
  );

  return {
    handleCreateHomestay,
    handleUpdateHomestay,
    handleDeleteHomestay,
    handleApproveHomestay,
    handleRejectHomestay,
  };
};
