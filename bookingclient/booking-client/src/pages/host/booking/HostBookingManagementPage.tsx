/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/host/BookingManagement/HostBookingManagementPage.tsx
import React, { useCallback, useState } from "react";
import { alpha, Box, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

import {
  useGetHostBookingsQuery,
  useLazyExportBookingsToCSVQuery,
  useLazyExportBookingsToExcelQuery,
  useLazyExportBookingsToPdfQuery,
} from "@/services/endpoints/booking.api";
import { useToast } from "@/hooks/useToast";
import { useTableState } from "@/hooks/useTableState";

import { GenericTable, type Column } from "@/components/table/GenericTable";
import {
  GenericTableMenu,
  type MenuAction,
} from "@/components/menu/GenericTableMenu";

import type { Booking } from "@/types/booking.types";

import {
  BookingStatus,
  BookingStatusColor,
  BookingStatusDisplay,
} from "@/enums/bookingStatus";

import { CheckCircle, Eye, XCircle, LogIn, LogOut, UserX } from "lucide-react";
import { useBookingManagement } from "@/pages/dashboard/user/hooks/useBookingManagement";
import { useBookingActions } from "@/pages/dashboard/user/hooks/useBookingActions";
import { RejectBookingDialog } from "@/pages/dashboard/booking/RejectBookingDialog";
import { AdminBookingToolbar } from "@/pages/dashboard/booking/AdminBookingToolbar";
import { HostBookingFilterSidebar } from "./HostBookingFilterSidebar";
import { useExport } from "@/hooks/useExport";

const HostBookingManagementPage: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState<
    "bookingCode" | "checkInDate" | "totalAmount" | "createdAt" | undefined
  >(undefined);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Redux state for Host
  const {
    filters,
    pageNumber,
    pageSize,
    rejectDialogOpen,
    selectedBooking,
    handleSetFilter,
    handleSetFilters,
    handleClearFilters,
    handleSetPageNumber,
    handleSetPageSize,
    handleOpenRejectDialog,
    handleCloseRejectDialog,
  } = useBookingManagement();

  // Table menu & pagination
  const tableState = useTableState<Booking>();

  // Export functionality
  const { isExporting, handleExport } = useExport({
    fileName: "host-bookings",
    defaultFileName: "host-bookings",
  });

  // Export API queries
  const [triggerExcelExport] = useLazyExportBookingsToExcelQuery();
  const [triggerPdfExport] = useLazyExportBookingsToPdfQuery();
  const [triggerCsvExport] = useLazyExportBookingsToCSVQuery();

  // Export handlers
  const handleExportExcel = async () => {
    await handleExport(
      () =>
        triggerExcelExport({
          ...filters,
          pageNumber: 1,
          pageSize: 10000,
        }).unwrap(),
      "excel"
    );
  };

  const handleExportPdf = async () => {
    await handleExport(
      () =>
        triggerPdfExport({
          ...filters,
          pageNumber: 1,
          pageSize: 10000,
        }).unwrap(),
      "pdf"
    );
  };

  const handleExportCsv = async () => {
    await handleExport(
      () =>
        triggerCsvExport({
          ...filters,
          pageNumber: 1,
          pageSize: 10000,
        }).unwrap(),
      "csv"
    );
  };

  // API Query - Using HOST endpoint
  const {
    data: bookingsData,
    isLoading,
    refetch,
  } = useGetHostBookingsQuery({
    sortBy: sortBy ? sortBy : undefined,
    sortDirection: sortOrder,
    ...filters,
    pageNumber,
    pageSize,
  });

  // Booking actions for Host
  const {
    handleConfirmBooking,
    handleRejectBooking,
    handleCheckIn,
    handleCheckOut,
    handleMarkAsNoShow,
  } = useBookingActions(refetch);

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
      id: "homestay",
      label: "Homestay",
      minWidth: 200,
      sortable: false,
      format: (value) => (
        <Typography variant="body2">{value.homestayTitle}</Typography>
      ),
    },
    {
      id: "guestName",
      label: "Khách hàng",
      minWidth: 150,
      sortable: false,
      format: (value: any) => <Typography variant="body2">{value}</Typography>,
    },
    {
      id: "guestPhone",
      label: "Số điện thoại",
      minWidth: 120,
      sortable: false,
      format: (value: any) => (
        <Typography variant="body2">{value || "N/A"}</Typography>
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
      minWidth: 120,
      sortable: false,
      format: (value: any) => (
        <Typography variant="body2">
          {new Date(value).toLocaleDateString("vi-VN")}
        </Typography>
      ),
    },
    {
      id: "numberOfGuests",
      label: "Số khách",
      minWidth: 80,
      sortable: false,
      align: "center",
      format: (value: any) => <Typography variant="body2">{value}</Typography>,
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
      minWidth: 120,
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

  // Dynamic menu actions for Host (limited permissions)
  const getMenuActions = (): MenuAction<Booking>[] => {
    const actions: MenuAction<Booking>[] = [
      {
        label: "Xem chi tiết",
        icon: <Eye className="w-4 h-4" />,
        onClick: (booking: Booking) => {
          navigate(`/host/bookings/${booking.id}`);
        },
      },
    ];

    const status = tableState.selectedItem?.bookingStatus;

    // Host can confirm or reject pending bookings
    if (status === BookingStatus.Pending) {
      actions.push(
        {
          label: "Xác nhận",
          icon: <CheckCircle className="w-4 h-4 text-green-600" />,
          onClick: (booking: Booking) => handleConfirmBooking(booking.id),
          color: "success",
          divider: true,
        },
        {
          label: "Từ chối",
          icon: <XCircle className="w-4 h-4 text-red-600" />,
          onClick: (booking: Booking) => handleOpenRejectDialog(booking),
          color: "error",
        }
      );
    }

    // Host can check-in confirmed bookings
    if (status === BookingStatus.Confirmed) {
      actions.push(
        {
          label: "Check-in",
          icon: <LogIn className="w-4 h-4 text-blue-600" />,
          onClick: (booking: Booking) => handleCheckIn(booking.id),
          divider: true,
        },
        {
          label: "Đánh dấu No-show",
          icon: <UserX className="w-4 h-4 text-orange-600" />,
          onClick: (booking: Booking) => handleMarkAsNoShow(booking.id),
          color: "warning",
        }
      );
    }

    // Host can check-out checked-in bookings
    if (status === BookingStatus.CheckedIn) {
      actions.push({
        label: "Check-out",
        icon: <LogOut className="w-4 h-4 text-blue-600" />,
        onClick: (booking: Booking) => handleCheckOut(booking.id),
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
      toast.success("Đã áp dụng bộ lọc");
    },
    [handleSetFilters, toast]
  );

  // Clear all filters
  const handleClearAllFilters = useCallback(() => {
    handleClearFilters();
    setIsFilterSidebarOpen(false);
    toast.success("Đã xóa bộ lọc");
  }, [handleClearFilters, toast]);

  // Handle reject confirm
  const handleConfirmReject = useCallback(
    async (reason: string) => {
      if (selectedBooking) {
        const success = await handleRejectBooking(selectedBooking.id, reason);
        if (success) {
          handleCloseRejectDialog();
          refetch();
        }
      }
    },
    [selectedBooking, handleRejectBooking, handleCloseRejectDialog, refetch]
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
    <Box
      sx={{
        py: 2,
      }}
    >
      <Box
        sx={{
          boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px;",
          borderRadius: "10px",
          px: 3,
          py: 2,
          bgcolor: "white",
        }}
      >
        <Typography variant="h4" fontSize="28px" mb={4} pt={2}>
          Quản lý Đặt phòng
        </Typography>

        <AdminBookingToolbar
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

      <RejectBookingDialog
        open={rejectDialogOpen}
        booking={selectedBooking}
        onConfirm={handleConfirmReject}
        onCancel={handleCloseRejectDialog}
      />

      <HostBookingFilterSidebar
        open={isFilterSidebarOpen}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearAllFilters}
        onClose={() => setIsFilterSidebarOpen(false)}
        initialFilters={filters}
      />
    </Box>
  );
};

export default HostBookingManagementPage;
