/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/admin/ReviewManagement/AdminReviewManagementPage.tsx
import React, { useCallback, useState } from "react";
import { alpha, Box, Typography, useTheme, Rating, Chip } from "@mui/material";

import {
  useAddHostResponseMutation,
  useDeleteHostResponseMutation,
  useGetAllReviewsQuery,
  useLazyExportReviewsToCSVQuery,
  useLazyExportReviewsToExcelQuery,
  useLazyExportReviewsToPdfQuery,
  useUpdateHostResponseMutation,
} from "@/services/endpoints/review.api";
import { useToast } from "@/hooks/useToast";
import { useTableState } from "@/hooks/useTableState";

import { GenericTable, type Column } from "@/components/table/GenericTable";
import {
  GenericTableMenu,
  type MenuAction,
} from "@/components/menu/GenericTableMenu";

import type { Review } from "@/types/review.types";

import { Eye, Trash2, EyeOff, ThumbsUp, MessageSquare } from "lucide-react";
import { useReviewManagement } from "./useReviewManagement";
import { useReviewActions } from "./useReviewActions";
import { AdminReviewToolbar } from "./AdminReviewToolbar";
import { DeleteReviewDialog } from "./DeleteReviewDialog";
import { AdminReviewFilterSidebar } from "./AdminReviewFilterSidebar";
import { AdminReviewDetailDialog } from "./AdminReviewDetailDialog";
import { useExport } from "@/hooks/useExport";

