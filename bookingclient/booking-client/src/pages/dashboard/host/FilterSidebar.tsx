/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/admin/HostManagement/components/FilterSidebar.tsx
import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Box, Drawer, Typography, Divider, Stack } from "@mui/material";
import { AppButton } from "@/components/button";
import FormRadioGroup from "@/components/radio/FormRadioGroup";
import FormTextField from "@/components/Input/FormTextField";
import FormDateTimeField from "@/components/datetime/FormDateTimeField";
import type { HostProfileFilter, HostStatus } from "@/types/hostProfile.types";

interface FilterSidebarProps {
  open: boolean;
  onApplyFilters: (filters: HostProfileFilter) => void;
  onClearFilters: () => void;
  onClose: () => void;
  initialFilters?: HostProfileFilter;
}

const validationSchema = Yup.object({
  searchTerm: Yup.string(),
  isActive: Yup.string(),
  hostStatus: Yup.string(),
  isSuperhost: Yup.string(),
  minAverageRating: Yup.number().min(0).max(5),
  maxAverageRating: Yup.number().min(0).max(5),
  minTotalBookings: Yup.number().min(0),
  maxTotalBookings: Yup.number().min(0),
  minTotalHomestays: Yup.number().min(0),
  maxTotalHomestays: Yup.number().min(0),
  minResponseRate: Yup.number().min(0).max(100),
  maxResponseRate: Yup.number().min(0).max(100),
  registeredFrom: Yup.string(),
  registeredTo: Yup.string(),
  reviewedFrom: Yup.string(),
  reviewedTo: Yup.string(),
  sortBy: Yup.string(),
  sortDirection: Yup.string(),
});

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  open,
  onApplyFilters,
  onClearFilters,
  onClose,
  initialFilters = {},
}) => {
  const handleApply = (values: any) => {
    const filters: HostProfileFilter = {
      searchTerm: values.searchTerm || undefined,
      isActive:
        values.isActive === "all"
          ? undefined
          : values.isActive === "true"
          ? true
          : values.isActive === "false"
          ? false
          : undefined,
      hostStatus:
        values.hostStatus === "all"
          ? undefined
          : (parseInt(values.hostStatus) as HostStatus),

      isSuperhost:
        values.isSuperhost === "all"
          ? undefined
          : values.isSuperhost === "true"
          ? true
          : values.isSuperhost === "false"
          ? false
          : undefined,
      minAverageRating: values.minAverageRating || undefined,
      maxAverageRating: values.maxAverageRating || undefined,
      minTotalBookings: values.minTotalBookings || undefined,
      maxTotalBookings: values.maxTotalBookings || undefined,
      minTotalHomestays: values.minTotalHomestays || undefined,
      maxTotalHomestays: values.maxTotalHomestays || undefined,
      minResponseRate: values.minResponseRate || undefined,
      maxResponseRate: values.maxResponseRate || undefined,
      registeredFrom: values.registeredFrom || undefined,
      registeredTo: values.registeredTo || undefined,
      reviewedFrom: values.reviewedFrom || undefined,
      reviewedTo: values.reviewedTo || undefined,
      sortBy: values.sortBy || undefined,
      sortDirection: values.sortDirection || undefined,
      pageNumber: 1,
      pageSize: 10,
    };

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
          width: "400px",
          maxWidth: "100%",
          overflowY: "auto",
        },
      }}
    >
      <Formik
        initialValues={{
          searchTerm: initialFilters.searchTerm || "",
          isActive:
            initialFilters.isActive === undefined
              ? "all"
              : initialFilters.isActive?.toString(),
          hostStatus: initialFilters.hostStatus?.toString() || "all",
          isSuperhost:
            initialFilters.isSuperhost === undefined
              ? "all"
              : initialFilters.isSuperhost?.toString(),
          minAverageRating: initialFilters.minAverageRating || "",
          maxAverageRating: initialFilters.maxAverageRating || "",
          minTotalBookings: initialFilters.minTotalBookings || "",
          maxTotalBookings: initialFilters.maxTotalBookings || "",
          minTotalHomestays: initialFilters.minTotalHomestays || "",
          maxTotalHomestays: initialFilters.maxTotalHomestays || "",
          minResponseRate: initialFilters.minResponseRate || "",
          maxResponseRate: initialFilters.maxResponseRate || "",
          registeredFrom: initialFilters.registeredFrom || "",
          registeredTo: initialFilters.registeredTo || "",
          reviewedFrom: initialFilters.reviewedFrom || "",
          reviewedTo: initialFilters.reviewedTo || "",
          sortBy: initialFilters.sortBy || "",
          sortDirection: initialFilters.sortDirection || "desc",
        }}
        validationSchema={validationSchema}
        onSubmit={handleApply}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Box sx={{ p: 3 }}>
              {/* Header */}
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Bộ lọc
              </Typography>

              {/* SORTING SECTION */}
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, mb: 2, mt: 2 }}
              >
                Sắp xếp
              </Typography>

              <FormRadioGroup
                name="sortDirection"
                label="Thứ tự"
                options={[
                  { value: "asc", label: "Tăng dần ↑" },
                  { value: "desc", label: "Giảm dần ↓" },
                ]}
                row
              />

              <Divider sx={{ my: 2.5 }} />

              {/* STATUS SECTION */}
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, mb: 2, mt: 2 }}
              >
                Trạng thái
              </Typography>

              <FormRadioGroup
                name="isActive"
                label="Trạng thái hoạt động"
                options={[
                  { value: "all", label: "Tất cả" },
                  { value: "true", label: "Hoạt động" },
                  { value: "false", label: "Không hoạt động" },
                ]}
              />

              <FormRadioGroup
                name="hostStatus"
                label="Trạng thái duyệt"
                options={[
                  { value: "all", label: "Tất cả" },
                  { value: "0", label: "Chờ duyệt" },
                  { value: "1", label: "Đang xem xét" },
                  { value: "2", label: "Đã duyệt" },
                  { value: "3", label: "Đã từ chối" },
                  { value: "4", label: "Cần bổ sung" },
                  { value: "5", label: "Đã hủy" },
                ]}
              />

              <FormRadioGroup
                name="isSuperhost"
                label="Superhost"
                options={[
                  { value: "all", label: "Tất cả" },
                  { value: "true", label: "Có" },
                  { value: "false", label: "Không" },
                ]}
              />

              <Divider sx={{ my: 2.5 }} />

              {/* STATISTICS SECTION */}
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, mb: 2, mt: 2 }}
              >
                Thống kê
              </Typography>

              <FormTextField
                name="minAverageRating"
                label="Đánh giá tối thiểu"
                type="number"
                placeholder="0"
              />

              <FormTextField
                name="maxAverageRating"
                label="Đánh giá tối đa"
                type="number"
                placeholder="5"
              />

              <FormTextField
                name="minTotalBookings"
                label="Số booking tối thiểu"
                type="number"
                placeholder="0"
              />

              <FormTextField
                name="maxTotalBookings"
                label="Số booking tối đa"
                type="number"
                placeholder="1000"
              />

              <FormTextField
                name="minTotalHomestays"
                label="Số homestay tối thiểu"
                type="number"
                placeholder="0"
              />

              <FormTextField
                name="maxTotalHomestays"
                label="Số homestay tối đa"
                type="number"
                placeholder="100"
              />

              <FormTextField
                name="minResponseRate"
                label="Tỷ lệ phản hồi tối thiểu (%)"
                type="number"
                placeholder="0"
              />

              <FormTextField
                name="maxResponseRate"
                label="Tỷ lệ phản hồi tối đa (%)"
                type="number"
                placeholder="100"
              />

              <Divider sx={{ my: 2.5 }} />

              {/* DATE RANGE SECTION */}
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, mb: 2, mt: 2 }}
              >
                Ngày đăng ký
              </Typography>

              <FormDateTimeField
                name="registeredFrom"
                label="Từ ngày"
                type="date"
              />

              <FormDateTimeField
                name="registeredTo"
                label="Đến ngày"
                type="date"
              />

              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, mb: 2, mt: 3 }}
              >
                Ngày xét duyệt
              </Typography>

              <FormDateTimeField
                name="reviewedFrom"
                label="Từ ngày"
                type="date"
              />

              <FormDateTimeField
                name="reviewedTo"
                label="Đến ngày"
                type="date"
              />

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
                  px: 0,
                  zIndex: 1,
                  mt: 3,
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
                    sx={{ flex: 1 }}
                  >
                    Xóa bộ lọc
                  </AppButton>
                  <AppButton
                    variant="contained"
                    type="submit"
                    fullWidth
                    size="small"
                    sx={{ flex: 1 }}
                  >
                    Áp dụng
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
