/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/host/HomestayManagement/HomestayManagementPage.tsx
import React, { useCallback, useState } from "react";
import { alpha, Box, Typography, useTheme } from "@mui/material";
import {
  Edit,
  Trash2,
  Eye,
  ToggleLeft,
  ToggleRight,
  BedDouble,
  Building2,
  MapPin,
  Star,
  DollarSign,
  Users,
} from "lucide-react";

import {
  useGetMyHomestaysQuery,
  useActivateHomestayMutation,
  useDeactivateHomestayMutation,
  useDeleteHomestayMutation,
} from "@/services/endpoints/homestay.api";
import { useToast } from "@/hooks/useToast";
import { useTableState } from "@/hooks/useTableState";

import { GenericTable, type Column } from "@/components/table/GenericTable";

import type { Homestay } from "@/types/homestay.types";

import { AppImage } from "@/components/images";
import {
  GenericTableMenu,
  type MenuAction,
} from "@/components/menu/GenericTableMenu";

import { useNavigate } from "react-router-dom";
import { useHomestayManagement } from "../dashboard/homestay/hooks/useHomestayManagement";
import { DeleteConfirmDialog } from "../dashboard/homestay/components/DeleteConfirmDialog";
import { FilterSidebar } from "../dashboard/homestay/components/FilterSidebar";
import { HomestayToolbar } from "../dashboard/homestay/components/HomestayToolbar";