const AdminReviewManagementPage: React.FC = () => {
  const toast = useToast();
  const theme = useTheme();

  // Thêm state cho detail dialog
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedReviewForDetail, setSelectedReviewForDetail] =
    useState<Review | null>(null);

  const [addHostResponse] = useAddHostResponseMutation();
  const [updateHostResponse] = useUpdateHostResponseMutation();
  const [deleteHostResponse] = useDeleteHostResponseMutation();

  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState<
    "CreatedAt" | "Date" | "Rating" | "Helpful" | undefined
  >(undefined);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Redux state
  const {
    filters,
    pageNumber,
    pageSize,
    deleteDialogOpen,
    selectedReview,
    handleSetFilter,
    handleSetFilters,
    handleClearFilters,
    handleSetPageNumber,
    handleSetPageSize,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
  } = useReviewManagement();

  // Table menu & pagination
  const tableState = useTableState<Review>();

  // API Query
  const {
    data: reviewsData,
    isLoading,
    refetch,
  } = useGetAllReviewsQuery({
    sortBy: sortBy,
    sortDirection: sortOrder,
    ...filters,
    pageNumber,
    pageSize,
  });

  const { isExporting, handleExport } = useExport({
    fileName: "reviews",
    defaultFileName: "reviews",
  });

  const [triggerExcel] = useLazyExportReviewsToExcelQuery();
  const [triggerPdf] = useLazyExportReviewsToPdfQuery();
  const [triggerCsv] = useLazyExportReviewsToCSVQuery();

  const handleExportExcel = async () => {
    await handleExport(() => triggerExcel(filters).unwrap(), "excel");
  };

  const handleExportPdf = async () => {
    await handleExport(() => triggerPdf(filters).unwrap(), "pdf");
  };

  const handleExportCsv = async () => {
    await handleExport(() => triggerCsv(filters).unwrap(), "csv");
  };
  // Review actions
  const { handleToggleVisibility, handleDeleteReview, handleViewHostResponse } =
    useReviewActions(refetch);

  // Data
  const reviews = reviewsData?.data?.items || [];
  const totalCount = reviewsData?.data?.totalCount || 0;

  const handleOpenDetailDialog = useCallback((review: Review) => {
    setSelectedReviewForDetail(review);
    setDetailDialogOpen(true);
  }, []);

  const handleCloseDetailDialog = useCallback(() => {
    setDetailDialogOpen(false);
    setSelectedReviewForDetail(null);
  }, []);

  const handleAddHostResponse = useCallback(
    async (reviewId: number, response: string) => {
      try {
        const result = await addHostResponse({
          id: reviewId,
          data: { hostResponse: response },
        }).unwrap();
        if (result.success) {
          toast.success("Đã thêm phản hồi thành công");
          refetch();
        }
      } catch (error: any) {
        toast.error(error?.data?.message || "Không thể thêm phản hồi");
      }
    },
    [addHostResponse, toast, refetch]
  );

  const handleUpdateHostResponse = useCallback(
    async (reviewId: number, response: string) => {
      try {
        const result = await updateHostResponse({
          id: reviewId,
          data: { hostResponse: response },
        }).unwrap();
        if (result.success) {
          toast.success("Đã cập nhật phản hồi thành công");
          refetch();
        }
      } catch (error: any) {
        toast.error(error?.data?.message || "Không thể cập nhật phản hồi");
      }
    },
    [updateHostResponse, toast, refetch]
  );

  const handleDeleteHostResponse = useCallback(
    async (reviewId: number) => {
      try {
        const result = await deleteHostResponse(reviewId).unwrap();
        if (result.success) {
          toast.success("Đã xóa phản hồi thành công");
          refetch();
        }
      } catch (error: any) {
        toast.error(error?.data?.message || "Không thể xóa phản hồi");
      }
    },
    [deleteHostResponse, toast, refetch]
  );

  const columns: Column<Review>[] = [
    {
      id: "reviewerName",
      label: "Người đánh giá",
      minWidth: 200,
      sortable: false,
      format: (value: any) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography variant="body2" fontWeight={600}>
            {value}
          </Typography>
        </Box>
      ),
    },
    {
      id: "homestayTitle",
      label: "Homestay",
      minWidth: 200,
      sortable: false,
      format: (value: any) => (
        <Typography variant="body2" fontWeight={500}>
          {value}
        </Typography>
      ),
    },
    {
      id: "overallRating",
      label: "Đánh giá",
      minWidth: 150,
      sortable: true,
      align: "center",
      format: (value: any) => (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Rating value={value} precision={0.5} readOnly size="small" />
          <Typography variant="caption" color="text.secondary" mt={0.5}>
            {value?.toFixed(1)} / 5.0
          </Typography>
        </Box>
      ),
    },
    {
      id: "reviewComment",
      label: "Nhận xét",
      minWidth: 250,
      sortable: false,
      format: (value: any) => (
        <Typography
          variant="body2"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {value || (
            <em style={{ color: theme.palette.text.secondary }}>
              Không có nhận xét
            </em>
          )}
        </Typography>
      ),
    },
    {
      id: "isRecommended",
      label: "Khuyến nghị",
      minWidth: 100,
      sortable: false,
      align: "center",
      format: (value: any) => (
        <Chip
          label={value ? "Có" : "Không"}
          size="small"
          color={value ? "success" : "default"}
          sx={{ fontWeight: 600 }}
        />
      ),
    },
    {
      id: "helpfulCount",
      label: "Hữu ích",
      minWidth: 80,
      sortable: true,
      align: "center",
      format: (value: any) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            justifyContent: "center",
          }}
        >
          <ThumbsUp size={16} />
          <Typography variant="body2" fontWeight={600}>
            {value}
          </Typography>
        </Box>
      ),
    },
    {
      id: "hostResponse",
      label: "Phản hồi",
      minWidth: 100,
      sortable: false,
      align: "center",
      format: (value: any) => (
        <Chip
          icon={<MessageSquare size={14} />}
          label={value ? "Đã phản hồi" : "Chưa"}
          size="small"
          color={value ? "primary" : "default"}
          variant={value ? "filled" : "outlined"}
        />
      ),
    },
    {
      id: "isVisible",
      label: "Trạng thái",
      minWidth: 120,
      sortable: false,
      align: "center",
      format: (value: any) => {
        const borderColor = value
          ? theme.palette.success.main
          : theme.palette.warning.main;
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
            {value ? "Hiển thị" : "Ẩn"}
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
          {new Date(value).toLocaleDateString("vi-VN")}
        </Typography>
      ),
    },
  ];

  // Dynamic menu actions
  const getMenuActions = (): MenuAction<Review>[] => {
    const actions: MenuAction<Review>[] = [
      {
        label: "Xem chi tiết",
        icon: <Eye className="w-4 h-4" />,
        onClick: (review: Review) => {
          handleOpenDetailDialog(review);
        },
      },
    ];

    const review = tableState.selectedItem;

    if (review?.hostResponse) {
      actions.push({
        label: "Xem phản hồi",
        icon: <MessageSquare className="w-4 h-4 text-blue-600" />,
        onClick: (review: Review) => handleViewHostResponse(review),
      });
    }

    actions.push({
      label: review?.isVisible ? "Ẩn đánh giá" : "Hiện đánh giá",
      icon: review?.isVisible ? (
        <EyeOff className="w-4 h-4 text-orange-600" />
      ) : (
        <Eye className="w-4 h-4 text-green-600" />
      ),
      onClick: (review: Review) => handleToggleVisibility(review.id),
      color: review?.isVisible ? "warning" : "success",
    });

    actions.push({
      label: "Xóa đánh giá",
      icon: <Trash2 className="w-4 h-4 text-red-600" />,
      onClick: (review: Review) => handleOpenDeleteDialog(review),
      color: "error",
      divider: true,
    });

    return actions;
  };

  // Handle sort
  const handleSort = useCallback(
    (columnId: keyof Review, order: "asc" | "desc") => {
      if (
        columnId === "overallRating" ||
        columnId === "helpfulCount" ||
        columnId === "createdAt"
      ) {
        const sortMap: Record<string, "CreatedAt" | "Rating" | "Helpful"> = {
          overallRating: "Rating",
          helpfulCount: "Helpful",
          createdAt: "CreatedAt",
        };
        setSortBy(sortMap[columnId]);
        setSortOrder(order);
        handleSetPageNumber(1);
      }
    },
    [handleSetPageNumber]
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
    if (selectedReview) {
      const success = await handleDeleteReview(selectedReview.id);
      if (success) {
        handleCloseDeleteDialog();
        refetch();
      }
    }
  }, [selectedReview, handleDeleteReview, handleCloseDeleteDialog, refetch]);

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
          Quản lý Đánh giá
        </Typography>

        <AdminReviewToolbar
          searchTerm={filters.searchTerm || ""}
          onSearchChange={handleSearchChange}
          onRefresh={() => refetch()}
          isLoading={isLoading}
          onExportExcel={handleExportExcel}
          onExportPdf={handleExportPdf}
          onExportCsv={handleExportCsv}
          isExporting={isExporting}
          onToggleFilters={() => setIsFilterSidebarOpen(true)}
        />

        <GenericTable<Review>
          columns={columns}
          data={reviews}
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

      <GenericTableMenu<Review>
        anchorEl={tableState.anchorEl}
        open={tableState.isMenuOpen}
        item={tableState.selectedItem}
        onClose={tableState.handleCloseMenu}
        actions={getMenuActions()}
      />

      <DeleteReviewDialog
        open={deleteDialogOpen}
        review={selectedReview}
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDeleteDialog}
      />

      <AdminReviewFilterSidebar
        open={isFilterSidebarOpen}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearAllFilters}
        onClose={() => setIsFilterSidebarOpen(false)}
        initialFilters={filters}
      />

      <AdminReviewDetailDialog
        open={detailDialogOpen}
        review={selectedReviewForDetail}
        onClose={handleCloseDetailDialog}
        onAddHostResponse={handleAddHostResponse}
        onUpdateHostResponse={handleUpdateHostResponse}
        onDeleteHostResponse={handleDeleteHostResponse}
        isAdmin={true}
      />
    </Box>
  );
};

export default AdminReviewManagementPage;
