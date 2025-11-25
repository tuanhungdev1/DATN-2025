/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/admin/UserManagement/UserManagerPage.tsx
import React, { useCallback, useState } from "react";
import { alpha, Box, Typography, useTheme } from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Lock as LockIcon,
} from "@mui/icons-material";

import {
  useDeleteUserAvatarMutation,
  useGetUsersQuery,
  useLockUserMutation,
  useUnlockUserMutation,
} from "@/services/endpoints/user.api";
import { useToast } from "@/hooks/useToast";
import { useTableState } from "@/hooks/useTableState";

import { UserToolbar } from "./components/UserToolbar";
import { UserFormDialog } from "./components/UserFormDialog";
import { DeleteConfirmDialog } from "./components/DeleteConfirmDialog";
import { GenericTable, type Column } from "@/components/table/GenericTable";

import { useUserManagement } from "./hooks/useUserManagement";
import type { User } from "@/types/user.types";

import { AppImage } from "@/components/images";
import {
  GenericTableMenu,
  type MenuAction,
} from "@/components/menu/GenericTableMenu";
import USER_DEFAULT_AVATAR from "@/assets/default_user_avatar.png";
import { useUserActions } from "./hooks/useUserActions";

import { FilterSidebar } from "./components/FilterSidebar";

const UserManagerPage: React.FC = () => {
  const toast = useToast();

  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState<
    "userName" | "email" | "fullName" | "createdAt" | undefined
  >(undefined);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false); // THÊM

  // Redux state
  const {
    filters,
    pageNumber,
    pageSize,
    dialogState,
    deleteConfirmState,
    handleSetSelectedUser,
    handleSetFilter,
    handleSetFilters,
    handleClearFilters,
    handleSetPageNumber,
    handleSetPageSize,
    handleOpenDialog,
    handleCloseDialog,
    handleOpenDeleteConfirm,
    handleCloseDeleteConfirm,
    handleSetSubmitting,
  } = useUserManagement();

  // Table menu & pagination
  const tableState = useTableState<User>();

  // API Query
  const {
    data: usersData,
    isLoading,
    refetch,
  } = useGetUsersQuery({
    sortBy: sortBy ? sortBy : undefined,
    sortOrder,
    ...filters,
    pageNumber,
    pageSize,
  });

  const [lockUser] = useLockUserMutation();
  const [unlockUser] = useUnlockUserMutation();
  const [deleteUserAvatar] = useDeleteUserAvatarMutation(); // THÊM

  // User actions
  const { handleCreateUser, handleUpdateUser, handleDeleteUser } =
    useUserActions(refetch);

  // Data
  const users = usersData?.data?.items || [];
  const totalCount = usersData?.data?.totalCount || 0;

  const columns: Column<User>[] = [
    {
      id: "avatar",
      label: "Avatar",
      minWidth: 50,
      sortable: false,
      format: (value: any) => (
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {value ? (
            <AppImage src={value} alt="Avatar" />
          ) : (
            <AppImage src={USER_DEFAULT_AVATAR} alt="Avatar" />
          )}
        </Box>
      ),
    },
    {
      id: "email",
      label: "Email",
      minWidth: 200,
      sortable: true,
    },
    {
      id: "fullName",
      label: "Fullname",
      minWidth: 150,
      sortable: true,
    },
    {
      id: "phoneNumber",
      label: "Phone",
      minWidth: 150,
      format: (value: any) => value || "N/A",
      sortable: false,
    },
    {
      id: "createdAt",
      label: "Created At",
      minWidth: 150,
      sortable: true,
      format: (value: any) => new Date(value).toLocaleDateString("vi-VN"),
    },
    {
      id: "roles",
      label: "Roles",
      minWidth: 100, // Tăng width để chứa multiple badges
      sortable: false,
      format: (value: any) => {
        if (!value || value.length === 0) return "N/A";
        // Định nghĩa màu cho từng role (có thể customize thêm)
        const roleHexColors: { [key: string]: string } = {
          Admin: "#FF0000", // Đỏ tươi - quyền cao
          Host: "#FFA500", // Cam - trung gian
          User: "#808080", // Xám - cơ bản
          // Thêm nếu cần: "Moderator": "#2196F3", // Xanh dương
        };

        return (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {value.map((role: string, index: number) => {
              const borderColor = roleHexColors[role] || "#9E9E9E"; // Fallback xám nhạt
              const bgColor = alpha(borderColor, 0.1); // Bg nhạt 10% opacity

              return (
                <Box
                  key={index}
                  sx={{
                    border: `1px solid ${borderColor}`,
                    backgroundColor: bgColor,
                    padding: "2px 8px",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    color: borderColor,
                    display: "inline-block",
                    whiteSpace: "nowrap", // Tránh wrap text
                  }}
                >
                  {role}
                </Box>
              );
            })}
          </Box>
        );
      },
    },
    {
      id: "isEmailConfirmed",
      label: "Email Confirmed",
      minWidth: 100,
      sortable: false,
      format: (value: any) => {
        const borderColor = value ? "#4CAF50" : "#2196F3"; // Xanh lá vs Xanh dương
        const bgColor = alpha(borderColor, 0.1);

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
              display: "inline-block",
            }}
          >
            {value ? "Confirmed" : "Unconfirmed"}
          </Box>
        );
      },
    },
    {
      id: "isLocked",
      label: "Locked",
      minWidth: 100,
      sortable: false,
      format: (value: any) => {
        const borderColor = value ? "#F44336" : "#2196F3"; // Đỏ vs Xanh lá
        const bgColor = alpha(borderColor, 0.1);

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
              display: "inline-block",
            }}
          >
            {value ? "Locked" : "Unlocked"}
          </Box>
        );
      },
    },
    {
      id: "isActive",
      label: "Active",
      minWidth: 100,
      sortable: false,
      format: (value: any) => {
        const isActive = value;
        const theme = useTheme(); // Giả sử bạn đã import useTheme từ @mui/material
        const color = isActive ? "success" : "error";
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
              display: "inline-block",
            }}
          >
            {isActive ? "Active" : "Inactive"}
          </Box>
        );
      },
    },
  ];

  // THÊM: Dynamic menu actions - re-compute khi selectedItem thay đổi
  const getMenuActions = (): MenuAction<User>[] => [
    {
      label: "View",
      icon: <VisibilityIcon sx={{ mr: 1 }} />,
      onClick: (user: User) => {
        handleOpenDialog("view", user);
      },
    },
    {
      label: "Edit",
      icon: <EditIcon />,
      onClick: (user: User) => {
        handleOpenDialog("edit", user);
      },
    },
    {
      label: tableState.selectedItem?.isLocked ? "Unlock" : "Lock",
      icon: <LockIcon />,
      onClick: (user: User) => {
        handleLockUnlockUser(user);
      },
    },
    {
      label: "Delete",
      icon: <DeleteIcon />,
      onClick: (user: User) => {
        handleOpenDeleteConfirm(user);
      },
      color: "error",
      divider: true,
    },
  ];

  // Handle Lock/Unlock
  const handleLockUnlockUser = useCallback(
    async (user: User) => {
      try {
        if (user.isLocked) {
          await unlockUser(user.id).unwrap();
          toast.success("User unlocked successfully");
        } else {
          await lockUser(user.id).unwrap();
          toast.success("User locked successfully");
        }
        refetch();
      } catch (error) {
        console.error(error);
        toast.error("Failed to update user lock status");
      }
    },
    [lockUser, unlockUser, refetch, toast]
  );

  // THAY ĐỔI: Handle Avatar Upload - Sử dụng mutation
  const handleAvatarUpload = useCallback(
    async (file: File) => {
      if (!dialogState.user) return;

      try {
        setIsUploadingAvatar(true);

        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL || "https://localhost:7073/api"
          }/user/${dialogState.user.id}/avatar`,
          {
            method: "POST",
            body: formData,
            credentials: "include",
          }
        );

        if (!response.ok) {
          const error = await response.json();
          console.error("Upload error:", error);
          throw new Error(error.message || "Upload failed");
        }

        const data = await response.json();
        console.log("Upload success:", data);

        toast.success("Avatar uploaded successfully");

        // 🔄 Refetch danh sách user
        const { data: newUsers } = await refetch();

        const updatedUser = newUsers?.data?.items.find(
          (u) => u.id === dialogState.user!.id
        );
        if (updatedUser) {
          handleSetSelectedUser(updatedUser);
        }
      } catch (error) {
        console.error("Upload failed:", error);
        toast.error("Failed to upload avatar");
      } finally {
        setIsUploadingAvatar(false);
      }
    },
    [dialogState.user, refetch, toast, handleSetSelectedUser]
  );

  // THAY ĐỔI: Handle Avatar Delete - Sử dụng mutation
  const handleAvatarDelete = useCallback(async () => {
    if (!dialogState.user) return;

    try {
      setIsUploadingAvatar(true);
      await deleteUserAvatar(dialogState.user.id).unwrap();

      toast.success("Avatar deleted successfully");
      refetch();

      const { data: newUsers } = await refetch();
      const updatedUser = newUsers?.data?.items.find(
        (u) => u.id === dialogState.user!.id
      );
      if (updatedUser) {
        handleSetSelectedUser(updatedUser);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete avatar");
    } finally {
      setIsUploadingAvatar(false);
    }
  }, [
    dialogState.user,
    deleteUserAvatar,
    refetch,
    toast,
    handleSetSelectedUser,
  ]);
  // THÊM: Handle sort
  const handleSort = useCallback(
    (columnId: keyof User, order: "asc" | "desc") => {
      if (
        columnId === "userName" ||
        columnId === "email" ||
        columnId === "fullName" ||
        columnId === "createdAt"
      ) {
        setSortBy(columnId);
        setSortOrder(order);
        handleSetPageNumber(1); // Reset về trang 1 khi sort
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

  // Handle form submit
  const handleFormSubmit = useCallback(
    async (values: any, { setSubmitting }: any) => {
      try {
        if (dialogState.mode === "create") {
          await handleCreateUser(values);
        } else if (dialogState.mode === "edit") {
          await handleUpdateUser(dialogState.user!.id, values);
        }
        handleCloseDialog();
        refetch();
      } catch (error) {
        console.error(error);
        toast.error("An error occurred");
      } finally {
        setSubmitting(false);
      }
    },
    [
      dialogState,
      handleCreateUser,
      handleUpdateUser,
      handleCloseDialog,
      refetch,
      toast,
    ]
  );

  // Handle delete confirm
  const handleConfirmDelete = useCallback(async () => {
    if (deleteConfirmState.user) {
      handleSetSubmitting(true);
      try {
        const success = await handleDeleteUser(deleteConfirmState.user.id);
        if (success) {
          handleCloseDeleteConfirm();
          refetch();
        }
      } finally {
        handleSetSubmitting(false);
      }
    }
  }, [
    deleteConfirmState.user,
    handleDeleteUser,
    handleCloseDeleteConfirm,
    handleSetSubmitting,
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
        }}
      >
        <Typography variant="h4" fontSize={"34px"} mb={4} pt={2}>
          User Management
        </Typography>
        <UserToolbar
          searchTerm={filters.search || ""}
          onSearchChange={handleSearchChange}
          onCreateNew={() => handleOpenDialog("create")}
          onRefresh={() => refetch()}
          onExportCSV={() => toast.success("Exported")}
          isLoading={isLoading}
          onToggleFilters={() => setIsFilterSidebarOpen(true)}
        />

        <GenericTable<User>
          columns={columns}
          data={users}
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

      <GenericTableMenu<User>
        anchorEl={tableState.anchorEl}
        open={tableState.isMenuOpen}
        item={tableState.selectedItem}
        onClose={tableState.handleCloseMenu}
        actions={getMenuActions()} // THÊM: Gọi hàm để lấy dynamic actions
      />

      <UserFormDialog
        open={dialogState.open}
        mode={dialogState.mode}
        user={dialogState.user ?? undefined}
        onClose={handleCloseDialog}
        onSubmit={handleFormSubmit}
        onAvatarUpload={
          dialogState.mode === "edit" ? handleAvatarUpload : undefined
        }
        onAvatarDelete={
          dialogState.mode === "edit" ? handleAvatarDelete : undefined
        }
        isUploadingAvatar={isUploadingAvatar} // THÊM: Truyền state
      />

      <DeleteConfirmDialog
        open={deleteConfirmState.open}
        user={deleteConfirmState.user ?? null}
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

export default UserManagerPage;
