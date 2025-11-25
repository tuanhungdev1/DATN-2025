/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/admin/CouponManagement/components/CouponFilterSidebar.tsx
import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Box, Drawer, Typography, Divider, Stack } from "@mui/material";
import { AppButton } from "@/components/button";
import FormRadioGroup from "@/components/radio/FormRadioGroup";
import FormSelectField from "@/components/select/FormSelectField";
import FormDateTimeField from "@/components/datetime/FormDateTimeField";
import FormTextField from "@/components/Input/FormTextField";
import type { CouponFilter } from "@/types/coupon.types";
import { CouponType } from "@/types/coupon.types";

interface CouponFilterSidebarProps {
  open: boolean;
  onApplyFilters: (filters: CouponFilter) => void;
  onClearFilters: () => void;
  onClose: () => void;
  initialFilters?: CouponFilter;
}

const validationSchema = Yup.object({
  couponType: Yup.number(),
  isActive: Yup.string(),
  isPublic: Yup.string(),
  isExpired: Yup.string(),
  sortBy: Yup.string(),
  sortDirection: Yup.string(),
  validFrom: Yup.string(),
  validTo: Yup.string(),
  homestayId: Yup.number(),
  createdByUserId: Yup.number(),
});

export const CouponFilterSidebar: React.FC<CouponFilterSidebarProps> = ({
  open,
  onApplyFilters,
  onClearFilters,
  onClose,
  initialFilters = {},
}) => {
  const handleApply = (values: any) => {
    const filters: CouponFilter = {
      couponType: values.couponType || undefined,
      isActive:
        values.isActive === "all"
          ? undefined
          : values.isActive === "true"
          ? true
          : values.isActive === "false"
          ? false
          : undefined,
      isPublic:
        values.isPublic === "all"
          ? undefined
          : values.isPublic === "true"
          ? true
          : values.isPublic === "false"
          ? false
          : undefined,
      isExpired:
        values.isExpired === "all"
          ? undefined
          : values.isExpired === "true"
          ? true
          : values.isExpired === "false"
          ? false
          : undefined,
      sortBy: values.sortBy || undefined,
      sortDirection: values.sortDirection || undefined,
      validFrom: values.validFrom || undefined,
      validTo: values.validTo || undefined,
      homestayId: values.homestayId || undefined,
      createdByUserId: values.createdByUserId || undefined,
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
          couponType: initialFilters.couponType || "",
          isActive:
            initialFilters.isActive === undefined
              ? "all"
              : initialFilters.isActive?.toString(),
          isPublic:
            initialFilters.isPublic === undefined
              ? "all"
              : initialFilters.isPublic?.toString(),
          isExpired:
            initialFilters.isExpired === undefined
              ? "all"
              : initialFilters.isExpired?.toString(),
          sortBy: initialFilters.sortBy || "",
          sortDirection: initialFilters.sortDirection || "desc",
          validFrom: initialFilters.validFrom || "",
          validTo: initialFilters.validTo || "",
          homestayId: initialFilters.homestayId || "",
          createdByUserId: initialFilters.createdByUserId || "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleApply}
      >
        {({ handleSubmit, values }) => (
          <Form onSubmit={handleSubmit}>
            <Box sx={{ p: 3 }}>
              {/* Header */}
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Bộ lọc Coupon
              </Typography>

              {/* SORTING SECTION */}
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, mb: 2, mt: 2 }}
              >
                Sắp xếp
              </Typography>

              <FormSelectField
                name="sortBy"
                label="Sắp xếp theo"
                options={[
                  { value: "", label: "Mặc định" },
                  { value: "couponCode", label: "Mã Coupon" },
                  { value: "couponName", label: "Tên Coupon" },
                  { value: "discountValue", label: "Giá trị giảm" },
                  { value: "startDate", label: "Ngày bắt đầu" },
                  { value: "endDate", label: "Ngày kết thúc" },
                  { value: "currentUsageCount", label: "Lượt sử dụng" },
                  { value: "priority", label: "Độ ưu tiên" },
                  { value: "createdAt", label: "Ngày tạo" },
                ]}
              />

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

              {/* COUPON TYPE SECTION */}
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, mb: 2, mt: 2 }}
              >
                Loại Coupon
              </Typography>

              <FormSelectField
                name="couponType"
                label="Loại"
                options={[
                  { value: "", label: "Tất cả" },
                  { value: CouponType.Percentage, label: "Phần trăm" },
                  { value: CouponType.FixedAmount, label: "Số tiền cố định" },
                  {
                    value: CouponType.FirstBooking,
                    label: "Đặt phòng đầu tiên",
                  },
                  { value: CouponType.Seasonal, label: "Theo mùa" },
                  { value: CouponType.LongStay, label: "Ở dài hạn" },
                  { value: CouponType.Referral, label: "Giới thiệu" },
                ]}
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
                  { value: "false", label: "Ngừng hoạt động" },
                ]}
              />

              <FormRadioGroup
                name="isPublic"
                label="Quyền truy cập"
                options={[
                  { value: "all", label: "Tất cả" },
                  { value: "true", label: "Công khai" },
                  { value: "false", label: "Riêng tư" },
                ]}
              />

              <FormRadioGroup
                name="isExpired"
                label="Tình trạng hết hạn"
                options={[
                  { value: "all", label: "Tất cả" },
                  { value: "true", label: "Đã hết hạn" },
                  { value: "false", label: "Còn hiệu lực" },
                ]}
              />

              <Divider sx={{ my: 2.5 }} />

              {/* DATE RANGE SECTION */}
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, mb: 2, mt: 2 }}
              >
                Khoảng thời gian hiệu lực
              </Typography>

              <FormDateTimeField name="validFrom" label="Từ ngày" type="date" />

              <FormDateTimeField name="validTo" label="Đến ngày" type="date" />

              <Divider sx={{ my: 2.5 }} />

              {/* ADDITIONAL FILTERS */}
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, mb: 2, mt: 2 }}
              >
                Bộ lọc nâng cao
              </Typography>

              <FormTextField
                name="homestayId"
                label="ID Homestay"
                type="number"
                placeholder="Nhập ID homestay"
                helperText="Lọc coupon theo homestay cụ thể"
              />

              <FormTextField
                name="createdByUserId"
                label="ID người tạo"
                type="number"
                placeholder="Nhập ID người tạo"
                helperText="Lọc coupon theo người tạo"
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
