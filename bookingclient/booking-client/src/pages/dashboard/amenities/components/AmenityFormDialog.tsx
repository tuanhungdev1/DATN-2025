/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Divider,
  Avatar,
  Stack,
  Typography,
} from "@mui/material";
import { Formik, Form } from "formik";
import { AppButton } from "@/components/button";

import type {
  Amenity,
  CreateAmenity,
  UpdateAmenity,
} from "@/types/amenity.types";
import { Upload as UploadIcon, X as XIcon } from "lucide-react";
import {
  amenityUpdateValidationSchema,
  amenityValidationSchema,
} from "@/validators/amenityValidation";
import { FormTextField } from "@/components/Input";
import { FormSelectField } from "@/components/select";
import { FormCheckbox } from "@/components/checkbox";
import { CATEGORY_OPTIONS } from "@/constants/categoryOptions";

interface AmenityFormDialogProps {
  open: boolean;
  amenity?: Amenity;
  isLoading?: boolean;
  categories?: string[];
  onSubmit: (data: CreateAmenity | UpdateAmenity) => Promise<void>;
  onClose: () => void;
}

export const AmenityFormDialog: React.FC<AmenityFormDialogProps> = ({
  open,
  amenity,
  isLoading = false,
  categories,
  onSubmit,
  onClose,
}) => {
  const isEditMode = !!amenity;
  const title = isEditMode ? "Cập nhật tiện nghi" : "Tạo tiện nghi mới";

  const initialValues = isEditMode
    ? {
        amenityName: amenity.amenityName,
        amenityDescription: amenity.amenityDescription || "",
        category: amenity.category,
        displayOrder: amenity.displayOrder,
        isActive: amenity.isActive,
        iconFile: null as File | null,
        imageAction: "Keep" as const,
      }
    : {
        amenityName: "",
        amenityDescription: "",
        category: "",
        displayOrder: 0,
        isActive: true,
        iconFile: null as File | null,
      };

  const validationSchema = isEditMode
    ? amenityUpdateValidationSchema
    : amenityValidationSchema;

  const categoryOptions = categories
    ? categories.map((cat) => ({ label: cat, value: cat }))
    : CATEGORY_OPTIONS;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <Divider />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values: any) => {
          await onSubmit(values);
        }}
        enableReinitialize
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form>
            <DialogContent sx={{ pt: 3 }}>
              <Stack spacing={2.5}>
                {/* Icon Upload */}
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 3 }}>
                    Hình ảnh tiện nghi
                  </Typography>
                  {amenity?.iconUrl && (
                    <Box sx={{ mb: 2 }}>
                      <Avatar
                        src={amenity.iconUrl}
                        sx={{ width: 80, height: 80 }}
                        variant="rounded"
                      />
                    </Box>
                  )}
                  {values.iconFile === null && (
                    <Box
                      sx={{
                        border: "2px dashed #ccc",
                        borderRadius: 1,
                        height: 100,
                        position: "relative",
                        p: 2,
                        textAlign: "center",
                        display: "block",
                        cursor: "pointer",
                        transition: "all 0.3s",
                        "&:hover": {
                          borderColor: "primary.main",
                          backgroundColor: "action.hover",
                        },
                      }}
                      component={"label"}
                    >
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.currentTarget.files?.[0];
                          if (file) {
                            setFieldValue("iconFile", file);
                          }
                        }}
                      />
                      <Stack
                        alignItems="center"
                        spacing={1}
                        sx={{
                          pointerEvents: "none",
                          position: "absolute",
                          transform: "translate(-50%, -50%)",
                          top: "50%",
                          left: "50%",
                        }}
                      >
                        <UploadIcon size={24} />
                        <Typography variant="caption">
                          {values.iconFile
                            ? values.iconFile.name
                            : "Chọn hoặc kéo hình ảnh"}
                        </Typography>
                      </Stack>
                    </Box>
                  )}
                  {values.iconFile && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 1,
                      }}
                    >
                      <Avatar
                        src={URL.createObjectURL(values.iconFile)}
                        sx={{ width: 50, height: 50 }}
                        variant="rounded"
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2">
                          {values.iconFile.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {(values.iconFile.size / 1024).toFixed(2)} KB
                        </Typography>
                      </Box>
                      <AppButton
                        variant="outlined"
                        size="small"
                        danger
                        endIcon={<XIcon size={16} />}
                        onClick={() => setFieldValue("iconFile", null)}
                      >
                        Xóa
                      </AppButton>
                    </Box>
                  )}
                </Box>

                <FormTextField
                  name="amenityName"
                  label="Tên tiện nghi"
                  required
                  placeholder="VD: Wifi, Máy điều hòa..."
                />

                <FormTextField
                  name="amenityDescription"
                  label="Mô tả"
                  placeholder="Mô tả chi tiết tiện nghi..."
                  multiline
                  rows={3}
                />

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      flex: 1,
                    }}
                  >
                    <FormSelectField
                      name="category"
                      label="Danh mục"
                      required
                      placeholder="Chọn danh mục"
                      options={categoryOptions}
                    />
                  </Box>

                  <Box
                    sx={{
                      flex: 1,
                    }}
                  >
                    <FormTextField
                      name="displayOrder"
                      label="Thứ tự hiển thị"
                      type="number"
                      required
                    />
                  </Box>
                </Box>

                <FormCheckbox name="isActive" label="Kích hoạt tiện nghi này" />
              </Stack>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2, gap: 1 }}>
              <AppButton
                variant="outlined"
                onClick={onClose}
                disabled={isSubmitting || isLoading}
                size="large"
              >
                Hủy
              </AppButton>
              <AppButton
                variant="contained"
                type="submit"
                isLoading={isSubmitting || isLoading}
                loadingText="Đang xử lý..."
              >
                {isEditMode ? "Cập nhật" : "Tạo mới"}
              </AppButton>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
