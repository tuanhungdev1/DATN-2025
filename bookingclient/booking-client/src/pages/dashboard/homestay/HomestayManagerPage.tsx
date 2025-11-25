/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useState } from "react";
import { alpha, Box, Typography, useTheme } from "@mui/material";
import {
  Eye,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
  ToggleLeft,
  ToggleRight,
  MapPin,
  Building2,
  BedDouble,
  Star,
  Calendar,
  Users,
  Home,
  DollarSign,
  Eye as EyeIcon,
} from "lucide-react";

import {
  useGetHomestaysQuery,
  useActivateHomestayMutation,
  useDeactivateHomestayMutation,
} from "@/services/endpoints/homestay.api";
import { useToast } from "@/hooks/useToast";
import { useTableState } from "@/hooks/useTableState";
import { useNavigate } from "react-router-dom";

import { HomestayToolbar } from "./components/HomestayToolbar";
import { DeleteConfirmDialog } from "./components/DeleteConfirmDialog";
import { GenericTable, type Column } from "@/components/table/GenericTable";
import { AppImage } from "@/components/images";
import {
  GenericTableMenu,
  type MenuAction,
} from "@/components/menu/GenericTableMenu";
import { FilterSidebar } from "./components/FilterSidebar";
import { ApproveRejectDialog } from "./components/ApproveRejectDialog";

import { useHomestayManagement } from "./hooks/useHomestayManagement";
import { useHomestayActions } from "./hooks/useHomestayActions";

import type { Homestay } from "@/types/homestay.types";

