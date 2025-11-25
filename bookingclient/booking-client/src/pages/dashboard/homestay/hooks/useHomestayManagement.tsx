/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useHomestayManagement.ts
import { useState, useCallback } from "react";
import type { Homestay, HomestayFilter } from "@/types/homestay.types";

interface DialogState {
  open: boolean;
  mode: "create" | "edit" | "view";
  homestay: Homestay | null;
}

interface DeleteConfirmState {
  open: boolean;
  homestay: Homestay | null;
}

interface ApproveRejectState {
  open: boolean;
  mode: "approve" | "reject";
  homestay: Homestay | null;
}

export const useHomestayManagement = () => {
  // Filter state
  const [filters, setFilters] = useState<HomestayFilter>({
    search: "",
    pageNumber: 1,
    pageSize: 10,
  });

  // Pagination state
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Dialog states
  const [dialogState, setDialogState] = useState<DialogState>({
    open: false,
    mode: "create",
    homestay: null,
  });

  const [deleteConfirmState, setDeleteConfirmState] =
    useState<DeleteConfirmState>({
      open: false,
      homestay: null,
    });

  const [approveRejectState, setApproveRejectState] =
    useState<ApproveRejectState>({
      open: false,
      mode: "approve",
      homestay: null,
    });

  // Filter handlers
  const handleSetFilter = useCallback(
    (key: keyof HomestayFilter, value: any) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
        pageNumber: 1, // Reset to first page when filtering
      }));
      setPageNumber(1);
    },
    []
  );

  const handleSetFilters = useCallback(
    (newFilters: Partial<HomestayFilter>) => {
      setFilters((prev) => ({
        ...prev,
        ...newFilters,
        pageNumber: 1,
      }));
      setPageNumber(1);
    },
    []
  );

  const handleClearFilters = useCallback(() => {
    setFilters({
      search: "",
      pageNumber: 1,
      pageSize: 10,
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
    (mode: "create" | "edit" | "view", homestay?: Homestay) => {
      setDialogState({
        open: true,
        mode,
        homestay: homestay || null,
      });
    },
    []
  );

  const handleCloseDialog = useCallback(() => {
    setDialogState({
      open: false,
      mode: "create",
      homestay: null,
    });
  }, []);

  // Delete confirm handlers
  const handleOpenDeleteConfirm = useCallback((homestay: Homestay) => {
    setDeleteConfirmState({
      open: true,
      homestay,
    });
  }, []);

  const handleCloseDeleteConfirm = useCallback(() => {
    setDeleteConfirmState({
      open: false,
      homestay: null,
    });
  }, []);

  // Approve/Reject handlers
  const handleOpenApproveReject = useCallback(
    (mode: "approve" | "reject", homestay: Homestay) => {
      setApproveRejectState({
        open: true,
        mode,
        homestay,
      });
    },
    []
  );

  const handleCloseApproveReject = useCallback(() => {
    setApproveRejectState({
      open: false,
      mode: "approve",
      homestay: null,
    });
  }, []);

  return {
    // States
    filters,
    pageNumber,
    pageSize,
    dialogState,
    deleteConfirmState,
    approveRejectState,

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

    // Delete handlers
    handleOpenDeleteConfirm,
    handleCloseDeleteConfirm,

    // Approve/Reject handlers
    handleOpenApproveReject,
    handleCloseApproveReject,
  };
};
