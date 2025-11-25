/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setFilter,
  setFilters,
  clearFilters,
  setPageNumber,
  setPageSize,
} from "@/store/slices/paymentManagementSlice";
import type { PaymentFilter } from "@/types/payment.types";

export const usePaymentManagement = () => {
  const dispatch = useAppDispatch();
  const { filters, pageNumber, pageSize } = useAppSelector(
    (state) => state.myPayment
  );

  const handleSetFilter = (key: keyof PaymentFilter, value: any) => {
    dispatch(setFilter({ key, value }));
  };

  const handleSetFilters = (newFilters: Partial<PaymentFilter>) => {
    dispatch(setFilters(newFilters));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const handleSetPageNumber = (page: number) => {
    dispatch(setPageNumber(page));
  };

  const handleSetPageSize = (size: number) => {
    dispatch(setPageSize(size));
  };

  return {
    filters,
    pageNumber,
    pageSize,
    handleSetFilter,
    handleSetFilters,
    handleClearFilters,
    handleSetPageNumber,
    handleSetPageSize,
  };
};
