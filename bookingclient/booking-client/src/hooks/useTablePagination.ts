// src/hooks/useTablePagination.ts
import { useCallback, useState } from "react";

export const useTablePagination = () => {
  const [pageNumber, setPageNumber] = useState(1);

  const [pageSize, setPageSize] = useState(10);

  const handlePageChange = useCallback((_event: unknown, newPage: number) => {
    setPageNumber(newPage + 1);
  }, []);

  const handlePageSizeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newPageSize = parseInt(event.target.value, 10);
      setPageSize(newPageSize);
      setPageNumber(1);
    },
    []
  );

  return {
    pageNumber,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
  };
};
