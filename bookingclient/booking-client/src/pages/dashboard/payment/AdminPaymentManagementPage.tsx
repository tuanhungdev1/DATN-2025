/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/admin/PaymentManagement/AdminPaymentManagementPage.tsx
import React, { useCallback, useState } from "react";
import { alpha, Box, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

import {
  useGetAllPaymentsQuery,
  useLazyExportPaymentsToCSVQuery,
  useLazyExportPaymentsToExcelQuery,
  useLazyExportPaymentsToPdfQuery,
} from "@/services/endpoints/payment.api";
import { useToast } from "@/hooks/useToast";
import { useTableState } from "@/hooks/useTableState";

import { GenericTable, type Column } from "@/components/table/GenericTable";
import {
  GenericTableMenu,
  type MenuAction,
} from "@/components/menu/GenericTableMenu";

import type { Payment } from "@/types/payment.types";

import {
  PaymentMethodDisplay,
  PaymentStatus,
  PaymentStatusColor,
  PaymentStatusDisplay,
} from "@/enums/paymentEnums";

import { Eye, DollarSign, XCircle } from "lucide-react";
import { AdminPaymentToolbar } from "./AdminPaymentToolbar";
import { RefundPaymentDialog } from "./RefundPaymentDialog";
import { MarkPaymentFailedDialog } from "./MarkPaymentFailedDialog";
import { AdminPaymentFilterSidebar } from "./AdminPaymentFilterSidebar";
import { useAdminPaymentActions } from "./useAdminPaymentActions";
import { usePaymentManagement } from "./usePaymentManagement";
import { useExport } from "@/hooks/useExport";

const AdminPaymentManagementPage: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const theme = useTheme();

  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState<
    "paymentAmount" | "createdAt" | "processedAt" | undefined
  >(undefined);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // === HOOKS: Filter, Pagination, Dialogs ===
  const {
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
  } = usePaymentManagement();

  const tableState = useTableState<Payment>();

  const { isExporting, handleExport } = useExport({
    fileName: "payments",
    defaultFileName: "payments",
  });

  const [triggerExcelExport] = useLazyExportPaymentsToExcelQuery();
  const [triggerPdfExport] = useLazyExportPaymentsToPdfQuery();
  const [triggerCsvExport] = useLazyExportPaymentsToCSVQuery();

  const handleExportExcel = async () => {
    await handleExport(() => triggerExcelExport(filters).unwrap(), "excel");
  };

  const handleExportPdf = async () => {
    await handleExport(() => triggerPdfExport(filters).unwrap(), "pdf");
  };

  const handleExportCsv = async () => {
    await handleExport(() => triggerCsvExport(filters).unwrap(), "csv");
  };

  // === API: Get all payments ===
  const {
    data: paymentsData,
    isLoading,
    refetch,
  } = useGetAllPaymentsQuery({
    sortBy: sortBy ? sortBy : undefined,
    sortDirection: sortOrder,
    ...filters,
    pageNumber,
    pageSize,
  });

  const payments = paymentsData?.data?.items || [];
  const totalCount = paymentsData?.data?.totalCount || 0;

  // === ADMIN ACTIONS ===
  const { handleRefundPayment, handleMarkPaymentAsFailed } =
    useAdminPaymentActions({ onSuccess: refetch });

  const columns: Column<Payment>[] = [
    {
      id: "id",
      label: "Mã GD",
      minWidth: 100,
      sortable: false,
      format: (value: any) => (
        <Typography variant="body2" fontWeight={600} color="primary">
          #{value}
        </Typography>
      ),
    },
    {
      id: "booking",
      label: "Mã đặt phòng",
      minWidth: 150,
      sortable: false,
      format: (value: any) => (
        <Typography variant="body2" fontWeight={500}>
          {value?.bookingCode || "-"}
        </Typography>
      ),
    },

    {
      id: "booking",
      label: "Khách hàng",
      minWidth: 150,
      sortable: false,
      format: (value: any) => (
        <Typography variant="body2">{value?.guestName || "-"}</Typography>
      ),
    },
    {
      id: "paymentAmount",
      label: "Số tiền",
      minWidth: 150,
      sortable: true,
      align: "right",
      format: (value: any) => (
        <Typography variant="body2" fontWeight={600} color="primary">
          {value.toLocaleString()} VNĐ
        </Typography>
      ),
    },
    {
      id: "paymentMethod",
      label: "Phương thức",
      minWidth: 150,
      sortable: false,
      format: (value: any) => (
        <Typography variant="body2" fontSize="0.875rem">
          {PaymentMethodDisplay[value as keyof typeof PaymentMethodDisplay] ||
            "-"}
        </Typography>
      ),
    },
    {
      id: "paymentGateway",
      label: "Cổng thanh toán",
      minWidth: 130,
      sortable: false,
      format: (value: any) => (
        <Typography variant="body2">{value || "-"}</Typography>
      ),
    },
    {
      id: "transactionId",
      label: "Mã giao dịch",
      minWidth: 160,
      sortable: false,
      format: (value: any) => (
        <Typography variant="body2">{value || "-"}</Typography>
      ),
    },
    {
      id: "refundAmount",
      label: "Số tiền hoàn",
      minWidth: 100,
      sortable: true,
      align: "right",
      format: (value: any) => (
        <Typography
          variant="body2"
          fontWeight={500}
          color={value > 0 ? "error" : "text.primary"}
        >
          {value > 0 ? `-${value.toLocaleString()} VNĐ` : "0 VNĐ"}
        </Typography>
      ),
    },

    {
      id: "paymentStatus",
      label: "Trạng thái",
      minWidth: 150,
      sortable: false,
      align: "center",
      format: (value: any) => {
        const borderColor =
          PaymentStatusColor[value as PaymentStatus] || theme.palette.grey[500];
        const bgColor = alpha(borderColor, 0.1);
        return (
          <Box
            sx={{
              border: `1px solid ${borderColor}`,
              backgroundColor: bgColor,
              padding: "4px 12px",
              borderRadius: "4px",
              fontSize: "0.813rem",
              fontWeight: 600,
              color: borderColor,
              display: "inline-block",
              whiteSpace: "nowrap",
            }}
          >
            {PaymentStatusDisplay[value as PaymentStatus]}
          </Box>
        );
      },
    },
    {
      id: "processedAt",
      label: "Thời gian xử lý",
      minWidth: 160,
      sortable: true,
      format: (value: any) =>
        value ? (
          <Typography variant="body2">
            {new Date(value).toLocaleString("vi-VN")}
          </Typography>
        ) : (
          "-"
        ),
    },
    {
      id: "createdAt",
      label: "Ngày tạo",
      minWidth: 140,
      sortable: true,
      format: (value: any) => (
        <Typography variant="body2">
          {new Date(value).toLocaleDateString("vi-VN")}
        </Typography>
      ),
    },
  ];

  // === MENU ACTIONS ===
  const getMenuActions = (): MenuAction<Payment>[] => {
    const actions: MenuAction<Payment>[] = [
      {
        label: "Xem chi tiết",
        icon: <Eye className="w-4 h-4" />,
        onClick: (payment: Payment) => {
          navigate(`/admin/payments/${payment.id}`);
        },
      },
    ];

    const status = tableState.selectedItem?.paymentStatus;

    if (status === PaymentStatus.Completed) {
      actions.push({
        label: "Hoàn tiền",
        icon: <DollarSign className="w-4 h-4 text-green-600" />,
        onClick: (payment: Payment) => handleOpenRefundDialog(payment),
        color: "success",
      });
    }

    if (
      status === PaymentStatus.Pending ||
      status === PaymentStatus.Processing
    ) {
      actions.push({
        label: "Đánh dấu thất bại",
        icon: <XCircle className="w-4 h-4 text-red-600" />,
        onClick: (payment: Payment) => handleOpenFailedDialog(payment),
        color: "error",
        divider: true,
      });
    }

    return actions;
  };

  // === SORT HANDLER ===
  const handleSort = useCallback(
    (columnId: keyof Payment, order: "asc" | "desc") => {
      if (
        columnId === "paymentAmount" ||
        columnId === "createdAt" ||
        columnId === "processedAt"
      ) {
        setSortBy(columnId);
        setSortOrder(order);
        handleSetPageNumber(1);
      }
    },
    [handleSetPageNumber]
  );

  // === SEARCH HANDLER ===
  const handleSearchChange = useCallback(
    (value: string) => {
      handleSetFilter("bookingCode", value);
    },
    [handleSetFilter]
  );

  // === FILTER HANDLERS ===
  const handleApplyFilters = useCallback(
    (newFilters: any) => {
      handleSetFilters(newFilters);
      setIsFilterSidebarOpen(false);
      toast.success("Đã áp dụng bộ lọc");
    },
    [handleSetFilters, toast]
  );

  const handleClearAllFilters = useCallback(() => {
    handleClearFilters();
    setIsFilterSidebarOpen(false);
    toast.success("Đã xóa bộ lọc");
  }, [handleClearFilters, toast]);

  // === DIALOG CONFIRM HANDLERS ===
  const handleConfirmRefund = useCallback(
    async (amount: number, reason: string) => {
      if (selectedPayment) {
        const success = await handleRefundPayment(selectedPayment.id, {
          refundAmount: amount,
          refundReason: reason,
        });
        if (success) {
          handleCloseRefundDialog();
          refetch();
        }
      }
    },
    [selectedPayment, handleRefundPayment, handleCloseRefundDialog, refetch]
  );

  const handleConfirmFailed = useCallback(
    async (reason: string) => {
      if (selectedPayment) {
        const success = await handleMarkPaymentAsFailed(selectedPayment.id, {
          failureReason: reason,
        });
        if (success) {
          handleCloseFailedDialog();
          refetch();
        }
      }
    },
    [
      selectedPayment,
      handleMarkPaymentAsFailed,
      handleCloseFailedDialog,
      refetch,
    ]
  );

  // === PAGINATION HANDLERS ===
  const handlePageChange = useCallback(
    (_event: unknown, newPage: number) => {
      handleSetPageNumber(newPage + 1);
    },
    [handleSetPageNumber]
  );

  const handlePageSizeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newPageSize = parseInt(event.target.value, 10);
      handleSetPageSize(newPageSize);
    },
    [handleSetPageSize]
  );

  return (
    <Box sx={{ py: 2 }}>
      <Box
        sx={{
          boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
          borderRadius: "10px",
          px: 3,
          py: 2,
          bgcolor: "white",
        }}
      >
        <Typography variant="h4" fontSize="28px" mb={4} pt={2}>
          Quản lý Thanh toán
        </Typography>

        <AdminPaymentToolbar
          searchTerm={filters.bookingCode || ""}
          onSearchChange={handleSearchChange}
          onRefresh={() => refetch()}
          onExportExcel={handleExportExcel}
          onExportPdf={handleExportPdf}
          onExportCsv={handleExportCsv}
          isExporting={isExporting}
          isLoading={isLoading}
          onToggleFilters={() => setIsFilterSidebarOpen(true)}
        />

        <GenericTable<Payment>
          columns={columns}
          data={payments}
          totalCount={totalCount}
          pageNumber={pageNumber}
          pageSize={pageSize}
          isLoading={isLoading}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onActionClick={tableState.handleOpenMenu}
          onSort={handleSort}
        />
      </Box>

      {/* MENU */}
      <GenericTableMenu<Payment>
        anchorEl={tableState.anchorEl}
        open={tableState.isMenuOpen}
        item={tableState.selectedItem}
        onClose={tableState.handleCloseMenu}
        actions={getMenuActions()}
      />

      {/* DIALOGS */}
      <RefundPaymentDialog
        open={refundDialogOpen}
        payment={selectedPayment}
        onConfirm={handleConfirmRefund}
        onCancel={handleCloseRefundDialog}
      />

      <MarkPaymentFailedDialog
        open={failedDialogOpen}
        payment={selectedPayment}
        onConfirm={handleConfirmFailed}
        onCancel={handleCloseFailedDialog}
      />

      {/* FILTER SIDEBAR */}
      <AdminPaymentFilterSidebar
        open={isFilterSidebarOpen}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearAllFilters}
        onClose={() => setIsFilterSidebarOpen(false)}
        initialFilters={filters}
      />
    </Box>
  );
};

export default AdminPaymentManagementPage;
