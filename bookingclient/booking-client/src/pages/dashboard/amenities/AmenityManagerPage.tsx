/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useState } from "react";
import { Box, Typography } from "@mui/material";
import {
  useGetAmenitiesQuery,
  useCreateAmenityMutation,
  useUpdateAmenityMutation,
  useDeleteAmenityMutation,
  useSetAmenityStatusMutation,
} from "@/services/endpoints/amenity.api";

import { useTablePagination } from "@/hooks/useTablePagination";
import type {
  Amenity,
  AmenityFilter,
  CreateAmenity,
  UpdateAmenity,
} from "@/types/amenity.types";
import { Edit2, Trash2, Eye } from "lucide-react";
import { Avatar, Chip } from "@mui/material";
import { UserToolbar } from "./components/AmenityToolbar";
import { GenericTable } from "@/components/table/GenericTable";
import { GenericTableMenu } from "@/components/menu/GenericTableMenu";
import type { Column } from "@/components/table/GenericTable";
import type { MenuAction } from "@/components/menu/GenericTableMenu";
import { AmenityDetailDialog } from "./components/AmenityDetailDialog";
import { AmenityFormDialog } from "./components/AmenityFormDialog";
import { DeleteConfirmDialog } from "./components/DeleteConfirmDialog";
import { useToast } from "@/hooks/useToast";

interface MenuState {
  open: boolean;
  anchorEl: HTMLElement | null;
  item: Amenity | null;
}

type DialogType = "detail" | "create" | "edit" | "delete";

type DialogState = Record<
  DialogType,
  {
    open: boolean;
    data?: Amenity;
  }
>;

