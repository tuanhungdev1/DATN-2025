/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/admin/HomestayManagement/components/FilterSidebar.tsx
import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Box, Drawer, Typography, Divider, Stack } from "@mui/material";
import { AppButton } from "@/components/button";
import FormRadioGroup from "@/components/radio/FormRadioGroup";
import FormSelectField from "@/components/select/FormSelectField";
import FormTextField from "@/components/Input/FormTextField";
import type { HomestayFilter } from "@/types/homestay.types";
import FormDateTimeField from "@/components/datetime/FormDateTimeField";

interface FilterSidebarProps {
  open: boolean;
  onApplyFilters: (filters: HomestayFilter) => void;
  onClearFilters: () => void;
  onClose: () => void;
  initialFilters?: HomestayFilter;
}

const validationSchema = Yup.object({
  sortBy: Yup.string(),
  sortDirection: Yup.string(),
  isActive: Yup.string(),
  isApproved: Yup.string(),
  isFeatured: Yup.string(),
  isInstantBook: Yup.string(),
  minPrice: Yup.number().min(0),
  maxPrice: Yup.number().min(0),
  city: Yup.string(),
  province: Yup.string(),
  country: Yup.string(),
  propertyTypeId: Yup.number(),
  hasParking: Yup.string(),
  isPetFriendly: Yup.string(),
  hasPrivatePool: Yup.string(),
  createdFrom: Yup.string(),
  createdTo: Yup.string(),
});

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  open,
  onApplyFilters,
  onClearFilters,
  onClose,
  initialFilters = {},
}) => {
  const handleApply = (values: any) => {
    const filters: HomestayFilter = {
      sortBy: values.sortBy || undefined,
      sortDirection: values.sortDirection || undefined,
      isActive:
        values.isActive === "all"
          ? undefined
          : values.isActive === "true"
          ? true
          : values.isActive === "false"
          ? false
          : undefined,
      isApproved:
        values.isApproved === "all"
          ? undefined
          : values.isApproved === "true"
          ? true
          : values.isApproved === "false"
          ? false
          : undefined,
      isFeatured:
        values.isFeatured === "all"
          ? undefined
          : values.isFeatured === "true"
          ? true
          : values.isFeatured === "false"
          ? false
          : undefined,
      isInstantBook:
        values.isInstantBook === "all"
          ? undefined
          : values.isInstantBook === "true"
          ? true
          : values.isInstantBook === "false"
          ? false
          : undefined,
      hasParking:
        values.hasParking === "all"
          ? undefined
          : values.hasParking === "true"
          ? true
          : values.hasParking === "false"
          ? false
          : undefined,
      isPetFriendly:
        values.isPetFriendly === "all"
          ? undefined
          : values.isPetFriendly === "true"
          ? true
          : values.isPetFriendly === "false"
          ? false
          : undefined,
      hasPrivatePool:
        values.hasPrivatePool === "all"
          ? undefined
          : values.hasPrivatePool === "true"
          ? true
          : values.hasPrivatePool === "false"
          ? false
          : undefined,
      minPrice: values.minPrice || undefined,
      maxPrice: values.maxPrice || undefined,
      city: values.city || undefined,
      province: values.province || undefined,
      country: values.country || undefined,
      propertyTypeId: values.propertyTypeId || undefined,
      createdFrom: values.createdFrom || undefined,
      createdTo: values.createdTo || undefined,
      pageNumber: 1,
      pageSize: 10,
    };

    console.log("Áp dụng bộ lọc:", filters);
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
          sortBy: initialFilters.sortBy || "",
          sortDirection: initialFilters.sortDirection || "desc",
          isActive:
            initialFilters.isActive === undefined
              ? "all"
              : initialFilters.isActive?.toString(),
          isApproved:
            initialFilters.isApproved === undefined
              ? "all"
              : initialFilters.isApproved?.toString(),
          isFeatured:
            initialFilters.isFeatured === undefined
              ? "all"
              : initialFilters.isFeatured?.toString(),
          isInstantBook:
            initialFilters.isInstantBook === undefined
              ? "all"
              : initialFilters.isInstantBook?.toString(),
          hasParking:
            initialFilters.hasParking === undefined
              ? "all"
              : initialFilters.hasParking?.toString(),
          isPetFriendly:
            initialFilters.isPetFriendly === undefined
              ? "all"
              : initialFilters.isPetFriendly?.toString(),
          hasPrivatePool:
            initialFilters.hasPrivatePool === undefined
              ? "all"
              : initialFilters.hasPrivatePool?.toString(),
          minPrice: initialFilters.minPrice || "",
          maxPrice: initialFilters.maxPrice || "",
          city: initialFilters.city || "",
          province: initialFilters.province || "",
          country: initialFilters.country || "",
          propertyTypeId: initialFilters.propertyTypeId || "",
          createdFrom: initialFilters.createdFrom || "",
          createdTo: initialFilters.createdTo || "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleApply}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Box sx={{ p: 3 }}>
              {/* Tiêu đề */}
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Bộ lọc
              </Typography>

              {/* PHẦN SẮP XẾP */}
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
                  { value: "", label: "Chọn trường" },
                  { value: "title", label: "Tiêu đề" },
                  { value: "price", label: "Giá" },
                  { value: "rating", label: "Đánh giá" },
                  { value: "createdAt", label: "Ngày tạo" },
                  { value: "approvedAt", label: "Ngày duyệt" },
                  { value: "popular", label: "Phổ biến" },
                  { value: "newest", label: "Mới nhất" },
                ]}
              />

              <FormRadioGroup
                name="sortDirection"
                label="Thứ tự sắp xếp"
                options={[
                  { value: "asc", label: "Tăng dần" },
                  { value: "desc", label: "Giảm dần" },
                ]}
                row
              />

              <Divider sx={{ my: 2.5 }} />

              {/* PHẦN TRẠNG THÁI */}
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
                  { value: "true", label: "Đang hoạt động" },
                  { value: "false", label: "Tạm dừng" },
                ]}
              />

              <FormRadioGroup
                name="isApproved"
                label="Trạng thái duyệt"
                options={[
                  { value: "all", label: "Tất cả" },
                  { value: "true", label: "Đã duyệt" },
                  { value: "false", label: "Chờ duyệt" },
                ]}
              />

              <FormRadioGroup
                name="isFeatured"
                label="Nổi bật"
                options={[
                  { value: "all", label: "Tất cả" },
                  { value: "true", label: "Nổi bật" },
                  { value: "false", label: "Bình thường" },
                ]}
              />

              <FormRadioGroup
                name="isInstantBook"
                label="Đặt ngay"
                options={[
                  { value: "all", label: "Tất cả" },
                  { value: "true", label: "Có" },
                  { value: "false", label: "Không" },
                ]}
              />

              <Divider sx={{ my: 2.5 }} />

              {/* PHẦN GIÁ */}
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, mb: 2, mt: 2 }}
              >
                Khoảng giá
              </Typography>

              <FormTextField
                name="minPrice"
                label="Giá tối thiểu"
                type="number"
                placeholder="0"
              />

              <FormTextField
                name="maxPrice"
                label="Giá tối đa"
                type="number"
                placeholder="10000000"
              />

              <Divider sx={{ my: 2.5 }} />

              {/* PHẦN VỊ TRÍ */}
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, mb: 2, mt: 2 }}
              >
                Vị trí
              </Typography>

              <FormTextField
                name="city"
                label="Thành phố"
                placeholder="Nhập thành phố"
              />

              <FormTextField
                name="province"
                label="Tỉnh/Thành"
                placeholder="Nhập tỉnh/thành"
              />

              <FormTextField
                name="country"
                label="Quốc gia"
                placeholder="Nhập quốc gia"
              />

              <Divider sx={{ my: 2.5 }} />

              {/* PHẦN TIỆN ÍCH */}
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, mb: 2, mt: 2 }}
              >
                Tiện ích
              </Typography>

              <FormRadioGroup
                name="hasParking"
                label="Chỗ đậu xe"
                options={[
                  { value: "all", label: "Tất cả" },
                  { value: "true", label: "Có" },
                  { value: "false", label: "Không" },
                ]}
              />

              <FormRadioGroup
                name="isPetFriendly"
                label="Cho phép thú cưng"
                options={[
                  { value: "all", label: "Tất cả" },
                  { value: "true", label: "Có" },
                  { value: "false", label: "Không" },
                ]}
              />

              <FormRadioGroup
                name="hasPrivatePool"
                label="Hồ bơi riêng"
                options={[
                  { value: "all", label: "Tất cả" },
                  { value: "true", label: "Có" },
                  { value: "false", label: "Không" },
                ]}
              />

              <Divider sx={{ my: 2.5 }} />

              {/* PHẦN NGÀY TẠO */}
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, mb: 2, mt: 2 }}
              >
                Ngày tạo
              </Typography>

              <FormDateTimeField
                name="createdFrom"
                label="Từ ngày"
                type="date"
              />

              <FormDateTimeField
                name="createdTo"
                label="Đến ngày"
                type="date"
              />

              {/* NÚT HÀNH ĐỘNG */}
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
