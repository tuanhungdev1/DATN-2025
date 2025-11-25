/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/admin/ReviewManagement/hooks/useReviewManagement.ts
import { useState, useCallback } from "react";
import type { Review, ReviewFilter } from "@/types/review.types";

export const useReviewManagement = () => {
  const [filters, setFilters] = useState<ReviewFilter>({
    pageNumber: 1,
    pageSize: 10,
    sortBy: "CreatedAt",
    sortDirection: "desc",
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const handleSetFilter = useCallback((key: keyof ReviewFilter, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      pageNumber: key !== "pageNumber" ? 1 : prev.pageNumber,
    }));
  }, []);

  const handleSetFilters = useCallback((newFilters: Partial<ReviewFilter>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      pageNumber: 1,
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      pageNumber: 1,
      pageSize: 10,
      sortBy: "CreatedAt",
      sortDirection: "desc",
    });
  }, []);

  const handleSetPageNumber = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, pageNumber: page }));
  }, []);

  const handleSetPageSize = useCallback((size: number) => {
    setFilters((prev) => ({ ...prev, pageSize: size, pageNumber: 1 }));
  }, []);

  const handleOpenDeleteDialog = useCallback((review: Review) => {
    setSelectedReview(review);
    setDeleteDialogOpen(true);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setDeleteDialogOpen(false);
    setSelectedReview(null);
  }, []);

  return {
    filters,
    pageNumber: filters.pageNumber || 1,
    pageSize: filters.pageSize || 10,
    deleteDialogOpen,
    selectedReview,
    handleSetFilter,
    handleSetFilters,
    handleClearFilters,
    handleSetPageNumber,
    handleSetPageSize,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
  };
};