const ManagerHomestayForHostPage: React.FC = () => {
  const toast = useToast();
  const theme = useTheme();
  const navigate = useNavigate();

  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState<
    "title" | "price" | "rating" | "createdAt" | undefined
  >(undefined);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

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
    handleOpenDialog,
    handleOpenDeleteConfirm,
    handleCloseDeleteConfirm,
  } = useHomestayManagement();

  // Table menu & pagination
  const tableState = useTableState<Homestay>();

  // API Query - Sử dụng useGetMyHomestaysQuery thay vì useGetHomestaysQuery
  const {
    data: homestaysData,
    isLoading,
    refetch,
  } = useGetMyHomestaysQuery({
    sortBy: sortBy,
    sortDirection: sortOrder,
    ...filters,
    pageNumber,
    pageSize,
  });

  const [activateHomestay] = useActivateHomestayMutation();
  const [deactivateHomestay] = useDeactivateHomestayMutation();
  const [deleteHomestay] = useDeleteHomestayMutation();

  // Data
  const homestays = homestaysData?.data?.items || [];
  const totalCount = homestaysData?.data?.totalCount || 0;

  const handleNavigateCreatePage = () => {
    navigate("/host/homestays/create");
  };

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
          }}
        >
          {value ? (
            <AppImage src={value} alt="Homestay" />
          ) : (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                backgroundColor: "#f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
                color: "#999",
              }}
            >
              Không có ảnh
            </Box>
          )}
        </Box>
      ),
    },
    {
      id: "homestayTitle",
      label: "Tiêu đề",
      minWidth: 200,
      sortable: true,
      format: (value: any) => (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          {value}
        </Typography>
      ),
    },
    {
      id: "city",
      label: "Địa điểm",
      minWidth: 100,
      sortable: false,
      format: (value: any) => (
        <Typography
          variant="body2"
          sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
        >
          <MapPin size={14} /> {value}
        </Typography>
      ),
    },
    {
      id: "baseNightlyPrice",
      label: "Giá / Đêm (VND)",
      minWidth: 120,
      sortable: true,
      format: (value: any) => (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <DollarSign size={14} />
          {value?.toLocaleString("vi-VN")}
        </Typography>
      ),
    },
    {
      id: "propertyTypeName",
      label: "Loại hình",
      minWidth: 100,
      sortable: false,
      format: (value: any) => (
        <Typography
          variant="body2"
          sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
        >
          <Building2 size={14} /> {value}
        </Typography>
      ),
    },
    {
      id: "maximumGuests",
      label: "Số khách",
      minWidth: 100,
      sortable: false,
      format: (value: any) => (
        <Typography
          variant="body2"
          sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
        >
          <Users size={14} /> {value} khách
        </Typography>
      ),
    },
    {
      id: "availableRooms",
      label: "Phòng còn trống",
      minWidth: 100,
      sortable: true,
      format: (value: any) => (
        <Typography
          variant="body2"
          sx={{
            color: value > 0 ? "#4CAF50" : "#f44336",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <BedDouble size={14} />
          {value > 0 ? `${value} phòng` : "Hết phòng"}
        </Typography>
      ),
    },
    {
      id: "bookingCount",
      label: "Lượt đặt",
      minWidth: 80,
      sortable: true,
      format: (value: any) => (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          {value?.toLocaleString()}
        </Typography>
      ),
    },
    {
      id: "viewCount",
      label: "Lượt xem",
      minWidth: 50,
      sortable: true,
      format: (value: any) => (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <Eye size={14} /> {value?.toLocaleString()}
        </Typography>
      ),
    },
    {
      id: "ratingAverage",
      label: "Đánh giá",
      minWidth: 50,
      sortable: true,
      format: (value: any, row: any) => (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <Star size={14} fill="#FFB800" color="#FFB800" />{" "}
            {value?.toFixed(1) || "N/A"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ({row.totalReviews} lượt)
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
        const borderColor = value ? "#4CAF50" : "#FF9800";
        const bgColor = alpha(borderColor, 0.1);

        return (
          <Box
            sx={{
              border: `1px solid ${borderColor}`,
              backgroundColor: bgColor,
              width: "120px",
              textAlign: "center",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: borderColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.5,
            }}
          >
            {value ? "Đã duyệt" : "Chờ duyệt"}
          </Box>
        );
      },
    },
    {
      id: "isActive",
      label: "Hoạt động",
      minWidth: 100,
      sortable: false,
      format: (value: any) => {
        const color = value ? "success" : "error";
        const borderColor = theme.palette[color].main;
        const bgColor = alpha(theme.palette[color].main, 0.1);

        return (
          <Box
            sx={{
              border: `1px solid ${borderColor}`,
              backgroundColor: bgColor,
              width: "100px",
              textAlign: "center",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: borderColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.5,
            }}
          >
            {value ? "Hoạt động" : "Ngừng"}
          </Box>
        );
      },
    },
    {
      id: "createdAt",
      label: "Ngày tạo",
      minWidth: 60,
      sortable: true,
      format: (value: any) => (
        <Typography
          variant="body2"
          sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
        >
          {new Date(value).toLocaleDateString("vi-VN", {
            weekday: "short",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </Typography>
      ),
    },
  ];

  // Dynamic menu actions
  const getMenuActions = (): MenuAction<Homestay>[] => {
    const actions: MenuAction<Homestay>[] = [
      {
        label: "Xem chi tiết",
        icon: <Eye size={18} />,
        onClick: (homestay: Homestay) => {
          handleOpenDialog("view", homestay);
          navigate(`/host/homestays/${homestay.id}`);
        },
      },
      {
        label: "Chỉnh sửa",
        icon: <Edit size={18} />,
        onClick: (homestay: Homestay) => {
          handleOpenDialog("edit", homestay);
          navigate(`/host/homestays/${homestay.id}/edit`);
        },
      },
    ];

    // Add activate/deactivate
    actions.push({
      label: tableState.selectedItem?.isActive
        ? "Ngừng hoạt động"
        : "Kích hoạt",
      icon: tableState.selectedItem?.isActive ? (
        <ToggleLeft size={18} />
      ) : (
        <ToggleRight size={18} />
      ),
      onClick: (homestay: Homestay) => {
        handleActivateDeactivate(homestay);
      },
    });

    // Add delete
    actions.push({
      label: "Xóa",
      icon: <Trash2 size={18} />,
      onClick: (homestay: Homestay) => {
        handleOpenDeleteConfirm(homestay);
      },
      color: "error",
      divider: true,
    });

    return actions;
  };

  // Handle Activate/Deactivate
  const handleActivateDeactivate = useCallback(
    async (homestay: Homestay) => {
      try {
        if (homestay.isActive) {
          await deactivateHomestay(homestay.id).unwrap();
          toast.success("Đã ngừng hoạt động homestay");
        } else {
          await activateHomestay(homestay.id).unwrap();
          toast.success("Đã kích hoạt homestay");
        }
        refetch();
      } catch (error) {
        console.error(error);
        toast.error("Không thể cập nhật trạng thái homestay");
      }
    },
    [activateHomestay, deactivateHomestay, refetch, toast]
  );

  // Handle delete
  const handleDeleteHomestay = useCallback(
    async (id: number) => {
      try {
        await deleteHomestay(id).unwrap();
        toast.success("Đã xóa homestay thành công");
        return true;
      } catch (error) {
        console.error(error);
        toast.error("Không thể xóa homestay");
        return false;
      }
    },
    [deleteHomestay, toast]
  );

  // Handle sort
  const handleSort = useCallback(
    (columnId: keyof Homestay, order: "asc" | "desc") => {
      if (
        columnId === "homestayTitle" ||
        columnId === "baseNightlyPrice" ||
        columnId === "ratingAverage" ||
        columnId === "createdAt"
      ) {
        const sortByMap: Record<string, typeof sortBy> = {
          homestayTitle: "title",
          baseNightlyPrice: "price",
          ratingAverage: "rating",
          createdAt: "createdAt",
        };
        setSortBy(sortByMap[columnId]);
        setSortOrder(order);
        handleSetPageNumber(1);
      }
    },
    [handleSetPageNumber]
  );

  // Handle search
  const handleSearchChange = useCallback(
    (value: string) => {
      handleSetFilter("search", value);
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
    if (deleteConfirmState.homestay) {
      try {
        const success = await handleDeleteHomestay(
          deleteConfirmState.homestay.id
        );
        if (success) {
          handleCloseDeleteConfirm();
          refetch();
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, [
    deleteConfirmState.homestay,
    handleDeleteHomestay,
    handleCloseDeleteConfirm,
    refetch,
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
          Quản lý Homestay của tôi
        </Typography>
        <HomestayToolbar
          searchTerm={filters.search || ""}
          onSearchChange={handleSearchChange}
          onCreateNew={() => handleNavigateCreatePage()}
          onRefresh={() => refetch()}
          onExportCSV={() => toast.success("Đã xuất dữ liệu")}
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
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
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

export default ManagerHomestayForHostPage;
