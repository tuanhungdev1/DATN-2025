/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useState } from "react";
import { Box, Typography, Avatar, Chip } from "@mui/material";
import {
  useGetPropertyTypesQuery,
  useCreatePropertyTypeMutation,
  useUpdatePropertyTypeMutation,
  useDeletePropertyTypeMutation,
  useSetPropertyTypeStatusMutation,
} from "@/services/endpoints/propertyType.api";
import { useTablePagination } from "@/hooks/useTablePagination";
import type {
  PropertyTypeFilter,
  CreatePropertyType,
  UpdatePropertyType,
  PropertyType,
} from "@/types/propertyType.types";
import { Edit2, Trash2, Eye } from "lucide-react";
import { GenericTable } from "@/components/table/GenericTable";
import { GenericTableMenu } from "@/components/menu/GenericTableMenu";
import type { Column } from "@/components/table/GenericTable";
import type { MenuAction } from "@/components/menu/GenericTableMenu";
import { PropertyTypeDetailDialog } from "./components/PropertyTypeDetailDialog";
import { PropertyTypeFormDialog } from "./components/PropertyTypeFormDialog";
import { useToast } from "@/hooks/useToast";
import { DeleteConfirmDialog } from "../amenities/components/DeleteConfirmDialog";
import { PropertyTypeToolbar } from "./components/PropertyTypeToolbar";

interface MenuState {
  open: boolean;
  anchorEl: HTMLElement | null;
  item: PropertyType | null;
}

type DialogType = "detail" | "create" | "edit" | "delete";

type DialogState = Record<
  DialogType,
  {
    open: boolean;
    data?: PropertyType;
  }
>;

const PropertyTypeManagerPage: React.FC = () => {
  const { pageNumber, pageSize, handlePageChange, handlePageSizeChange } =
    useTablePagination();

  const [searchTerm, setSearchTerm] = useState("");
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

  const filter: PropertyTypeFilter = {
    search: searchTerm,
    isActive,
    sortBy,
    sortOrder,
    pageNumber,
    pageSize,
  };

  const {
    data: propertyTypeData,
    isLoading,
    refetch,
  } = useGetPropertyTypesQuery(filter);

  const [createPropertyType, { isLoading: isCreating }] =
    useCreatePropertyTypeMutation();
  const [updatePropertyType, { isLoading: isUpdating }] =
    useUpdatePropertyTypeMutation();
  const [deletePropertyType, { isLoading: isDeleting }] =
    useDeletePropertyTypeMutation();
  const [setStatus] = useSetPropertyTypeStatusMutation();

  const { success, error } = useToast();

  // ===== Dialog Handlers =====
  const openDialog = (type: DialogType, data?: PropertyType) => {
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

  // ===== Menu Handlers =====
  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    item: PropertyType
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

  // ===== CRUD Actions =====
  const handleCreate = async (
    values: CreatePropertyType | UpdatePropertyType
  ) => {
    try {
      await createPropertyType(values as CreatePropertyType).unwrap();
      closeDialog("create");
      refetch();
      success("Thêm loại bất động sản thành công!");
    } catch (err) {
      console.error("Create error:", err);
      error("Không thể thêm loại bất động sản. Vui lòng thử lại!");
    }
  };

  const handleUpdate = async (values: UpdatePropertyType) => {
    try {
      const id = dialogState.edit.data?.id;
      if (!id) return;
      await updatePropertyType({ id, data: values }).unwrap();
      closeDialog("edit");
      refetch();
      success("Cập nhật loại bất động sản thành công!");
    } catch (err) {
      console.error("Update error:", err);
      error("Không thể cập nhật loại bất động sản. Vui lòng thử lại!");
    }
  };

  const handleDelete = async () => {
    try {
      const id = dialogState.delete.data?.id;
      if (!id) return;
      await deletePropertyType(id).unwrap();
      closeDialog("delete");
      handleMenuClose();
      refetch();
      success("Xóa loại bất động sản thành công!");
    } catch (err) {
      console.error("Delete error:", err);
      error("Không thể xóa loại bất động sản. Vui lòng thử lại!");
    }
  };

  const handleToggleStatus = async (propertyType: PropertyType) => {
    try {
      await setStatus({
        id: propertyType.id,
        isActive: !propertyType.isActive,
      }).unwrap();
      handleMenuClose();
      refetch();
      success(
        propertyType.isActive
          ? "Đã vô hiệu hóa loại bất động sản!"
          : "Đã kích hoạt loại bất động sản!"
      );
    } catch (err) {
      console.error("Status toggle error:", err);
      error(
        "Không thể thay đổi trạng thái loại bất động sản. Vui lòng thử lại!"
      );
    }
  };

  const handleFilterChange = (filter: { isActive?: boolean }) => {
    if (filter.isActive !== undefined) {
      setIsActive(filter.isActive);
    }
  };

  const handleSort = useCallback(
    (columnId: keyof PropertyType, order: "asc" | "desc") => {
      if (
        columnId === "typeName" ||
        columnId === "description" ||
        columnId === "createdAt" ||
        columnId === "updatedAt" ||
        columnId === "displayOrder"
      ) {
        setSortBy(columnId);
        setSortOrder(order);
        handlePageChange(null, 0);
      }
    },
    [handlePageChange]
  );

  // ===== Table Columns =====
  const columns: Column<PropertyType>[] = [
    {
      id: "iconUrl",
      label: "Image",
      minWidth: 100,
      format: (value) => (
        <Avatar src={value} sx={{ width: 40, height: 40 }} variant="rounded" />
      ),
    },
    {
      id: "typeName",
      label: "Tên loại bất động sản",
      minWidth: 150,
      sortable: true,
    },
    {
      id: "description",
      label: "Mô tả",
      minWidth: 180,
      sortable: true,
    },
    {
      id: "displayOrder",
      label: "Thứ tự hiển thị",
      minWidth: 100,
      align: "center",
      sortable: true,
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

  // ===== Menu Actions =====
  const menuActions: MenuAction<PropertyType>[] = [
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

  const data = propertyTypeData?.data?.items || [];
  const totalCount = propertyTypeData?.data?.totalCount || 0;

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
          Quản lý loại bất động sản
        </Typography>

        <PropertyTypeToolbar
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

        <GenericTable<PropertyType>
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
        <GenericTableMenu<PropertyType>
          open={menuState.open}
          anchorEl={menuState.anchorEl}
          item={menuState.item}
          onClose={handleMenuClose}
          actions={menuActions}
        />
      </Box>

      {/* Dialogs */}
      <PropertyTypeDetailDialog
        open={dialogState.detail.open}
        propertyType={dialogState.detail.data || null}
        onClose={() => closeDialog("detail")}
      />

      <PropertyTypeFormDialog
        open={dialogState.create.open}
        isLoading={isCreating}
        onSubmit={handleCreate}
        onClose={() => closeDialog("create")}
      />

      <PropertyTypeFormDialog
        open={dialogState.edit.open}
        propertyType={dialogState.edit.data}
        isLoading={isUpdating}
        onSubmit={handleUpdate}
        onClose={() => closeDialog("edit")}
      />

      <DeleteConfirmDialog
        open={dialogState.delete.open}
        title="Xóa loại bất động sản"
        message={`Bạn có chắc chắn muốn xóa loại bất động sản "${dialogState.delete.data?.typeName}"? Hành động này không thể hoàn tác.`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => closeDialog("delete")}
      />
    </Box>
  );
};

export default PropertyTypeManagerPage;
