/* eslint-disable @typescript-eslint/no-explicit-any */
// src/store/slices/couponManagementSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Coupon, CouponFilter } from "@/types/coupon.types";

interface CouponManagementState {
  filters: CouponFilter;
  pageNumber: number;
  pageSize: number;
  deleteConfirmState: {
    open: boolean;
    coupon: Coupon | null;
  };
}

const initialState: CouponManagementState = {
  filters: {
    searchTerm: "",
    pageNumber: 1,
    pageSize: 10,
    sortDirection: "desc",
  },
  pageNumber: 1,
  pageSize: 10,
  deleteConfirmState: {
    open: false,
    coupon: null,
  },
};

const couponManagementSlice = createSlice({
  name: "couponManagement",
  initialState,
  reducers: {
    setFilter: (
      state,
      action: PayloadAction<{ key: keyof CouponFilter; value: any }>
    ) => {
      const { key, value } = action.payload;
      (state.filters as any)[key] = value;
    },
    setFilters: (state, action: PayloadAction<CouponFilter>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        searchTerm: "",
        pageNumber: 1,
        pageSize: 10,
        sortDirection: "desc",
      };
      state.pageNumber = 1;
    },
    setPageNumber: (state, action: PayloadAction<number>) => {
      state.pageNumber = action.payload;
      state.filters.pageNumber = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.filters.pageSize = action.payload;
      state.pageNumber = 1;
      state.filters.pageNumber = 1;
    },
    openDeleteConfirm: (state, action: PayloadAction<Coupon>) => {
      state.deleteConfirmState = {
        open: true,
        coupon: action.payload,
      };
    },
    closeDeleteConfirm: (state) => {
      state.deleteConfirmState = {
        open: false,
        coupon: null,
      };
    },
  },
});

export const {
  setFilter,
  setFilters,
  clearFilters,
  setPageNumber,
  setPageSize,
  openDeleteConfirm,
  closeDeleteConfirm,
} = couponManagementSlice.actions;

export default couponManagementSlice.reducer;