const AmenityManagerPage: React.FC = () => {
  const { pageNumber, pageSize, handlePageChange, handlePageSizeChange } =
    useTablePagination();

  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<string>();
  const [isActive, setIsActive] = useState<boolean>();
  const [sortBy, setSortBy] = useState<string>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [menuState, setMenuState] = useState<MenuState>({
    open: false,
    anchorEl: null,
    item: null,
  });

  const [dialogState, setDialogState] = useState<DialogState>({
    detail: { open: false },
    create: { open: false },
    edit: { open: false },
    delete: { open: false },
  });

  // API Queries & Mutations
  const filter: AmenityFilter = {
    search: searchTerm,
    category,
    isActive,
    sortBy,
    sortOrder,
    pageNumber,
    pageSize,
  };

  const {
    data: amenitiesData,
    isLoading,
    refetch,
  } = useGetAmenitiesQuery(filter);
  const [createAmenity, { isLoading: isCreating }] = useCreateAmenityMutation();
  const [updateAmenity, { isLoading: isUpdating }] = useUpdateAmenityMutation();
  const [deleteAmenity, { isLoading: isDeleting }] = useDeleteAmenityMutation();
  const [setStatus] = useSetAmenityStatusMutation();
  const { success, error } = useToast();

  // Dialog Handlers
  const openDialog = (type: DialogType, data?: Amenity) => {
    setDialogState((prev) => ({
      ...prev,
      [type]: { open: true, data },
    }));
  };

  const closeDialog = (type: DialogType) => {
    setDialogState((prev) => ({
      ...prev,
      [type]: { open: false },
    }));
  };

  // Menu Handlers
  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    item: Amenity
  ) => {
    setMenuState({
      open: true,
      anchorEl: event.currentTarget,
      item,
    });
  };

  const handleMenuClose = () => {
    setMenuState({ open: false, anchorEl: null, item: null });
  };

  // Action Handlers
  const handleCreate = async (values: CreateAmenity | UpdateAmenity) => {
    try {
      await createAmenity(values as CreateAmenity).unwrap();
      closeDialog("create");
      refetch();
      success("Thêm tiện nghi thành công!");
    } catch (err) {
      console.error("Create error:", err);
      error("Không thể thêm tiện nghi. Vui lòng thử lại!");
    }
  };

  const handleUpdate = async (values: UpdateAmenity) => {
    try {
      const amenityId = dialogState.edit.data?.id;
      if (!amenityId) return;
      await updateAmenity({ id: amenityId, data: values }).unwrap();
      closeDialog("edit");
      refetch();
      success("Cập nhật tiện nghi thành công!");
    } catch (err) {
      console.error("Update error:", err);
      error("Không thể cập nhật tiện nghi. Vui lòng thử lại!");
    }
  };

  const handleDelete = async () => {
    try {
      const amenityId = dialogState.delete.data?.id;
      if (!amenityId) return;
      await deleteAmenity(amenityId).unwrap();
      closeDialog("delete");
      handleMenuClose();
      refetch();
      success("Xóa tiện nghi thành công!");
    } catch (err) {
      console.error("Delete error:", err);
      error("Không thể xóa tiện nghi. Vui lòng thử lại!");
    }
  };

  const handleToggleStatus = async (amenity: Amenity) => {
    try {
      await setStatus({ id: amenity.id, isActive: !amenity.isActive }).unwrap();
      handleMenuClose();
      refetch();
      success(
        amenity.isActive
          ? "Đã vô hiệu hóa tiện nghi!"
          : "Đã kích hoạt tiện nghi!"
      );
    } catch (err) {
      console.error("Status toggle error:", err);
      error("Không thể thay đổi trạng thái tiện nghi. Vui lòng thử lại!");
    }
  };

  const handleFilterChange = (filter: {
    category?: string;
    isActive?: boolean;
  }) => {
    if (filter.category !== undefined) {
      setCategory(filter.category);
    }
    if (filter.isActive !== undefined) {
      setIsActive(filter.isActive);
    }
  };

  const handleSort = useCallback(
    (columnId: keyof Amenity, order: "asc" | "desc") => {
      if (
        columnId === "amenityName" ||
        columnId === "amenityDescription" ||
        columnId === "category" ||
        columnId === "createdAt"
      ) {
        setSortBy(columnId);
        setSortOrder(order);
        handlePageChange(null, 0); // Reset về trang 1 khi sort
      }
    },
    [handlePageChange]
  );

  // Table Columns
  const columns: Column<Amenity>[] = [
    {
      id: "iconUrl",
      label: "Icon",
      minWidth: 100,
      format: (value) => (
        <Avatar src={value} sx={{ width: 40, height: 40 }} variant="rounded" />
      ),
    },
    {
      id: "amenityName",
      label: "Tên tiện nghi",
      minWidth: 150,
      sortable: true,
    },
    {
      id: "amenityDescription",
      label: "Mô tả tiện nghi",
      minWidth: 150,
      sortable: true,
    },
    {
      id: "category",
      label: "Danh mục",
      minWidth: 120,
      sortable: true,
      format: (value) => <Chip label={value} size="small" variant="outlined" />,
    },
    {
      id: "usageCount",
      label: "Lần sử dụng",
      minWidth: 100,
      align: "center",
    },
    {
      id: "displayOrder",
      label: "Thứ tự",
      minWidth: 80,
      align: "center",
    },
    {
      id: "isActive",
      label: "Trạng thái",
      minWidth: 100,
      align: "center",
      format: (value) => (
        <Chip
          label={value ? "Hoạt động" : "Vô hiệu"}
          color={value ? "success" : "default"}
          size="small"
        />
      ),
    },
    {
      id: "createdAt",
      label: "Ngày tạo",
      minWidth: 130,
      sortable: true,
      format: (value) => new Date(value).toLocaleDateString("vi-VN"),
    },
  ];

  // Menu Actions
  const menuActions: MenuAction<Amenity>[] = [
    {
      label: "Xem chi tiết",
      icon: <Eye size={18} />,
      onClick: (item: any) => {
        openDialog("detail", item);
        handleMenuClose();
      },
    },
    {
      label: "Chỉnh sửa",
      icon: <Edit2 size={18} />,
      onClick: (item: any) => {
        openDialog("edit", item);
        handleMenuClose();
      },
    },
    {
      label: menuState.item?.isActive ? "Vô hiệu hóa" : "Kích hoạt",
      icon: <Edit2 size={18} />,
      onClick: (item: any) => {
        handleToggleStatus(item);
      },
    },
    {
      label: "Xóa",
      icon: <Trash2 size={18} />,
      color: "error",
      onClick: (item: any) => {
        openDialog("delete", item);
        handleMenuClose();
      },
    },
  ];

  const data = amenitiesData?.data?.items || [];
  const totalCount = amenitiesData?.data?.totalCount || 0;

  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px;",
          borderRadius: "10px",
          px: 3,
          py: 2,
        }}
      >
        <Typography variant="h4" fontSize={"34px"} mb={4} pt={2}>
          Quản lý tiện ích
        </Typography>

        <UserToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onCreateNew={() => openDialog("create")}
          onRefresh={() => refetch()}
          onFilterChange={handleFilterChange}
          onExportCSV={() => {
            console.log("Export CSV");
          }}
          isLoading={isLoading}
        />

        <GenericTable<Amenity>
          columns={columns}
          data={data}
          totalCount={totalCount}
          pageNumber={pageNumber}
          pageSize={pageSize}
          isLoading={isLoading}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onActionClick={handleMenuOpen}
          onSort={handleSort}
        />

        {/* Menu Actions */}
        <GenericTableMenu<Amenity>
          open={menuState.open}
          anchorEl={menuState.anchorEl}
          item={menuState.item}
          onClose={handleMenuClose}
          actions={menuActions}
        />
      </Box>

      {/* Dialogs */}
      <AmenityDetailDialog
        open={dialogState.detail.open}
        amenity={dialogState.detail.data || null}
        onClose={() => closeDialog("detail")}
      />

      <AmenityFormDialog
        open={dialogState.create.open}
        isLoading={isCreating}
        onSubmit={handleCreate}
        onClose={() => closeDialog("create")}
      />

      <AmenityFormDialog
        open={dialogState.edit.open}
        amenity={dialogState.edit.data}
        isLoading={isUpdating}
        onSubmit={handleUpdate}
        onClose={() => closeDialog("edit")}
      />

      <DeleteConfirmDialog
        open={dialogState.delete.open}
        title="Xóa tiện nghi"
        message={`Bạn có chắc chắn muốn xóa tiện nghi "${dialogState.delete.data?.amenityName}"? Hành động này không thể hoàn tác.`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => closeDialog("delete")}
      />
    </Box>
  );
};

export default AmenityManagerPage;
