/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/admin/UserManagement/components/FilterSidebar.tsx
import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Box, Drawer, Typography, Divider, Stack } from "@mui/material";
import { AppButton } from "@/components/button";
import FormRadioGroup from "@/components/radio/FormRadioGroup";
import FormSelectField from "@/components/select/FormSelectField";
import type { UserFilters } from "@/types/user.types";
import  FormDateTimeField  from "@/components/datetime/FormDateTimeField";

interface FilterSidebarProps {
  open: boolean;
  onApplyFilters: (filters: UserFilters) => void;
  onClearFilters: () => void;
  onClose: () => void;
  initialFilters?: UserFilters;
}

const validationSchema = Yup.object({
  sortBy: Yup.string(),
  sortOrder: Yup.string(),
  isActive: Yup.string(),
  isLocked: Yup.string(),
  isEmailConfirmed: Yup.string(),
  roles: Yup.array().of(Yup.string()),
  createdAtFrom: Yup.string(),
  createdAtTo: Yup.string(),
});

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  open,
  onApplyFilters,
  onClearFilters,
  onClose,
  initialFilters = {},
}) => {
  const handleApply = (values: any) => {
    const filters: UserFilters = {
      sortBy: values.sortBy || undefined,
      sortOrder: values.sortOrder || undefined,
      isActive:
        values.isActive === "all"
          ? "all"
          : values.isActive === "true"
          ? true
          : values.isActive === "false"
          ? false
          : undefined,
      isLocked:
        values.isLocked === "all"
          ? "all"
          : values.isLocked === "true"
          ? true
          : values.isLocked === "false"
          ? false
          : undefined,
      isEmailConfirmed:
        values.isEmailConfirmed === "all"
          ? "all"
          : values.isEmailConfirmed === "true"
          ? true
          : values.isEmailConfirmed === "false"
          ? false
          : undefined,
      roles: values.roles && values.roles.length > 0 ? values.roles : undefined,
      createdAtFrom: values.createdAtFrom || undefined,
      createdAtTo: values.createdAtTo || undefined,
      pageNumber: 0,
      pageSize: 0,
    };

    console.log("Applying filters:", filters);
    onApplyFilters(filters);
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: "380px",
          maxWidth: "100%",
          overflowY: "auto",
        },
      }}
    >
      <Formik
        initialValues={
          {
            sortBy: initialFilters.sortBy || "",
            sortOrder: initialFilters.sortOrder || "asc",
            isActive:
              initialFilters.isActive === "all"
                ? "all"
                : initialFilters.isActive?.toString() ?? "all",
            isLocked:
              initialFilters.isLocked === "all"
                ? "all"
                : initialFilters.isLocked?.toString() ?? "all",
            isEmailConfirmed:
              initialFilters.isEmailConfirmed === "all"
                ? "all"
                : initialFilters.isEmailConfirmed?.toString() ?? "all",
            roles: initialFilters.roles || [],
          } as UserFilters
        }
        validationSchema={validationSchema}
        onSubmit={handleApply}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Box sx={{ p: 3 }}>
              {/* Header */}
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Filters
              </Typography>

              {/* SORTING SECTION */}
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, mb: 2, mt: 2 }}
              >
                Sorting
              </Typography>

              <FormSelectField
                name="sortBy"
                label="Sort By"
                options={[
                  { value: "", label: "Select field" },
                  { value: "userName", label: "Username" },
                  { value: "email", label: "Email" },
                  { value: "fullName", label: "Full Name" },
                  { value: "createdAt", label: "Created Date" },
                  { value: "lastLoginAt", label: "Last Login" },
                ]}
              />

              <FormRadioGroup
                name="sortOrder"
                label="Sort Order"
                options={[
                  { value: "asc", label: "Ascending ↑" },
                  { value: "desc", label: "Descending ↓" },
                ]}
                row
              />

              <Divider sx={{ my: 2.5 }} />

              {/* STATUS SECTION */}
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, mb: 2, mt: 2 }}
              >
                Status
              </Typography>

              <FormRadioGroup
                name="isActive"
                label="Active Status"
                options={[
                  { value: "all", label: "All" },
                  { value: "true", label: "Active" },
                  { value: "false", label: "Inactive" },
                ]}
              />

              <FormRadioGroup
                name="isLocked"
                label="Account Lock"
                options={[
                  { value: "all", label: "All" },
                  { value: "true", label: "Locked" },
                  { value: "false", label: "Unlocked" },
                ]}
              />

              <FormRadioGroup
                name="isEmailConfirmed"
                label="Email Confirmation"
                options={[
                  { value: "all", label: "All" },
                  { value: "true", label: "Confirmed" },
                  { value: "false", label: "Unconfirmed" },
                ]}
              />

              <Divider sx={{ my: 2.5 }} />

              {/* ROLE SECTION */}
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, mb: 2, mt: 2 }}
              >
                Role
              </Typography>

              <FormSelectField
                name="roles"
                label="Select Roles"
                options={[
                  { value: "Admin", label: "Admin" },
                  { value: "Host", label: "Host" },
                  { value: "User", label: "User" },
                ]}
                multiple
              />

              <Divider sx={{ my: 2.5 }} />

              {/* DATE RANGE SECTION */}
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, mb: 2, mt: 2 }}
              >
                Created Date
              </Typography>

              <FormDateTimeField
                name="createdAtFrom"
                label="From"
                type="date"
              />

              <FormDateTimeField name="createdAtTo" label="To" type="date" />

              {/* BUTTONS */}
              <Box
                sx={{
                  position: "sticky",
                  bottom: 0,
                  right: 0,
                  width: "100%",
                  backgroundColor: "background.paper",
                  borderTop: "1px solid",
                  borderColor: "divider",
                  py: 2,
                  px: 0, // Padding sẽ do Stack bên trong handle
                  zIndex: 1,
                }}
              >
                <Stack direction="row" gap={1}>
                  <AppButton
                    variant="outlined"
                    onClick={() => {
                      onClearFilters();
                      onClose();
                    }}
                    fullWidth
                    size="small"
                    sx={{
                      flex: 1,
                    }}
                  >
                    Clear
                  </AppButton>
                  <AppButton
                    variant="contained"
                    type="submit"
                    fullWidth
                    size="small"
                    sx={{
                      flex: 1,
                    }}
                  >
                    Apply Filters
                  </AppButton>
                </Stack>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
    </Drawer>
  );
};
