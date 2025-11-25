/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/usePaymentManagement.ts
import { useState, useCallback } from "react";
import type { Payment, PaymentFilter } from "@/types/payment.types";

export const usePaymentManagement = () => {
  const [filters, setFilters] = useState<PaymentFilter>({
    pageNumber: 1,
    pageSize: 10,
    sortBy: "createdAt",
    sortDirection: "desc",
  });

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [failedDialogOpen, setFailedDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  // === FILTER HANDLERS ===
  const handleSetFilter = useCallback(
    (key: keyof PaymentFilter, value: any) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value === "" || value === null ? undefined : value,
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

  // === PAGINATION HANDLERS ===
  const handleSetPageNumber = useCallback((page: number) => {
    setPageNumber(page);
    setFilters((prev) => ({ ...prev, pageNumber: page }));
  }, []);

  const handleSetPageSize = useCallback((size: number) => {
    setPageSize(size);
    setPageNumber(1);
    setFilters((prev) => ({ ...prev, pageSize: size, pageNumber: 1 }));
  }, []);

  // === DIALOG HANDLERS ===
  const handleOpenRefundDialog = useCallback((payment: Payment) => {
    setSelectedPayment(payment);
    setRefundDialogOpen(true);
  }, []);

  const handleCloseRefundDialog = useCallback(() => {
    setSelectedPayment(null);
    setRefundDialogOpen(false);
  }, []);

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
