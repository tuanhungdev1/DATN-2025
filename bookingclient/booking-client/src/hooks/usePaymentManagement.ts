/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";
import type { Payment, PaymentFilter } from "@/types/payment.types";

export const usePaymentManagement = () => {
  // Filter state
  const [filters, setFilters] = useState<PaymentFilter>({
    pageNumber: 1,
    pageSize: 10,
    sortBy: "createdAt",
    sortDirection: "desc",
  });

  // Pagination
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Dialog states
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [failedDialogOpen, setFailedDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  // Filter handlers
  const handleSetFilter = useCallback(
    (key: keyof PaymentFilter, value: any) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
        pageNumber: 1,
      }));
      setPageNumber(1);
    },
    []
  );

  const handleSetFilters = useCallback((newFilters: Partial<PaymentFilter>) => {
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
    setFilters((prev) => ({ ...prev, pageNumber: page }));
  }, []);

  const handleSetPageSize = useCallback((size: number) => {
    setPageSize(size);
    setPageNumber(1);
    setFilters((prev) => ({ ...prev, pageSize: size, pageNumber: 1 }));
  }, []);

  // Refund dialog handlers
  const handleOpenRefundDialog = useCallback((payment: Payment) => {
    setSelectedPayment(payment);
    setRefundDialogOpen(true);
  }, []);

  const handleCloseRefundDialog = useCallback(() => {
    setSelectedPayment(null);
    setRefundDialogOpen(false);
  }, []);

  // Failed dialog handlers
  const handleOpenFailedDialog = useCallback((payment: Payment) => {
    setSelectedPayment(payment);
    setFailedDialogOpen(true);
  }, []);

  const handleCloseFailedDialog = useCallback(() => {
    setSelectedPayment(null);
    setFailedDialogOpen(false);
  }, []);

  return {
    filters,
    pageNumber,
    pageSize,
    refundDialogOpen,
    failedDialogOpen,
    selectedPayment,
    handleSetFilter,
    handleSetFilters,
    handleClearFilters,
    handleSetPageNumber,
    handleSetPageSize,
    handleOpenRefundDialog,
    handleCloseRefundDialog,
    handleOpenFailedDialog,
    handleCloseFailedDialog,
  };
};
