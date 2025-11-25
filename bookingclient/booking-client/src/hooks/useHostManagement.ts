/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/admin/HostManagement/hooks/useHostManagement.ts
import { useState } from "react";
import type { HostProfile, HostProfileFilter } from "@/types/hostProfile.types";

export const useHostManagement = () => {
  const [filters, setFilters] = useState<HostProfileFilter>({
    pageNumber: 1,
    pageSize: 10,
  });

  const [deleteConfirmState, setDeleteConfirmState] = useState<{
    open: boolean;
    host: HostProfile | null;
  }>({
    open: false,
    host: null,
  });

  const [approveRejectState, setApproveRejectState] = useState<{
    open: boolean;
    mode: "approve" | "reject";
    host: HostProfile | null;
  }>({
    open: false,
    mode: "approve",
    host: null,
  });

  const handleSetFilter = (key: keyof HostProfileFilter, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, pageNumber: 1 }));
  };

  const handleSetFilters = (newFilters: HostProfileFilter) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      pageNumber: 1,
      pageSize: 10,
    });
  };

  const handleSetPageNumber = (pageNumber: number) => {
    setFilters((prev) => ({ ...prev, pageNumber }));
  };

  const handleSetPageSize = (pageSize: number) => {
    setFilters((prev) => ({ ...prev, pageSize, pageNumber: 1 }));
  };

  const handleOpenDeleteConfirm = (host: HostProfile) => {
    setDeleteConfirmState({ open: true, host });
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmState({ open: false, host: null });
  };

  const handleOpenApproveReject = (
    mode: "approve" | "reject",
    host: HostProfile
  ) => {
    setApproveRejectState({ open: true, mode, host });
  };

  const handleCloseApproveReject = () => {
    setApproveRejectState({ open: false, mode: "approve", host: null });
  };

  return {
    filters,
    pageNumber: filters.pageNumber || 1,
    pageSize: filters.pageSize || 10,
    deleteConfirmState,
    approveRejectState,
    handleSetFilter,
    handleSetFilters,
    handleClearFilters,
    handleSetPageNumber,
    handleSetPageSize,
    handleOpenDeleteConfirm,
    handleCloseDeleteConfirm,
    handleOpenApproveReject,
    handleCloseApproveReject,
  };
};
