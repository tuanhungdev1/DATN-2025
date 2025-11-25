// src/pages/admin/UserManagement/components/UserTable.tsx
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
  Chip,
  CircularProgress,
  Alert,
  Typography,
} from "@mui/material";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";
import type { User } from "@/types/user.types";
import { AppImage } from "@/components/images";

interface UserTableProps {
  users: User[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  isLoading: boolean;
  onPageChange: (_event: unknown, newPage: number) => void;
  onPageSizeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onActionClick: (event: React.MouseEvent<HTMLElement>, user: User) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  totalCount,
  pageNumber,
  pageSize,
  isLoading,
  onPageChange,
  onPageSizeChange,
  onActionClick,
}) => {
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (users.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <Alert severity="info">No users found</Alert>
      </Box>
    );
  }

  return (
    <TableContainer>
      <Table>
        <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 700 }}>Avata</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Phone</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Created At</TableCell>
            <TableCell sx={{ fontWeight: 700, textAlign: "center" }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} hover>
              <TableCell>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    overflow: "hidden",
                    backgroundImage:
                      "linear-gradient(to bottom right, #9ca3af, #6b7280)", // tương đương bg-gradient-to-br bg-gray-400
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {user?.avatar ? (
                    <AppImage src={user.avatar} alt="Avatar" />
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{
                        color: "white",
                        fontWeight: 600,
                        fontSize: "0.875rem", // text-sm
                      }}
                    >
                      {user?.firstName?.[0]}
                      {user?.lastName?.[0]}
                    </Typography>
                  )}
                </Box>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.fullName}</TableCell>
              <TableCell>{user.phoneNumber || "N/A"}</TableCell>
              <TableCell>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Chip
                    label={user.isActive ? "Active" : "Inactive"}
                    color={user.isActive ? "success" : "error"}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </TableCell>
              <TableCell>
                {new Date(user.createdAt).toLocaleDateString("vi-VN")}
              </TableCell>
              <TableCell sx={{ textAlign: "center" }}>
                <IconButton
                  size="small"
                  onClick={(e) => onActionClick(e, user)}
                >
                  <MoreVertIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={totalCount}
        rowsPerPage={pageSize}
        page={pageNumber - 1}
        onPageChange={onPageChange}
        onRowsPerPageChange={onPageSizeChange}
      />
    </TableContainer>
  );
};
