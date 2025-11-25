/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/user/BookingManagement/BookingManagementPage.tsx
import React, { useCallback, useState } from "react";
import { alpha, Box, Typography, useTheme } from "@mui/material";

import { useNavigate } from "react-router-dom";

import { useGetMyBookingsQuery } from "@/services/endpoints/booking.api";
import { useToast } from "@/hooks/useToast";
import { useTableState } from "@/hooks/useTableState";

import { GenericTable, type Column } from "@/components/table/GenericTable";

import type { Booking } from "@/types/booking.types";

import {
  GenericTableMenu,
  type MenuAction,
} from "@/components/menu/GenericTableMenu";

import {
  BookingStatus,
  BookingStatusColor,
  BookingStatusDisplay,
} from "@/enums/bookingStatus";
import { useBookingManagement } from "@/pages/dashboard/user/hooks/useBookingManagement";
import { useBookingActions } from "@/pages/dashboard/user/hooks/useBookingActions";
import { MyBookingToolbar } from "./MyBookingToolbar";
import { CancelMyBookingDialog } from "./CancelMyBookingDialog";
import { MyBookingFilterSidebar } from "./MyBookingFilterSidebar";
import { CreditCard, Edit, Eye, XCircle } from "lucide-react";

const BookingManagementPage: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState<
    "bookingCode" | "checkInDate" | "totalAmount" | "createdAt" | undefined
  >(undefined);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Redux state
  const {
    filters,
    pageNumber,
    pageSize,
    cancelDialogOpen,
    selectedBooking,
    handleSetFilter,
    handleSetFilters,
    handleClearFilters,
    handleSetPageNumber,
    handleSetPageSize,
    handleOpenCancelDialog,
    handleCloseCancelDialog,
  } = useBookingManagement();

  // Table menu & pagination
  const tableState = useTableState<Booking>();

  // API Query
  const {
    data: bookingsData,
    isLoading,
    refetch,
  } = useGetMyBookingsQuery({
    sortBy: sortBy ? sortBy : undefined,
    sortDirection: sortOrder,
    ...filters,
    pageNumber,
    pageSize,
  });

  // Booking actions
  const { handleCancelBooking } = useBookingActions(refetch);

  // Data
  const bookings = bookingsData?.data?.items || [];
  const totalCount = bookingsData?.data?.totalCount || 0;

  const columns: Column<Booking>[] = [
    {
      id: "bookingCode",
      label: "Mã đặt phòng",
      minWidth: 150,
      sortable: true,
      format: (value: any) => (
        <Typography variant="body2" fontWeight={600} color="primary">
          {value}
        </Typography>
      ),
    },

    {
      id: "checkInDate",
      label: "Ngày nhận phòng",
      minWidth: 120,
      sortable: true,
      format: (value: any) => (
        <Typography variant="body2">
          {new Date(value).toLocaleDateString("vi-VN")}
        </Typography>
      ),
    },
    {
      id: "checkOutDate",
      label: "Ngày trả phòng",
      minWidth: 100,
      sortable: false,
      format: (value: any) => (
        <Typography variant="body2">
          {new Date(value).toLocaleDateString("vi-VN")}
        </Typography>
      ),
    },

    {
      id: "totalAmount",
      label: "Tổng tiền",
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
      id: "bookingStatus",
      label: "Trạng thái",
      minWidth: 100,
      sortable: false,
      align: "center",
      format: (value: any) => {
        const theme = useTheme();
        const borderColor =
          BookingStatusColor[value as BookingStatus] || theme.palette.grey[500];
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
            {BookingStatusDisplay[value as BookingStatus]}
          </Box>
        );
      },
    },
  ];

  // Dynamic menu actions
  const getMenuActions = (): MenuAction<Booking>[] => {
    const actions: MenuAction<Booking>[] = [
      {
        label: "Xem chi tiết",
        icon: <Eye className="w-4 h-4" />, // 👁 Icon xem chi tiết
        onClick: (booking: Booking) => {
          navigate(`${booking.id}`);
        },
      },
    ];

    // Thêm hành động Thanh toán cho booking đang chờ xử lý
    if (tableState.selectedItem?.bookingStatus === BookingStatus.Pending) {
      actions.push({
        label: "Thanh toán",
        icon: <CreditCard className="w-4 h-4 text-green-600" />, // 💳 Icon thanh toán
        onClick: (booking: Booking) => {
          navigate(`/payment/${booking.id}`);
        },
        color: "success",
      });
    }

    // Thêm hành động Chỉnh sửa cho booking đang chờ hoặc đã xác nhận
    if (
      tableState.selectedItem?.bookingStatus === BookingStatus.Pending ||
      tableState.selectedItem?.bookingStatus === BookingStatus.Confirmed
    ) {
      actions.push({
        label: "Chỉnh sửa",
        icon: <Edit className="w-4 h-4" />, // ✏️ Icon chỉnh sửa
        onClick: (booking: Booking) => {
          navigate(`${booking.id}/edit`);
        },
      });
    }

    // Thêm hành động Hủy đặt phòng cho booking đang chờ hoặc đã xác nhận
    if (
      tableState.selectedItem?.bookingStatus === BookingStatus.Pending ||
      tableState.selectedItem?.bookingStatus === BookingStatus.Confirmed
    ) {
      actions.push({
        label: "Hủy đặt phòng",
        icon: <XCircle className="w-4 h-4 text-red-600" />, // ❌ Icon hủy
        onClick: (booking: Booking) => {
          handleOpenCancelDialog(booking);
        },
        color: "error",
        divider: true,
      });
    }

    return actions;
  };

  // Handle sort
  const handleSort = useCallback(
    (columnId: keyof Booking, order: "asc" | "desc") => {
      if (
        columnId === "bookingCode" ||
        columnId === "checkInDate" ||
        columnId === "totalAmount" ||
        columnId === "createdAt"
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

  // Apply filters from sidebar
  const handleApplyFilters = useCallback(
    (newFilters: any) => {
      handleSetFilters(newFilters);
      setIsFilterSidebarOpen(false);
      toast.success("Filters applied");
    },
    [handleSetFilters, toast]
  );

  // Clear all filters
  const handleClearAllFilters = useCallback(() => {
    handleClearFilters();
    setIsFilterSidebarOpen(false);
    toast.success("Filters cleared");
  }, [handleClearFilters, toast]);

  // Handle cancel confirm
  const handleConfirmCancel = useCallback(
    async (reason: string) => {
      if (selectedBooking) {
        const success = await handleCancelBooking(selectedBooking.id, {
          cancellationReason: reason,
        });
        if (success) {
          handleCloseCancelDialog();
          refetch();
        }
      }
    },
    [selectedBooking, handleCancelBooking, handleCloseCancelDialog, refetch]
  );

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
          Đặt phòng của tôi
        </Typography>

        <MyBookingToolbar
          searchTerm={filters.bookingCode || ""}
          onSearchChange={handleSearchChange}
          onRefresh={() => refetch()}
          onExportCSV={() => toast.success("Exported")}
          isLoading={isLoading}
          onToggleFilters={() => setIsFilterSidebarOpen(true)}
        />

        <GenericTable<Booking>
          columns={columns}
          data={bookings}
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

      <GenericTableMenu<Booking>
        anchorEl={tableState.anchorEl}
        open={tableState.isMenuOpen}
        item={tableState.selectedItem}
        onClose={tableState.handleCloseMenu}
        actions={getMenuActions()}
      />

      <CancelMyBookingDialog
        open={cancelDialogOpen}
        booking={selectedBooking}
        onConfirm={handleConfirmCancel}
        onCancel={handleCloseCancelDialog}
      />

      <MyBookingFilterSidebar
        open={isFilterSidebarOpen}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearAllFilters}
        onClose={() => setIsFilterSidebarOpen(false)}
        initialFilters={filters}
      />
    </Box>
  );
};

export default BookingManagementPage;
