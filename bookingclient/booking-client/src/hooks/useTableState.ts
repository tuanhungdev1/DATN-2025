// src/hooks/useTableState.ts
import { useTableMenu } from "./useTableMenu";
import { useTablePagination } from "./useTablePagination";

export const useTableState = <T extends { id: number }>() => {
  const menu = useTableMenu<T>();
  const pagination = useTablePagination();

  return {
    // Menu
    anchorEl: menu.anchorEl,
    selectedItem: menu.selectedItem,
    isMenuOpen: menu.isMenuOpen,
    handleOpenMenu: menu.handleOpenMenu,
    handleCloseMenu: menu.handleCloseMenu,

    // Pagination
    handlePageChange: pagination.handlePageChange,
    handlePageSizeChange: pagination.handlePageSizeChange,
  };
};
