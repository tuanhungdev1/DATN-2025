/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/admin/HostManagement/HostManagementPage.tsx
import React, { useCallback, useState } from "react";
import { alpha, Box, Typography, useTheme } from "@mui/material";
import {
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Star as SuperhostIcon,
  ToggleOn as ActivateIcon,
  ToggleOff as DeactivateIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Calendar,
  TrendingUp,
  Home,
  ShoppingBag,
  StarIcon,
  Award,
} from "lucide-react";

import {
  useGetAllHostProfilesQuery,
  useLazyExportHostProfilesToCSVQuery,
  useLazyExportHostProfilesToExcelQuery,
  useLazyExportHostProfilesToPdfQuery,
  useMarkAsSuperhostMutation,
  useToggleActiveStatusMutation,
} from "@/services/endpoints/hostProfile.api";
import { useToast } from "@/hooks/useToast";
import { useTableState } from "@/hooks/useTableState";

import { GenericTable, type Column } from "@/components/table/GenericTable";

import {
  GenericTableMenu,
  type MenuAction,
} from "@/components/menu/GenericTableMenu";

import { HostStatus, type HostProfile } from "@/types/hostProfile.types";
import { useHostManagement } from "@/hooks/useHostManagement";
import { useHostActions } from "@/hooks/useHostActions";
import { HostToolbar } from "./HostToolbar";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { ApproveRejectDialog } from "./ApproveRejectDialog";
import { FilterSidebar } from "./FilterSidebar";
import { useExport } from "@/hooks/useExport";

