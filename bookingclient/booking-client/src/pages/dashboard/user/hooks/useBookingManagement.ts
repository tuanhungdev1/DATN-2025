/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useBookingManagement.ts
import { useState, useCallback } from "react";
import type { Booking, BookingFilter } from "@/types/booking.types";

interface DialogState {
  open: boolean;
  mode: "create" | "edit" | "view" | "cancel";
  booking: Booking | null;
}

export const useBookingManagement = () => {
  // Filter state
  const [filters, setFilters] = useState<BookingFilter>({
    pageNumber: 1,
    pageSize: 10,
    sortBy: "createdAt",
    sortDirection: "desc",
  });

  // Pagination state
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Dialog states
  const [dialogState, setDialogState] = useState<DialogState>({
    open: false,
    mode: "create",
    booking: null,
  });

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Filter handlers
  const handleSetFilter = useCallback(
    (key: keyof BookingFilter, value: any) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
        pageNumber: 1,
      }));
      setPageNumber(1);
    },
    []
  );

  const handleSetFilters = useCallback((newFilters: Partial<BookingFilter>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      pageNumber: 1,
    }));
    setPageNumber(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      pageNumber: 1,
      pageSize: 10,
      sortBy: "createdAt",
      sortDirection: "desc",
    });
    setPageNumber(1);
  }, []);

  // Pagination handlers
  const handleSetPageNumber = useCallback((page: number) => {
    setPageNumber(page);
    setFilters((prev) => ({
      ...prev,
      pageNumber: page,
    }));
  }, []);

  const handleSetPageSize = useCallback((size: number) => {
    setPageSize(size);
    setPageNumber(1);
    setFilters((prev) => ({
      ...prev,
      pageSize: size,
      pageNumber: 1,
    }));
  }, []);

  // Dialog handlers
  const handleOpenDialog = useCallback(
    (mode: "create" | "edit" | "view" | "cancel", booking?: Booking) => {
      setDialogState({
        open: true,
        mode,
        booking: booking || null,
      });
    },
    []
  );

  const handleCloseDialog = useCallback(() => {
    setDialogState({
      open: false,
      mode: "create",
      booking: null,
    });
  }, []);

  const handleOpenRejectDialog = useCallback((booking: Booking) => {
    setSelectedBooking(booking);
    setRejectDialogOpen(true);
  }, []);

  const handleCloseRejectDialog = useCallback(() => {
    setSelectedBooking(null);
    setRejectDialogOpen(false);
  }, []);

  // Cancel dialog handlers
  const handleOpenCancelDialog = useCallback((booking: Booking) => {
    setSelectedBooking(booking);
    setCancelDialogOpen(true);
  }, []);

  const handleCloseCancelDialog = useCallback(() => {
    setSelectedBooking(null);
    setCancelDialogOpen(false);
  }, []);

  return {
    // States
    filters,
    pageNumber,
    pageSize,
    dialogState,
    cancelDialogOpen,
    selectedBooking,
    rejectDialogOpen,

    // Filter handlers
    handleSetFilter,
    handleSetFilters,
    handleClearFilters,

    // Pagination handlers
    handleSetPageNumber,
    handleSetPageSize,

    // Dialog handlers
    handleOpenDialog,
    handleCloseDialog,
    handleOpenCancelDialog,
    handleCloseCancelDialog,
    handleOpenRejectDialog,
    handleCloseRejectDialog,
  };
};
