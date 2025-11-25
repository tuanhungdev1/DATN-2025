/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/user/PaymentManagement/PaymentManagementPage.tsx
import React, { useCallback, useState } from "react";
import { alpha, Box, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";

import { useToast } from "@/hooks/useToast";
import { useTableState } from "@/hooks/useTableState";

import { GenericTable, type Column } from "@/components/table/GenericTable";
import {
  GenericTableMenu,
  type MenuAction,
} from "@/components/menu/GenericTableMenu";

import type { BookingPaymentInfo, Payment } from "@/types/payment.types";
import {
  PaymentMethod,
  PaymentMethodLabels,
  PaymentStatus,
} from "@/enums/payment.enums";

import { MyPaymentToolbar } from "./MyPaymentToolbar";
import { MyPaymentFilterSidebar } from "./MyPaymentFilterSidebar";
import dayjs from "dayjs";
import { PaymentStatusColor, PaymentStatusDisplay } from "@/enums/paymentEnums";
import { usePaymentManagement } from "@/hooks/useMyPaymentManagement";
import { useGetMyPaymentsQuery } from "@/services/endpoints/payment.api";

const MyPaymentManagementPage: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const theme = useTheme();

  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState<
    "createdAt" | "paymentAmount" | "processedAt" | undefined
  >(undefined);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Redux state
  const {
    filters,
    pageNumber,
    pageSize,
    handleSetFilter,
    handleSetFilters,
    handleClearFilters,
    handleSetPageNumber,
    handleSetPageSize,
  } = usePaymentManagement();

  // Table menu
  const tableState = useTableState<Payment>();

  // API Query
  const {
    data: paymentsData,
    isLoading,
    refetch,
  } = useGetMyPaymentsQuery({
    sortBy: sortBy,
    sortDirection: sortOrder,
    ...filters,
    pageNumber,
    pageSize,
  });

  // Data
  const payments = paymentsData?.data?.items || [];
  const totalCount = paymentsData?.data?.totalCount || 0;

  const columns: Column<Payment>[] = [
    {
      id: "transactionId",
      label: "Mã giao dịch",
      minWidth: 100,
      sortable: false,
      format: (value) => (
        <Typography variant="body2" fontWeight={600} color="primary">
          {value}
        </Typography>
      ),
    },
    {
      id: "booking",
      label: "Mã đặt phòng",
      minWidth: 100,
      sortable: false,
      format: (value: BookingPaymentInfo) => (
        <Typography variant="body2" fontWeight={600} color="primary">
          {value.bookingCode}
        </Typography>
      ),
    },

    {
      id: "paymentAmount",
      label: "Số tiền",
      minWidth: 120,
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
      minWidth: 50,
      sortable: false,
      align: "center",
      format: (value: any) => (
        <Typography variant="body2" fontWeight={500}>
          {PaymentMethodLabels[value as PaymentMethod] ?? "Không xác định"}
        </Typography>
      ),
    },

    {
      id: "paymentStatus",
      label: "Trạng thái",
      minWidth: 100,
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
      id: "createdAt",
      label: "Ngày tạo",
      minWidth: 120,
      sortable: true,
      format: (value: any) => (
        <Typography variant="body2">
          {dayjs(value).format("DD/MM/YYYY HH:mm")}
        </Typography>
      ),
    },
  ];

  // Menu actions
  const getMenuActions = (): MenuAction<Payment>[] => {
    return [
      {
        label: "Xem chi tiết",
        icon: <Eye className="w-4 h-4" />,
        onClick: (payment: Payment) => {
          navigate(`${payment.id}`);
        },
      },
    ];
  };

  // Handle sort
  const handleSort = useCallback(
    (columnId: keyof Payment, order: "asc" | "desc") => {
      if (
        columnId === "createdAt" ||
        columnId === "paymentAmount" ||
        columnId === "processedAt"
      ) {
        setSortBy(columnId);
        setSortOrder(order);
        handleSetPageNumber(1);
      }
    },
    [handleSetPageNumber]
  );

  // Handle search
  const handleSearchChange = useCallback(
    (value: string) => {
      handleSetFilter("bookingCode", value);
    },
    [handleSetFilter]
  );

  // Apply filters
  const handleApplyFilters = useCallback(
    (newFilters: any) => {
      handleSetFilters(newFilters);
      setIsFilterSidebarOpen(false);
      toast.success("Đã áp dụng bộ lọc");
    },
    [handleSetFilters, toast]
  );

  // Clear filters
  const handleClearAllFilters = useCallback(() => {
    handleClearFilters();
    setIsFilterSidebarOpen(false);
    toast.success("Đã xóa bộ lọc");
  }, [handleClearFilters, toast]);

  // Handle pagination
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
    <Box>
      <Box>
        <Typography variant="h4" fontSize="28px" mb={4} pt={2}>
          Thanh toán của tôi
        </Typography>

        <MyPaymentToolbar
          searchTerm={filters.bookingCode || ""}
          onSearchChange={handleSearchChange}
          onRefresh={() => refetch()}
          onExportCSV={() => toast.success("Exported")}
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

      <GenericTableMenu<Payment>
        anchorEl={tableState.anchorEl}
        open={tableState.isMenuOpen}
        item={tableState.selectedItem}
        onClose={tableState.handleCloseMenu}
        actions={getMenuActions()}
      />

      <MyPaymentFilterSidebar
        open={isFilterSidebarOpen}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearAllFilters}
        onClose={() => setIsFilterSidebarOpen(false)}
        initialFilters={filters}
      />
    </Box>
  );
};

export default MyPaymentManagementPage;
