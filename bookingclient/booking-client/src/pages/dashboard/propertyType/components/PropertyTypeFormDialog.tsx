/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { Formik, Form } from "formik";
import { AppButton } from "@/components/button";
import { Upload as UploadIcon, X as XIcon } from "lucide-react";

import { FormTextField } from "@/components/Input";
import { FormCheckbox } from "@/components/checkbox";
import type {
  CreatePropertyType,
  PropertyType,
  UpdatePropertyType,
} from "@/types/propertyType.types";
import {
  createPropertyTypeSchema,
  updatePropertyTypeSchema,
} from "@/validators/propertyTypeValidation";
import { AppImage } from "@/components/images";

interface PropertyTypeFormDialogProps {
  open: boolean;
  propertyType?: PropertyType;
  isLoading?: boolean;
  onSubmit: (data: CreatePropertyType | UpdatePropertyType) => Promise<void>;
  onClose: () => void;
}

export const PropertyTypeFormDialog: React.FC<PropertyTypeFormDialogProps> = ({
  open,
  propertyType,
  isLoading = false,
  onSubmit,
  onClose,
}) => {
  const isEditMode = !!propertyType;
  const title = isEditMode
    ? "Cập nhật loại bất động sản"
    : "Tạo loại bất động sản mới";

  const initialValues = isEditMode
    ? {
        typeName: propertyType.typeName,
        description: propertyType.description || "",
        displayOrder: propertyType.displayOrder,
        isActive: propertyType.isActive,
        iconFile: null as File | null,
      }
    : {
        typeName: "",
        description: "",
        displayOrder: 0,
        isActive: true,
        iconFile: null as File | null,
      };

  const validationSchema = isEditMode
    ? updatePropertyTypeSchema
    : createPropertyTypeSchema;

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
                    Biểu tượng loại bất động sản
                  </Typography>
                  {propertyType?.iconUrl && (
                    <Box sx={{ mb: 2 }}>
                      <AppImage
                        src={propertyType.iconUrl}
                        sx={{ width: "100%", height: "auto" }}
                        alt="Property Type"
                      />
                    </Box>
                  )}
                  {values.iconFile === null && (
                    <Box
                      component="label"
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
                    >
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.currentTarget.files?.[0];
                          if (file) setFieldValue("iconFile", file);
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
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                        mt: 1,
                      }}
                    >
                      <AppImage
                        src={URL.createObjectURL(values.iconFile)}
                        sx={{ width: "100%", height: "auto" }}
                        alt="Property Type"
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
                  name="typeName"
                  label="Tên loại bất động sản"
                  required
                  placeholder="VD: Căn hộ, Nhà riêng, Biệt thự..."
                />

                <FormTextField
                  name="description"
                  label="Mô tả"
                  placeholder="Mô tả chi tiết loại bất động sản..."
                  multiline
                  rows={3}
                />

                <FormTextField
                  name="displayOrder"
                  label="Thứ tự hiển thị"
                  type="number"
                  required
                />

                <FormCheckbox
                  name="isActive"
                  label="Kích hoạt loại bất động sản này"
                />
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
