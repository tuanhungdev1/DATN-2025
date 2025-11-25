/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/admin/CouponManagement/hooks/useCouponManagement.ts
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setFilter,
  setFilters,
  clearFilters,
  setPageNumber,
  setPageSize,
  openDeleteConfirm,
  closeDeleteConfirm,
} from "@/store/slices/couponManagementSlice";
import type { Coupon, CouponFilter } from "@/types/coupon.types";

export const useCouponManagement = () => {
  const dispatch = useAppDispatch();

  const { filters, pageNumber, pageSize, deleteConfirmState } = useAppSelector(
    (state) => state.coupon
  );

  const handleSetFilter = useCallback(
    (key: keyof CouponFilter, value: any) => {
      dispatch(setFilter({ key, value }));
    },
    [dispatch]
  );

  const handleSetFilters = useCallback(
    (newFilters: CouponFilter) => {
      dispatch(setFilters(newFilters));
    },
    [dispatch]
  );

  const handleClearFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  const handleSetPageNumber = useCallback(
    (page: number) => {
      dispatch(setPageNumber(page));
    },
    [dispatch]
  );

  const handleSetPageSize = useCallback(
    (size: number) => {
      dispatch(setPageSize(size));
    },
    [dispatch]
  );

  const handleOpenDeleteConfirm = useCallback(
    (coupon: Coupon) => {
      dispatch(openDeleteConfirm(coupon));
    },
    [dispatch]
  );

  const handleCloseDeleteConfirm = useCallback(() => {
    dispatch(closeDeleteConfirm());
  }, [dispatch]);

  return {
    filters,
    pageNumber,
    pageSize,
    deleteConfirmState,
    handleSetFilter,
    handleSetFilters,
    handleClearFilters,
    handleSetPageNumber,
    handleSetPageSize,
    handleOpenDeleteConfirm,
    handleCloseDeleteConfirm,
  };
};
