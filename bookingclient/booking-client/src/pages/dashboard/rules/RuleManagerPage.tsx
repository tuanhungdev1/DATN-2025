/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useState } from "react";
import { Box, Typography, Avatar, Chip } from "@mui/material";
import {
  useGetRulesQuery,
  useCreateRuleMutation,
  useUpdateRuleMutation,
  useDeleteRuleMutation,
  useToggleRuleStatusMutation,
} from "@/services/endpoints/rule.api";
import { useTablePagination } from "@/hooks/useTablePagination";
import type {
  RuleFilter,
  CreateRule,
  UpdateRule,
  Rule,
} from "@/types/rule.type";
import { Edit2, Trash2, Eye } from "lucide-react";
import { GenericTable } from "@/components/table/GenericTable";
import { GenericTableMenu } from "@/components/menu/GenericTableMenu";
import type { Column } from "@/components/table/GenericTable";
import type { MenuAction } from "@/components/menu/GenericTableMenu";
import { RuleDetailDialog } from "./components/RuleDetailDialog";
import { RuleFormDialog } from "./components/RuleFormDialog";
import { useToast } from "@/hooks/useToast";
import { DeleteConfirmDialog } from "../amenities/components/DeleteConfirmDialog";
import { RuleToolbar } from "./components/RuleToolbar";

interface MenuState {
  open: boolean;
  anchorEl: HTMLElement | null;
  item: Rule | null;
}

type DialogType = "detail" | "create" | "edit" | "delete";

type DialogState = Record<
  DialogType,
  {
    open: boolean;
    data?: Rule;
  }
>;

const RuleManagerPage: React.FC = () => {
  const { pageNumber, pageSize, handlePageChange, handlePageSizeChange } =
    useTablePagination();

  const [searchTerm, setSearchTerm] = useState("");
  const [ruleType, setRuleType] = useState<string>();
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

  const filter: RuleFilter = {
    search: searchTerm,
    ruleType,
    isActive,
    sortBy,
    sortOrder,
    pageNumber,
    pageSize,
  };

  const { data: rulesData, isLoading, refetch } = useGetRulesQuery(filter);

  const [createRule, { isLoading: isCreating }] = useCreateRuleMutation();
  const [updateRule, { isLoading: isUpdating }] = useUpdateRuleMutation();
  const [deleteRule, { isLoading: isDeleting }] = useDeleteRuleMutation();
  const [setStatus] = useToggleRuleStatusMutation();
  const { success, error } = useToast();

  // ===== Dialog Handlers =====
  const openDialog = (type: DialogType, data?: Rule) => {
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
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, item: Rule) => {
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
  const handleCreate = async (values: CreateRule | UpdateRule) => {
    try {
      await createRule(values as CreateRule).unwrap();
      closeDialog("create");
      refetch();
      success("Thêm quy tắc thành công!");
    } catch (err) {
      console.error("Create error:", err);
      error("Không thể thêm quy tắc. Vui lòng thử lại!");
    }
  };

  const handleUpdate = async (values: UpdateRule) => {
    try {
      const ruleId = dialogState.edit.data?.id;
      if (!ruleId) return;
      await updateRule({ id: ruleId, data: values }).unwrap();
      closeDialog("edit");
      refetch();
      success("Cập nhật quy tắc thành công!");
    } catch (err) {
      console.error("Update error:", err);
      error("Không thể cập nhật quy tắc. Vui lòng thử lại!");
    }
  };

  const handleDelete = async () => {
    try {
      const ruleId = dialogState.delete.data?.id;
      if (!ruleId) return;
      await deleteRule(ruleId).unwrap();
      closeDialog("delete");
      handleMenuClose();
      refetch();
      success("Xóa quy tắc thành công!");
    } catch (err) {
      console.error("Delete error:", err);
      error("Không thể xóa quy tắc. Vui lòng thử lại!");
    }
  };

  const handleToggleStatus = async (rule: Rule) => {
    try {
      await setStatus(rule.id).unwrap();
      handleMenuClose();
      refetch();
      success(
        rule.isActive ? "Đã vô hiệu hóa quy tắc!" : "Đã kích hoạt quy tắc!"
      );
    } catch (err) {
      console.error("Status toggle error:", err);
      error("Không thể thay đổi trạng thái quy tắc. Vui lòng thử lại!");
    }
  };

  const handleFilterChange = (filter: {
    ruleType?: string;
    isActive?: boolean;
  }) => {
    if (filter.ruleType !== undefined) {
      setRuleType(filter.ruleType);
    }
    if (filter.isActive !== undefined) {
      setIsActive(filter.isActive);
    }
  };

  const handleSort = useCallback(
    (columnId: keyof Rule, order: "asc" | "desc") => {
      if (
        columnId === "ruleName" ||
        columnId === "ruleDescription" ||
        columnId === "ruleType" ||
        columnId === "createdAt"
      ) {
        setSortBy(columnId);
        setSortOrder(order);
        handlePageChange(null, 0); // Reset về trang 1 khi sort
      }
    },
    [handlePageChange]
  );

  // ===== Table Columns =====
  const columns: Column<Rule>[] = [
    {
      id: "iconUrl",
      label: "Icon",
      minWidth: 100,
      format: (value) => (
        <Avatar src={value} sx={{ width: 40, height: 40 }} variant="rounded" />
      ),
    },
    {
      id: "ruleName",
      label: "Tên quy tắc",
      minWidth: 150,
      sortable: true,
    },
    {
      id: "ruleDescription",
      label: "Mô tả quy tắc",
      minWidth: 150,
      sortable: true,
    },
    {
      id: "ruleType",
      label: "Loại quy tắc",
      minWidth: 120,
      sortable: true,
      format: (value) => <Chip label={value} size="small" variant="outlined" />,
    },
    {
      id: "displayOrder",
      label: "Thứ tự hiển thị",
      minWidth: 100,
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

  // ===== Menu Actions =====
  const menuActions: MenuAction<Rule>[] = [
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

  const data = rulesData?.data?.items || [];
  const totalCount = rulesData?.data?.totalCount || 0;

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
          Quản lý quy tắc
        </Typography>

        <RuleToolbar
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

        <GenericTable<Rule>
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
        <GenericTableMenu<Rule>
          open={menuState.open}
          anchorEl={menuState.anchorEl}
          item={menuState.item}
          onClose={handleMenuClose}
          actions={menuActions}
        />
      </Box>

      {/* Dialogs */}
      <RuleDetailDialog
        open={dialogState.detail.open}
        rule={dialogState.detail.data || null}
        onClose={() => closeDialog("detail")}
      />

      <RuleFormDialog
        open={dialogState.create.open}
        isLoading={isCreating}
        onSubmit={handleCreate}
        onClose={() => closeDialog("create")}
      />

      <RuleFormDialog
        open={dialogState.edit.open}
        rule={dialogState.edit.data}
        isLoading={isUpdating}
        onSubmit={handleUpdate}
        onClose={() => closeDialog("edit")}
      />

      <DeleteConfirmDialog
        open={dialogState.delete.open}
        title="Xóa quy tắc"
        message={`Bạn có chắc chắn muốn xóa quy tắc "${dialogState.delete.data?.ruleName}"? Hành động này không thể hoàn tác.`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => closeDialog("delete")}
      />
    </Box>
  );
};

export default RuleManagerPage;
