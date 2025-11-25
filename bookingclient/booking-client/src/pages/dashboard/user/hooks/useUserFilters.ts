// src/pages/admin/UserManagement/components/hooks/useUserFilters.ts
import type { UserFilters } from "@/types/user.types";
import { useState, useCallback } from "react";

export const useUserFilters = () => {
  const [filterState, setFilterState] = useState<UserFilters>({
    search: "",
    isActive: undefined,
    pageNumber: 1,
    pageSize: 10,
    sortBy: "fullName",
    sortOrder: "asc",
  });

  const handleSearchChange = useCallback((value: string) => {
    setFilterState((prev) => ({
      ...prev,
      searchTerm: value,
      pageNumber: 1,
    }));
  }, []);

  const handleStatusFilterChange = useCallback((isActive?: boolean) => {
    setFilterState((prev) => ({
      ...prev,
      isActive,
      pageNumber: 1,
    }));
  }, []);

  const handlePageChange = useCallback((_event: unknown, newPage: number) => {
    setFilterState((prev) => ({
      ...prev,
      pageNumber: newPage + 1,
    }));
  }, []);

  const handlePageSizeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFilterState((prev) => ({
        ...prev,
        pageSize: parseInt(event.target.value, 10),
        pageNumber: 1,
      }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilterState({
      search: "",
      isActive: undefined,
      pageNumber: 1,
      pageSize: 10,
    });
  }, []);

  return {
    filterState,
    handleSearchChange,
    handleStatusFilterChange,
    handlePageChange,
    handlePageSizeChange,
    resetFilters,
  };
};
