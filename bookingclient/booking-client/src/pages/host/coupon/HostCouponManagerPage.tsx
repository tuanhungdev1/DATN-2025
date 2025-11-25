/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/admin/CouponManagement/CouponManagerPage.tsx
import React, { useCallback, useState } from "react";
import { alpha, Box, Chip, Typography, useTheme } from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  ToggleOn as ActivateIcon,
  ToggleOff as DeactivateIcon,
  Schedule as ExtendIcon,
} from "@mui/icons-material";
import {
  useGetAllCouponsQuery,
  useDeleteCouponMutation,
  useActivateCouponMutation,
  useDeactivateCouponMutation,
  useToggleCouponStatusMutation,
  useGetMyCouponsQuery,
} from "@/services/endpoints/coupon.api";
import { useToast } from "@/hooks/useToast";
import { useTableState } from "@/hooks/useTableState";
import { GenericTable, type Column } from "@/components/table/GenericTable";
import type { Coupon } from "@/types/coupon.types";
import {
  GenericTableMenu,
  type MenuAction,
} from "@/components/menu/GenericTableMenu";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  DollarSign,
  Eye,
  Pencil,
  Percent,
  Power,
  PowerOff,
  Tag,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";
import { useCouponManagement } from "@/hooks/useCouponManagement";

import {
  getCouponScopeDisplay,
  getCouponTypeDisplay,
} from "@/utils/formatCoupon";
import { CouponToolbar } from "@/pages/dashboard/coupon/CouponToolbar";
import { DeleteConfirmDialog } from "@/pages/dashboard/coupon/DeleteConfirmDialog";
import { ExtendExpiryDialog } from "@/pages/dashboard/coupon/ExtendExpiryDialog";
import { CouponDetailDialog } from "@/pages/dashboard/coupon/CouponDetailDialog";
import { CouponFilterSidebar } from "@/pages/dashboard/coupon/CouponFilterSidebar";