const HostManagementPage: React.FC = () => {
  const toast = useToast();
  const theme = useTheme();
  const navigate = useNavigate();

  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Redux state
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
    handleOpenDeleteConfirm,
    handleCloseDeleteConfirm,
    handleOpenApproveReject,
    handleCloseApproveReject,
  } = useHostManagement();

  // Table menu & pagination
  const tableState = useTableState<HostProfile>();

  // API Query
  const {
    data: hostProfilesData,
    isLoading,
    refetch,
  } = useGetAllHostProfilesQuery({
    sortBy: sortBy,
    sortDirection: sortDirection,
    ...filters,
    pageNumber,
    pageSize,
  });

  const { isExporting, handleExport } = useExport({
    fileName: "reviews",
    defaultFileName: "reviews",
  });

  const [triggerExcel] = useLazyExportHostProfilesToExcelQuery();
  const [triggerPdf] = useLazyExportHostProfilesToPdfQuery();
  const [triggerCsv] = useLazyExportHostProfilesToCSVQuery();

  const handleExportExcel = async () => {
    await handleExport(() => triggerExcel(filters).unwrap(), "excel");
  };

  const handleExportPdf = async () => {
    await handleExport(() => triggerPdf(filters).unwrap(), "pdf");
  };

  const handleExportCsv = async () => {
    await handleExport(() => triggerCsv(filters).unwrap(), "csv");
  };

  const [markAsSuperhost] = useMarkAsSuperhostMutation();
  const [toggleActiveStatus] = useToggleActiveStatusMutation();

  // Host actions
  const { handleDeleteHost, handleApproveHost, handleRejectHost } =
    useHostActions(refetch);

  // Data
  const hostProfiles = hostProfilesData?.data?.items || [];
  const totalCount = hostProfilesData?.data?.totalCount || 0;

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "Pending":
        return { label: "Chờ duyệt", color: "warning" };
      case "UnderReview":
        return { label: "Đang xem xét", color: "info" };
      case "Approved":
        return { label: "Đã duyệt", color: "success" };
      case "Rejected":
        return { label: "Đã từ chối", color: "error" };
      case "RequiresMoreInfo":
        return { label: "Cần bổ sung", color: "warning" };
      case "Cancelled":
        return { label: "Đã hủy", color: "default" };
      default:
        return { label: status, color: "default" };
    }
  };

  const columns: Column<HostProfile>[] = [
    {
      id: "businessName",
      label: "Doanh nghiệp",
      minWidth: 200,
      sortable: true,
      format: (value: any, row: any) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Building2 size={16} />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {value || "Chưa cập nhật"}
            </Typography>
            {row.isSuperhost && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  mt: 0.5,
                }}
              >
                <Award size={14} color="#FFD700" />
                <Typography
                  variant="caption"
                  sx={{ color: "#FFD700", fontWeight: 600 }}
                >
                  Superhost
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      ),
    },
    {
      id: "bankName",
      label: "Ngân hàng",
      minWidth: 150,
      sortable: false,
      format: (value: any, row: any) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.bankAccountNumber}
          </Typography>
        </Box>
      ),
    },
    {
      id: "totalHomestays",
      label: "Homestay",
      minWidth: 100,
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
          <Home size={14} /> {value}
        </Typography>
      ),
    },
    {
      id: "totalBookings",
      label: "Lượt đặt",
      minWidth: 100,
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
          <ShoppingBag size={14} /> {value?.toLocaleString()}
        </Typography>
      ),
    },
    {
      id: "averageRating",
      label: "Đánh giá",
      minWidth: 100,
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
          <StarIcon size={14} fill="#FFD700" color="#FFD700" />{" "}
          {value?.toFixed(1) || "0.0"}
        </Typography>
      ),
    },
    {
      id: "responseRate",
      label: "Tỷ lệ phản hồi",
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
          <TrendingUp size={14} /> {value}%
        </Typography>
      ),
    },
    {
      id: "status",
      label: "Trạng thái duyệt",
      minWidth: 130,
      sortable: true,
      format: (value: any) => {
        const statusInfo = getStatusInfo(value);
        const borderColor =
          statusInfo.color === "success"
            ? "#4CAF50"
            : statusInfo.color === "error"
            ? "#f44336"
            : statusInfo.color === "warning"
            ? "#FF9800"
            : statusInfo.color === "info"
            ? "#2196F3"
            : "#9E9E9E";
        const bgColor = alpha(borderColor, 0.1);

        return (
          <Box
            sx={{
              border: `1px solid ${borderColor}`,
              backgroundColor: bgColor,
              width: "110px",
              textAlign: "center",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: borderColor,
            }}
          >
            {statusInfo.label}
          </Box>
        );
      },
    },
    {
      id: "isActive",
      label: "Hoạt động",
      minWidth: 100,
      sortable: true,
      format: (value: any) => {
        const color = value ? "success" : "error";
        const borderColor = theme.palette[color].main;
        const bgColor = alpha(theme.palette[color].main, 0.1);

        return (
          <Box
            sx={{
              border: `1px solid ${borderColor}`,
              backgroundColor: bgColor,
              width: "80px",
              textAlign: "center",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: borderColor,
            }}
          >
            {value ? "Có" : "Không"}
          </Box>
        );
      },
    },
    {
      id: "registeredAsHostAt",
      label: "Ngày đăng ký",
      minWidth: 130,
      sortable: true,
      format: (value: any) => (
        <Typography
          variant="body2"
          sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
        >
          <Calendar size={14} />
          {new Date(value).toLocaleDateString("vi-VN")}
        </Typography>
      ),
    },
    {
      id: "reviewedAt",
      label: "Ngày xét duyệt",
      minWidth: 130,
      sortable: true,
      format: (value: any) =>
        value ? (
          <Typography variant="body2">
            {new Date(value).toLocaleDateString("vi-VN")}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Chưa xét duyệt
          </Typography>
        ),
    },
  ];

  // Dynamic menu actions
  const getMenuActions = (): MenuAction<HostProfile>[] => {
    const actions: MenuAction<HostProfile>[] = [
      {
        label: "View Details",
        icon: <VisibilityIcon sx={{ mr: 1 }} />,
        onClick: (host: HostProfile) => {
          navigate(`/admin/hosts/${host.id}/view`);
        },
      },
    ];

    // Add approve/reject actions if status is Pending or RequiresMoreInfo
    if (
      tableState.selectedItem &&
      (tableState.selectedItem.status === HostStatus.Pending ||
        tableState.selectedItem.status === HostStatus.RequiresMoreInfo)
    ) {
      actions.push(
        {
          label: "Approve",
          icon: <ApproveIcon />,
          onClick: (host: HostProfile) => {
            handleOpenApproveReject("approve", host);
          },
          color: "success",
        },
        {
          label: "Reject",
          icon: <RejectIcon />,
          onClick: (host: HostProfile) => {
            handleOpenApproveReject("reject", host);
          },
          color: "error",
        }
      );
    }

    // Add superhost toggle
    if (tableState.selectedItem?.status === HostStatus.Approved) {
      actions.push({
        label: tableState.selectedItem?.isSuperhost
          ? "Remove Superhost"
          : "Mark as Superhost",
        icon: <SuperhostIcon />,
        onClick: (host: HostProfile) => {
          handleToggleSuperhost(host);
        },
        color: "error",
      });
    }

    // Add activate/deactivate
    actions.push({
      label: tableState.selectedItem?.isActive ? "Deactivate" : "Activate",
      icon: tableState.selectedItem?.isActive ? (
        <DeactivateIcon />
      ) : (
        <ActivateIcon />
      ),
      onClick: (host: HostProfile) => {
        handleToggleActive(host);
      },
    });

    // Add delete
    actions.push({
      label: "Delete",
      icon: <DeleteIcon />,
      onClick: (host: HostProfile) => {
        handleOpenDeleteConfirm(host);
      },
      color: "error",
      divider: true,
    });

    return actions;
  };

  // Handle Toggle Superhost
  const handleToggleSuperhost = useCallback(
    async (host: HostProfile) => {
      try {
        await markAsSuperhost({
          hostProfileId: host.id,
          data: { isSuperhost: !host.isSuperhost },
        }).unwrap();
        toast.success(
          `${
            host.isSuperhost
              ? "Đã gỡ trạng thái Superhost"
              : "Đã đánh dấu là Superhost"
          }`
        );
        refetch();
      } catch (error) {
        console.error(error);
        toast.error("Không thể cập nhật trạng thái Superhost");
      }
    },
    [markAsSuperhost, refetch, toast]
  );

  // Handle Toggle Active
  const handleToggleActive = useCallback(
    async (host: HostProfile) => {
      try {
        await toggleActiveStatus({
          hostProfileId: host.id,
          data: { isActive: !host.isActive },
        }).unwrap();
        toast.success(
          `${host.isActive ? "Đã vô hiệu hóa" : "Đã kích hoạt"} host`
        );
        refetch();
      } catch (error) {
        console.error(error);
        toast.error("Không thể cập nhật trạng thái hoạt động");
      }
    },
    [toggleActiveStatus, refetch, toast]
  );

  // Handle sort
  const handleSort = useCallback(
    (columnId: keyof HostProfile, order: "asc" | "desc") => {
      setSortBy(String(columnId));
      setSortDirection(order);
      handleSetPageNumber(1);
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
    if (deleteConfirmState.host) {
      try {
        const success = await handleDeleteHost(deleteConfirmState.host.userId);
        if (success) {
          handleCloseDeleteConfirm();
          refetch();
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, [
    deleteConfirmState.host,
    handleDeleteHost,
    handleCloseDeleteConfirm,
    refetch,
  ]);

  // Handle approve/reject confirm
  const handleConfirmApproveReject = useCallback(
    async (note: string) => {
      if (approveRejectState.host) {
        try {
          if (approveRejectState.mode === "approve") {
            await handleApproveHost(approveRejectState.host.id, note);
          } else {
            await handleRejectHost(approveRejectState.host.id, note);
          }
          handleCloseApproveReject();
          refetch();
        } catch (error) {
          console.error(error);
        }
      }
    },
    [
      approveRejectState,
      handleApproveHost,
      handleRejectHost,
      handleCloseApproveReject,
      refetch,
    ]
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
          Quản lý chủ Homestay
        </Typography>
        <HostToolbar
          searchTerm={filters.searchTerm || ""}
          onSearchChange={handleSearchChange}
          onRefresh={() => refetch()}
          onExportExcel={handleExportExcel}
          onExportPdf={handleExportPdf}
          onExportCsv={handleExportCsv}
          isExporting={isExporting}
          isLoading={isLoading}
          onToggleFilters={() => setIsFilterSidebarOpen(true)}
        />

        <GenericTable<HostProfile>
          columns={columns}
          data={hostProfiles}
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

      <GenericTableMenu<HostProfile>
        anchorEl={tableState.anchorEl}
        open={tableState.isMenuOpen}
        item={tableState.selectedItem}
        onClose={tableState.handleCloseMenu}
        actions={getMenuActions()}
      />

      <DeleteConfirmDialog
        open={deleteConfirmState.open}
        host={deleteConfirmState.host ?? null}
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDeleteConfirm}
      />

      <ApproveRejectDialog
        open={approveRejectState.open}
        mode={approveRejectState.mode}
        host={approveRejectState.host ?? null}
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

export default HostManagementPage;
