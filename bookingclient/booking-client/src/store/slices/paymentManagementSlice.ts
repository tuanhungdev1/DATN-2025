/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PaymentFilter } from "@/types/payment.types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface PaymentManagementState {
  filters: PaymentFilter;
  pageNumber: number;
  pageSize: number;
}

const initialState: PaymentManagementState = {
  filters: {
    sortBy: "createdAt",
    sortDirection: "desc",
  },
  pageNumber: 1,
  pageSize: 10,
};

const paymentManagementSlice = createSlice({
  name: "paymentManagement",
  initialState,
  reducers: {
    setFilter: (
      state,
      action: PayloadAction<{ key: keyof PaymentFilter; value: any }>
    ) => {
      const { key, value } = action.payload;
      state.filters[key] = value as never;
    },
    setFilters: (state, action: PayloadAction<Partial<PaymentFilter>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        sortBy: "createdAt",
        sortDirection: "desc",
      };
    },
    setPageNumber: (state, action: PayloadAction<number>) => {
      state.pageNumber = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    },
  },
});

export const {
  setFilter,
  setFilters,
  clearFilters,
  setPageNumber,
  setPageSize,
} = paymentManagementSlice.actions;
export default paymentManagementSlice.reducer;