const HomestayManagerPage: React.FC = () => {
  const toast = useToast();
  const theme = useTheme();
  const navigate = useNavigate();

  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState<
    "title" | "price" | "rating" | "createdAt" | "approvedAt" | undefined
  >(undefined);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Redux state quản lý filter, pagination, dialog
  const {
    filters,
    pageNumber,
    pageSize,
    deleteConfirmState,
    approveRejectState,
    handleSetFilter,
    handleSetFilters,
    handleClearFilters,
    handleSetPageNumber,
    handleSetPageSize,
    handleOpenDialog,
    handleOpenDeleteConfirm,
    handleCloseDeleteConfirm,
    handleOpenApproveReject,
    handleCloseApproveReject,
  } = useHomestayManagement();

  const tableState = useTableState<Homestay>();

  const {
    data: homestaysData,
    isLoading,
    refetch,
  } = useGetHomestaysQuery({
    sortBy,
    sortDirection: sortOrder,
    ...filters,
    pageNumber,
    pageSize,
  });

  const [activateHomestay] = useActivateHomestayMutation();
  const [deactivateHomestay] = useDeactivateHomestayMutation();

  const { handleDeleteHomestay, handleApproveHomestay, handleRejectHomestay } =
    useHomestayActions(refetch);

  const homestays = homestaysData?.data?.items || [];
  const totalCount = homestaysData?.data?.totalCount || 0;

  const handleNavigateCreatePage = () => navigate("create");

  const columns: Column<Homestay>[] = [
    {
      id: "mainImageUrl",
      label: "Hình ảnh",
      minWidth: 100,
      sortable: false,
      format: (value: any) => (
        <Box
          sx={{
            width: 60,
            height: 60,
            borderRadius: "8px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#f5f5f5",
          }}
        >
          {value ? <AppImage src={value} alt="Homestay" /> : "Không có ảnh"}
        </Box>
      ),
    },
    {
      id: "homestayTitle",
      label: "Tiêu đề homestay",
      minWidth: 250,
      sortable: true,
    },
    {
      id: "city",
      label: "Địa điểm",
      minWidth: 100,
      sortable: false,
      format: (value: any) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <MapPin size={16} />
          <Typography variant="body2">{value}</Typography>
        </Box>
      ),
    },
    {
      id: "baseNightlyPrice",
      label: "Giá/đêm",
      minWidth: 110,
      sortable: true,
      format: (value: any) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography variant="body2" fontWeight={500}>
            {value?.toLocaleString("vi-VN")} ₫
          </Typography>
        </Box>
      ),
    },
    {
      id: "propertyTypeName",
      label: "Loại hình",
      minWidth: 120,
      sortable: false,
      format: (value: any) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {value}
        </Box>
      ),
    },
    {
      id: "maximumGuests",
      label: "Số khách tối đa",
      minWidth: 110,
      sortable: false,
      format: (value: any) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Users size={16} />
          {value} khách
        </Box>
      ),
    },
    {
      id: "availableRooms",
      label: "Phòng trống",
      minWidth: 120,
      sortable: true,
      format: (value: any) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            color: value > 0 ? "success.main" : "error.main",
            fontWeight: 600,
          }}
        >
          <BedDouble size={16} />
          {value > 0 ? `${value} phòng` : "Hết phòng"}
        </Box>
      ),
    },
    {
      id: "bookingCount",
      label: "Lượt đặt",
      minWidth: 80,
      sortable: true,
    },
    {
      id: "viewCount",
      label: "Lượt xem",
      minWidth: 100,
      sortable: true,
      format: (value: any) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <EyeIcon size={16} />
          {value?.toLocaleString()}
        </Box>
      ),
    },
    {
      id: "ratingAverage",
      label: "Đánh giá",
      minWidth: 110,
      sortable: true,
      format: (value: any, row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Star size={16} style={{ color: "#FFB400" }} />
          <Typography variant="body2" fontWeight={600}>
            {value?.toFixed(1) ?? "N/A"}
          </Typography>
        </Box>
      ),
    },
    {
      id: "isApproved",
      label: "Trạng thái duyệt",
      minWidth: 120,
      sortable: false,
      format: (value: any) => {
        const isApproved = !!value;
        return (
          <Box
            sx={{
              border: `1px solid ${isApproved ? "#4CAF50" : "#FF9800"}`,
              bgcolor: alpha(isApproved ? "#4CAF50" : "#FF9800", 0.1),
              color: isApproved ? "#4CAF50" : "#FF9800",
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              fontSize: "0.6rem",
              fontWeight: 500,
              textAlign: "center",
            }}
          >
            {isApproved ? "Đã duyệt" : "Chờ duyệt"}
          </Box>
        );
      },
    },
    {
      id: "isActive",
      label: "Trạng thái",
      minWidth: 110,
      sortable: false,
      format: (value: any) => {
        const isActive = !!value;
        return (
          <Box
            sx={{
              border: `1px solid ${
                isActive ? theme.palette.success.main : theme.palette.error.main
              }`,
              bgcolor: alpha(
                isActive
                  ? theme.palette.success.main
                  : theme.palette.error.main,
                0.1
              ),
              color: isActive
                ? theme.palette.success.main
                : theme.palette.error.main,
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              fontSize: "0.6rem",
              fontWeight: 500,
              textAlign: "center",
            }}
          >
            {isActive ? "Hoạt động" : "Tạm dừng"}
          </Box>
        );
      },
    },
    {
      id: "createdAt",
      label: "Ngày tạo",
      minWidth: 130,
      sortable: true,
      format: (value: any) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Calendar size={16} />
          {new Date(value).toLocaleDateString("vi-VN")}
        </Box>
      ),
    },
  ];

  const getMenuActions = (): MenuAction<Homestay>[] => {
    const selected = tableState.selectedItem;
    if (!selected) return [];

    const actions: MenuAction<Homestay>[] = [
      {
        label: "Xem chi tiết",
        icon: <Eye size={18} />,
        onClick: () => navigate(`/admin/homestays/${selected.id}`),
      },
      {
        label: "Chỉnh sửa",
        icon: <Edit3 size={18} />,
        onClick: () => navigate(`/admin/homestays/${selected.id}/edit`),
      },
    ];

    // Duyệt / Từ chối (chỉ khi chưa duyệt)
    if (!selected.isApproved) {
      actions.push(
        {
          label: "Duyệt",
          icon: <CheckCircle size={18} color="#4CAF50" />,
          onClick: () => handleOpenApproveReject("approve", selected),
        },
        {
          label: "Từ chối",
          icon: <XCircle size={18} color="#f44336" />,
          onClick: () => handleOpenApproveReject("reject", selected),
        }
      );
    }

    // Kích hoạt / Vô hiệu hóa
    actions.push({
      label: selected.isActive ? "Tạm dừng" : "Kích hoạt",
      icon: selected.isActive ? (
        <ToggleLeft size={20} />
      ) : (
        <ToggleRight size={20} color="#4CAF50" />
      ),
      onClick: () => handleActivateDeactivate(selected),
    });

    // Xóa
    actions.push({
      label: "Xóa homestay",
      icon: <Trash2 size={18} color="#f44336" />,
      onClick: () => handleOpenDeleteConfirm(selected),
      color: "error" as const,
      divider: true,
    });

    return actions;
  };

  const handleActivateDeactivate = useCallback(
    async (homestay: Homestay) => {
      try {
        if (homestay.isActive) {
          await deactivateHomestay(homestay.id).unwrap();
          toast.success("Đã tạm dừng homestay");
        } else {
          await activateHomestay(homestay.id).unwrap();
          toast.success("Đã kích hoạt homestay");
        }
        refetch();
      } catch (err) {
        toast.error("Cập nhật trạng thái thất bại");
      }
    },
    [activateHomestay, deactivateHomestay, refetch, toast]
  );

  const handleSort = useCallback(
    (columnId: keyof Homestay, order: "asc" | "desc") => {
      const map: Record<string, typeof sortBy> = {
        homestayTitle: "title",
        baseNightlyPrice: "price",
        ratingAverage: "rating",
        createdAt: "createdAt",
      };
      setSortBy(map[columnId] || undefined);
      setSortOrder(order);
      handleSetPageNumber(1);
    },
    [handleSetPageNumber]
  );

  const handleSearchChange = (value: string) =>
    handleSetFilter("search", value);

  const handleApplyFilters = (newFilters: any) => {
    handleSetFilters(newFilters);
    setIsFilterSidebarOpen(false);
    toast.success("Đã áp dụng bộ lọc");
  };

  const handleClearAllFilters = () => {
    handleClearFilters();
    setIsFilterSidebarOpen(false);
    toast.success("Đã xóa bộ lọc");
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmState.homestay) {
      const success = await handleDeleteHomestay(
        deleteConfirmState.homestay.id
      );
      if (success) {
        handleCloseDeleteConfirm();
        refetch();
      }
    }
  };

  const handleConfirmApproveReject = async (note: string) => {
    if (!approveRejectState.homestay) return;

    try {
      if (approveRejectState.mode === "approve") {
        await handleApproveHomestay(
          approveRejectState.homestay.id,
          note || "Đã duyệt"
        );
        toast.success("Duyệt homestay thành công");
      } else {
        await handleRejectHomestay(
          approveRejectState.homestay.id,
          note || "Từ chối"
        );
        toast.error("Đã từ chối homestay");
      }
      handleCloseApproveReject();
      refetch();
    } catch {
      toast.error("Thao tác thất bại");
    }
  };

  return (
    <Box sx={{ py: 3 }}>
      <Box
        sx={{
          bgcolor: "background.paper",
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          p: { xs: 2, md: 4 },
        }}
      >
        <Typography variant="h4" fontWeight={700} mb={4}>
          Quản lý Homestay
        </Typography>

        <HomestayToolbar
          searchTerm={filters.search || ""}
          onSearchChange={handleSearchChange}
          onCreateNew={handleNavigateCreatePage}
          onRefresh={refetch}
          isLoading={isLoading}
          onToggleFilters={() => setIsFilterSidebarOpen(true)}
        />

        <GenericTable<Homestay>
          columns={columns}
          data={homestays}
          totalCount={totalCount}
          pageNumber={pageNumber}
          pageSize={pageSize}
          isLoading={isLoading}
          onPageChange={(_, newPage) => handleSetPageNumber(newPage + 1)}
          onPageSizeChange={(e) => handleSetPageSize(Number(e.target.value))}
          onActionClick={tableState.handleOpenMenu}
          onSort={handleSort}
        />
      </Box>

      <GenericTableMenu<Homestay>
        anchorEl={tableState.anchorEl}
        open={tableState.isMenuOpen}
        item={tableState.selectedItem}
        onClose={tableState.handleCloseMenu}
        actions={getMenuActions()}
      />

      <DeleteConfirmDialog
        open={deleteConfirmState.open}
        homestay={deleteConfirmState.homestay ?? null}
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDeleteConfirm}
      />

      <ApproveRejectDialog
        open={approveRejectState.open}
        mode={approveRejectState.mode}
        homestay={approveRejectState.homestay ?? null}
        onConfirm={handleConfirmApproveReject}
        onCancel={handleCloseApproveReject}
      />

      <FilterSidebar
        open={isFilterSidebarOpen}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearAllFilters}
        onClose={() => setIsFilterSidebarOpen(false)}
        initialFilters={filters}
      />
    </Box>
  );
};

export default HomestayManagerPage;
