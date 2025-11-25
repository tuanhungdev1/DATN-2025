/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useBookingActions.ts
import { useCallback } from "react";
import {
  useCreateBookingMutation,
  useUpdateBookingMutation,
  useCancelBookingMutation,
  useConfirmBookingMutation,
  useRejectBookingMutation,
  useCheckInMutation,
  useCheckOutMutation,
  useMarkAsCompletedMutation,
  useMarkAsNoShowMutation,
} from "@/services/endpoints/booking.api";
import { useToast } from "@/hooks/useToast";
import type {
  CreateBooking,
  UpdateBooking,
  CancelBooking,
} from "@/types/booking.types";

export const useBookingActions = (refetch: () => void) => {
  const toast = useToast();

  const [createBooking] = useCreateBookingMutation();
  const [updateBooking] = useUpdateBookingMutation();
  const [cancelBooking] = useCancelBookingMutation();
  const [confirmBooking] = useConfirmBookingMutation();
  const [rejectBooking] = useRejectBookingMutation();
  const [checkIn] = useCheckInMutation();
  const [checkOut] = useCheckOutMutation();
  const [markAsCompleted] = useMarkAsCompletedMutation();
  const [markAsNoShow] = useMarkAsNoShowMutation();

  // Create booking
  const handleCreateBooking = useCallback(
    async (data: CreateBooking) => {
      try {
        const response = await createBooking(data).unwrap();
        toast.success("Đặt phòng thành công");
        refetch();
        return response.data;
      } catch (error: any) {
        console.error("Create booking error:", error);
        const errorMessage =
          error?.data?.message || error?.message || "Đặt phòng thất bại";
        toast.error(errorMessage);
        return null;
      }
    },
    [createBooking, toast, refetch]
  );

  // Update booking
  const handleUpdateBooking = useCallback(
    async (id: number, data: UpdateBooking) => {
      try {
        await updateBooking({ id, data }).unwrap();
        toast.success("Cập nhật đặt phòng thành công");
        refetch();
        return true;
      } catch (error: any) {
        console.error("Update booking error:", error);
        const errorMessage =
          error?.data?.message ||
          error?.message ||
          "Cập nhật đặt phòng thất bại";
        toast.error(errorMessage);
        return false;
      }
    },
    [updateBooking, toast, refetch]
  );

  // Cancel booking
  const handleCancelBooking = useCallback(
    async (id: number, data: CancelBooking) => {
      try {
        await cancelBooking({ id, data }).unwrap();
        toast.success("Hủy đặt phòng thành công");
        refetch();
        return true;
      } catch (error: any) {
        console.error("Cancel booking error:", error);
        const errorMessage =
          error?.data?.message || error?.message || "Hủy đặt phòng thất bại";
        toast.error(errorMessage);
        return false;
      }
    },
    [cancelBooking, toast, refetch]
  );

  // Confirm booking
  const handleConfirmBooking = useCallback(
    async (id: number) => {
      try {
        await confirmBooking(id).unwrap();
        toast.success("Xác nhận đặt phòng thành công");
        refetch();
        return true;
      } catch (error: any) {
        console.error("Confirm booking error:", error);
        const errorMessage =
          error?.data?.message ||
          error?.message ||
          "Xác nhận đặt phòng thất bại";
        toast.error(errorMessage);
        return false;
      }
    },
    [confirmBooking, toast, refetch]
  );

  // Reject booking
  const handleRejectBooking = useCallback(
    async (id: number, reason: string) => {
      try {
        await rejectBooking({ id, reason }).unwrap();
        toast.success("Từ chối đặt phòng thành công");
        refetch();
        return true;
      } catch (error: any) {
        console.error("Reject booking error:", error);
        const errorMessage =
          error?.data?.message ||
          error?.message ||
          "Từ chối đặt phòng thất bại";
        toast.error(errorMessage);
        return false;
      }
    },
    [rejectBooking, toast, refetch]
  );

  // Check-in
  const handleCheckIn = useCallback(
    async (id: number) => {
      try {
        await checkIn(id).unwrap();
        toast.success("Check-in thành công");
        refetch();
        return true;
      } catch (error: any) {
        console.error("Check-in error:", error);
        const errorMessage =
          error?.data?.message || error?.message || "Check-in thất bại";
        toast.error(errorMessage);
        return false;
      }
    },
    [checkIn, toast, refetch]
  );

  // Check-out
  const handleCheckOut = useCallback(
    async (id: number) => {
      try {
        await checkOut(id).unwrap();
        toast.success("Check-out thành công");
        refetch();
        return true;
      } catch (error: any) {
        console.error("Check-out error:", error);
        const errorMessage =
          error?.data?.message || error?.message || "Check-out thất bại";
        toast.error(errorMessage);
        return false;
      }
    },
    [checkOut, toast, refetch]
  );

  // Mark as completed
  const handleMarkAsCompleted = useCallback(
    async (id: number) => {
      try {
        await markAsCompleted(id).unwrap();
        toast.success("Đánh dấu hoàn thành thành công");
        refetch();
        return true;
      } catch (error: any) {
        console.error("Mark as completed error:", error);
        const errorMessage =
          error?.data?.message ||
          error?.message ||
          "Đánh dấu hoàn thành thất bại";
        toast.error(errorMessage);
        return false;
      }
    },
    [markAsCompleted, toast, refetch]
  );

  // Mark as no-show
  const handleMarkAsNoShow = useCallback(
    async (id: number) => {
      try {
        await markAsNoShow(id).unwrap();
        toast.success("Đánh dấu không đến thành công");
        refetch();
        return true;
      } catch (error: any) {
        console.error("Mark as no-show error:", error);
        const errorMessage =
          error?.data?.message ||
          error?.message ||
          "Đánh dấu không đến thất bại";
        toast.error(errorMessage);
        return false;
      }
    },
    [markAsNoShow, toast, refetch]
  );

  return {
    handleCreateBooking,
    handleUpdateBooking,
    handleCancelBooking,
    handleConfirmBooking,
    handleRejectBooking,
    handleCheckIn,
    handleCheckOut,
    handleMarkAsCompleted,
    handleMarkAsNoShow,
  };
};
