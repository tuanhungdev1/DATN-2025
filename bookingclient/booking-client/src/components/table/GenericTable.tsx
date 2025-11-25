/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/Table/GenericTable.tsx

import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  CircularProgress,
  Alert,
  TableSortLabel,
} from "@mui/material";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";

export interface Column<T> {
  id: keyof T; // Phải là property của T (User, Product...)
  label: string; // Tiêu đề cột
  minWidth?: number; // Độ rộng tối thiểu
  align?: "left" | "right" | "center"; // Căn lề
  format?: (value: any, row?: T) => React.ReactNode; // Tùy chỉnh cách hiển thị
  sortable?: boolean; // Có thể sắp xếp không
}

export interface GenericTableProps<T> {
  columns: Column<T>[]; // Danh sách cột (Ví dụ: [{ id: "email", label: "Email" }, ...])
  data: T[]; // Dữ liệu để hiển thị (Ví dụ: [{ id: 1, email: "a@b.com" }, ...])
  totalCount: number; // Tổng số bản ghi (dùng cho phân trang)
  pageNumber: number; // Trang hiện tại
  pageSize: number; // Số item mỗi trang
  isLoading: boolean; // Đang tải dữ liệu không
  onPageChange: (_event: unknown, newPage: number) => void; // Khi click trang khác
  onPageSizeChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // Khi thay đổi số item/trang
  onActionClick: (event: React.MouseEvent<HTMLElement>, item: T) => void; // Khi click nút "..."
  rowsPerPageOptions?: number[]; // Tùy chọn số item/trang (5, 10, 25, 50...)
  hideActionColumn?: boolean; // Ẩn cột Actions không
  onSort?: (columnId: keyof T, order: "asc" | "desc") => void; // Khi click sort
  rowBorderColor?: string;
}

const GenericTableInner = <T,>(
  {
    columns,
    data,
    totalCount,
    pageNumber,
    pageSize,
    isLoading,
    onPageChange,
    onPageSizeChange,
    onActionClick,
    rowsPerPageOptions = [5, 10, 25, 50],
    hideActionColumn = false,
    onSort,
    rowBorderColor = "#e0e0e0", // THÊM: Mặc định màu xám nhạt
  }: GenericTableProps<T>,
  ref: React.Ref<HTMLDivElement>
) => {
  const [orderBy, setOrderBy] = React.useState<keyof T | null>(null);
  const [order, setOrder] = React.useState<"asc" | "desc">("asc");

  const handleSort = (columnId: keyof T) => {
    const isAsc = orderBy === columnId && order === "asc";
    const newOrder: "asc" | "desc" = isAsc ? "desc" : "asc";

    setOrderBy(columnId);
    setOrder(newOrder);

    onSort?.(columnId, newOrder);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          p: 4,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (data.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          p: 4,
        }}
      >
        <Alert
          severity="info"
          sx={{
            borderRadius: "4px",
            boxShadow:
              "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;",
          }}
        >
          No data found
        </Alert>
      </Box>
    );
  }

  return (
    <TableContainer ref={ref}>
      <Table stickyHeader>
        <TableHead>
          <TableRow
            sx={{
              "& .MuiTableCell-head": {
                fontWeight: 700,
              },
            }}
          >
            {columns.map((column) => (
              <TableCell
                key={String(column.id)}
                align={column.align || "left"}
                style={{ minWidth: column.minWidth }}
                sx={{
                  fontWeight: 700,
                  cursor: column.sortable ? "pointer" : "default",
                  userSelect: column.sortable ? "none" : "auto",

                  borderBottom: `1px solid ${rowBorderColor}`,
                }}
              >
                {column.sortable ? (
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={orderBy === column.id ? order : "asc"}
                    onClick={() => handleSort(column.id)}
                    sx={{
                      "& .MuiTableSortLabel-icon": {},
                      "&:hover": {},
                    }}
                  >
                    {column.label}
                  </TableSortLabel>
                ) : (
                  column.label
                )}
              </TableCell>
            ))}

            {!hideActionColumn && (
              <TableCell
                sx={{
                  fontWeight: 700,
                  textAlign: "center",
                  borderBottom: `1px solid ${rowBorderColor}`,
                }}
              >
                Actions
              </TableCell>
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((row) => (
            <TableRow key={(row as any).id} hover>
              {columns.map((column) => {
                const value = row[column.id];
                return (
                  <TableCell
                    key={String(column.id)}
                    align={column.align || "left"}
                    sx={{
                      borderBottom: `1px solid ${rowBorderColor} !important`,
                      "&:last-child": {
                        borderBottom: `1px solid ${rowBorderColor}`,
                      },
                    }}
                  >
                    {column.format ? column.format(value, row) : String(value)}
                  </TableCell>
                );
              })}

              {!hideActionColumn && (
                <TableCell
                  sx={{
                    textAlign: "center",
                    borderBottom: `1px solid ${rowBorderColor} !important`,
                    "&:last-child": {
                      borderBottom: `1px solid ${rowBorderColor}`,
                    },
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={(e) => onActionClick(e, row)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={totalCount}
        rowsPerPage={pageSize}
        page={pageNumber - 1}
        onPageChange={onPageChange}
        onRowsPerPageChange={onPageSizeChange}
        labelRowsPerPage="Số dòng mỗi trang:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}–${to} trên tổng số ${count !== -1 ? count : `hơn ${to}`}`
        }
      />
    </TableContainer>
  );
};

// Export: Wrap inner bằng forwardRef và assert type để hỗ trợ generic <T,> khi sử dụng
export const GenericTable = React.forwardRef(GenericTableInner) as unknown as (<
  T
>(
  props: GenericTableProps<T> & React.RefAttributes<HTMLDivElement>
) => ReturnType<typeof GenericTableInner<T>>) & {
  displayName?: string;
};

GenericTable.displayName = "GenericTable";