const HostCouponManagerPage: React.FC = () => {
  const toast = useToast();
  const theme = useTheme();
  const navigate = useNavigate();

  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [extendDialogOpen, setExtendDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // Redux state
  const {
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
  } = useCouponManagement();

  // Table menu & pagination
  const tableState = useTableState<Coupon>();

  // API Query
  const {
    data: couponsData,
    isLoading,
    refetch,
  } = useGetMyCouponsQuery({
    ...filters,
    pageNumber,
    pageSize,
  });

  const [deleteCoupon] = useDeleteCouponMutation();
  const [activateCoupon] = useActivateCouponMutation();
  const [deactivateCoupon] = useDeactivateCouponMutation();
  const [toggleCouponStatus] = useToggleCouponStatusMutation();

  // Data
  const coupons = couponsData?.data?.items || [];
  const totalCount = couponsData?.data?.totalCount || 0;

  const columns: Column<Coupon>[] = [
    {
      id: "couponCode",
      label: "Mã Coupon",
      minWidth: 150,
      sortable: true,
      format: (value: any) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Tag size={16} color={theme.palette.primary.main} />
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              color: theme.palette.primary.main,
              fontFamily: "monospace",
            }}
          >
            {value}
          </Typography>
        </Box>
      ),
    },
    {
      id: "couponName",
      label: "Tên Coupon",
      minWidth: 200,
      sortable: true,
      format: (value: any) => (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {value}
        </Typography>
      ),
    },
    {
      id: "couponType",
      label: "Loại",
      minWidth: 120,
      sortable: false,
      format: (value: any) => (
        <Chip
          label={getCouponTypeDisplay(value)}
          size="small"
          sx={{
            backgroundColor: alpha(theme.palette.info.main, 0.1),
            color: theme.palette.info.main,
            fontWeight: 600,
          }}
        />
      ),
    },
    {
      id: "discountValue",
      label: "Giá trị giảm",
      minWidth: 130,
      sortable: true,
      format: (value: any, row?: Coupon) => {
        if (!row) return null;
        const isPercentage = row.couponType === 1;
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {isPercentage ? <Percent size={14} /> : <DollarSign size={14} />}
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {isPercentage
                ? `${value}%`
                : `${value.toLocaleString("vi-VN")} VND`}
            </Typography>
          </Box>
        );
      },
    },
    {
      id: "scope",
      label: "Phạm vi",
      minWidth: 150,
      sortable: false,
      format: (value: any) => (
        <Typography variant="body2" color="text.secondary">
          {getCouponScopeDisplay(value)}
        </Typography>
      ),
    },
    {
      id: "currentUsageCount",
      label: "Đã dùng / Giới hạn",
      minWidth: 140,
      sortable: true,
      format: (value: any, row?: Coupon) => {
        if (!row) return null;

        const limit = row.totalUsageLimit || "∞";
        const percentage = row.totalUsageLimit
          ? (value / row.totalUsageLimit) * 100
          : 0;
        const color =
          percentage >= 80
            ? theme.palette.error.main
            : percentage >= 50
            ? theme.palette.warning.main
            : theme.palette.success.main;

        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Users size={14} />
            <Typography variant="body2" sx={{ fontWeight: 600, color }}>
              {value} / {limit}
            </Typography>
          </Box>
        );
      },
    },
    {
      id: "startDate",
      label: "Ngày bắt đầu",
      minWidth: 120,
      sortable: true,
      format: (value: any) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Calendar size={14} />
          <Typography variant="body2">
            {new Date(value).toLocaleDateString("vi-VN")}
          </Typography>
        </Box>
      ),
    },
    {
      id: "endDate",
      label: "Ngày kết thúc",
      minWidth: 120,
      sortable: true,
      format: (value: any, row?: Coupon) => {
        if (!row) return null;
        const isExpired = row.isExpired;
        return (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Calendar
              size={14}
              color={isExpired ? theme.palette.error.main : undefined}
            />
            <Typography
              variant="body2"
              sx={{
                color: isExpired ? theme.palette.error.main : "text.primary",
                fontWeight: isExpired ? 600 : 400,
              }}
            >
              {new Date(value).toLocaleDateString("vi-VN")}
            </Typography>
          </Box>
        );
      },
    },
    {
      id: "isPublic",
      label: "Công khai",
      minWidth: 100,
      sortable: false,
      format: (value: any) => (
        <Chip
          label={value ? "Công khai" : "Riêng tư"}
          size="small"
          sx={{
            backgroundColor: value
              ? alpha(theme.palette.success.main, 0.1)
              : alpha(theme.palette.grey[500], 0.1),
            color: value ? theme.palette.success.main : theme.palette.grey[600],
            fontWeight: 600,
          }}
        />
      ),
    },
    {
      id: "isActive",
      label: "Trạng thái",
      minWidth: 100,
      sortable: false,
      format: (value: any) => (
        <Chip
          label={value ? "Hoạt động" : "Ngừng"}
          size="small"
          sx={{
            backgroundColor: alpha(
              value ? theme.palette.success.main : theme.palette.error.main,
              0.1
            ),
            color: value
              ? theme.palette.success.main
              : theme.palette.error.main,
            fontWeight: 600,
            border: `1px solid ${
              value ? theme.palette.success.main : theme.palette.error.main
            }`,
          }}
        />
      ),
    },

    {
      id: "priority",
      label: "Ưu tiên",
      minWidth: 80,
      sortable: true,
      format: (value: any) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <TrendingUp size={14} />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {value}
          </Typography>
        </Box>
      ),
    },
  ];

  // Dynamic menu actions
  const getMenuActions = (): MenuAction<Coupon>[] => {
    const actions: MenuAction<Coupon>[] = [
      {
        label: "Xem chi tiết",
        icon: <Eye className="mr-2 h-4 w-4" />,
        onClick: (coupon: Coupon) => {
          setSelectedCoupon(coupon);
          setDetailDialogOpen(true);
        },
      },
      {
        label: "Chỉnh sửa",
        icon: <Pencil className="mr-2 h-4 w-4" />,
        onClick: (coupon: Coupon) => {
          navigate(`/admin/coupons/${coupon.id}/edit`);
        },
      },
    ];

    // Kích hoạt / Vô hiệu hóa
    actions.push({
      label: tableState.selectedItem?.isActive ? "Vô hiệu hóa" : "Kích hoạt",
      icon: tableState.selectedItem?.isActive ? (
        <PowerOff className="mr-2 h-4 w-4 text-yellow-600" />
      ) : (
        <Power className="mr-2 h-4 w-4 text-green-600" />
      ),
      onClick: (coupon: Coupon) => {
        handleToggleStatus(coupon);
      },
      color: tableState.selectedItem?.isActive ? "warning" : "success",
    });

    // Gia hạn (nếu chưa hết hạn)
    if (tableState.selectedItem && !tableState.selectedItem.isExpired) {
      actions.push({
        label: "Gia hạn",
        icon: <Clock className="mr-2 h-4 w-4 text-blue-600" />,
        onClick: (coupon: Coupon) => {
          setSelectedCoupon(coupon);
          setExtendDialogOpen(true);
        },
      });
    }

    // Xóa
    actions.push({
      label: "Xóa",
      icon: <Trash2 className="mr-2 h-4 w-4 text-red-600" />,
      onClick: (coupon: Coupon) => {
        handleOpenDeleteConfirm(coupon);
      },
      color: "error",
      divider: true,
    });

    return actions;
  };

  // Handle toggle status
  const handleToggleStatus = useCallback(
    async (coupon: Coupon) => {
      try {
        await toggleCouponStatus(coupon.id).unwrap();
        toast.success(
          `Coupon ${
            coupon.isActive ? "đã được vô hiệu hóa" : "đã được kích hoạt"
          }`
        );
        refetch();
      } catch (error) {
        console.error(error);
        toast.error("Không thể cập nhật trạng thái coupon");
      }
    },
    [toggleCouponStatus, refetch, toast]
  );

  // Handle search
  const handleSearchChange = useCallback(
    (value: string) => {
      handleSetFilter("searchTerm", value);
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

  // Handle delete confirm
  const handleConfirmDelete = useCallback(async () => {
    if (deleteConfirmState.coupon) {
      try {
        await deleteCoupon(deleteConfirmState.coupon.id).unwrap();
        toast.success("Đã xóa coupon thành công");
        handleCloseDeleteConfirm();
        refetch();
      } catch (error: any) {
        console.error(error);
        toast.error(error?.data?.message || "Không thể xóa coupon");
      }
    }
  }, [
    deleteConfirmState.coupon,
    deleteCoupon,
    handleCloseDeleteConfirm,
    refetch,
    toast,
  ]);

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
    <Box sx={{ py: 2 }}>
      <Box
        sx={{
          boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px;",
          borderRadius: "10px",
          px: 3,
          py: 2,
        }}
      >
        <Typography variant="h4" fontSize={"34px"} mb={4} pt={2}>
          Quản lý Coupon
        </Typography>

        <CouponToolbar
          searchTerm={filters.searchTerm || ""}
          onSearchChange={handleSearchChange}
          onCreateNew={() => navigate("/host/coupons/create")}
          onRefresh={() => refetch()}
          onExportCSV={() => toast.success("Đã xuất CSV")}
          isLoading={isLoading}
          onToggleFilters={() => setIsFilterSidebarOpen(true)}
        />

        <GenericTable<Coupon>
          columns={columns}
          data={coupons}
          totalCount={totalCount}
          pageNumber={pageNumber}
          pageSize={pageSize}
          isLoading={isLoading}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onActionClick={tableState.handleOpenMenu}
          onSort={(columnId, order) => {
            handleSetFilter("sortBy", String(columnId));
            handleSetFilter("sortDirection", order);
            handleSetPageNumber(1);
          }}
        />
      </Box>

      <GenericTableMenu<Coupon>
        anchorEl={tableState.anchorEl}
        open={tableState.isMenuOpen}
        item={tableState.selectedItem}
        onClose={tableState.handleCloseMenu}
        actions={getMenuActions()}
      />

      <DeleteConfirmDialog
        open={deleteConfirmState.open}
        coupon={deleteConfirmState.coupon ?? null}
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDeleteConfirm}
      />

      <ExtendExpiryDialog
        open={extendDialogOpen}
        coupon={selectedCoupon}
        onClose={() => {
          setExtendDialogOpen(false);
          setSelectedCoupon(null);
        }}
        onSuccess={() => {
          refetch();
          toast.success("Đã gia hạn coupon thành công");
        }}
      />

      <CouponDetailDialog
        open={detailDialogOpen}
        coupon={selectedCoupon}
        onClose={() => {
          setDetailDialogOpen(false);
          setSelectedCoupon(null);
        }}
      />

      <CouponFilterSidebar
        open={isFilterSidebarOpen}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearAllFilters}
        onClose={() => setIsFilterSidebarOpen(false)}
        initialFilters={filters}
      />
    </Box>
  );
};

export default HostCouponManagerPage;
