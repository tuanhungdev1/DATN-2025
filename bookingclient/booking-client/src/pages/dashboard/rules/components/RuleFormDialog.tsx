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
import { Upload as UploadIcon, X as XIcon } from "lucide-react";

import { FormTextField } from "@/components/Input";
import { FormCheckbox } from "@/components/checkbox";
import type { CreateRule, Rule, UpdateRule } from "@/types/rule.type";
import {
  createRuleValidationSchema,
  updateRuleValidationSchema,
} from "@/validators/rule.Validation";

interface RuleFormDialogProps {
  open: boolean;
  rule?: Rule;
  isLoading?: boolean;
  onSubmit: (data: CreateRule | UpdateRule) => Promise<void>;
  onClose: () => void;
}

export const RuleFormDialog: React.FC<RuleFormDialogProps> = ({
  open,
  rule,
  isLoading = false,
  onSubmit,
  onClose,
}) => {
  const isEditMode = !!rule;
  const title = isEditMode ? "Cập nhật quy định" : "Tạo quy định mới";

  const initialValues = isEditMode
    ? {
        ruleName: rule.ruleName,
        ruleDescription: rule.ruleDescription || "",
        ruleType: rule.ruleType,
        displayOrder: rule.displayOrder,
        isActive: rule.isActive,
        iconFile: null as File | null,
      }
    : {
        ruleName: "",
        ruleDescription: "",
        ruleType: "",
        displayOrder: 0,
        isActive: true,
        iconFile: null as File | null,
      };

  const validationSchema = isEditMode
    ? updateRuleValidationSchema
    : createRuleValidationSchema;

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
                    Biểu tượng quy định
                  </Typography>
                  {rule?.iconUrl && (
                    <Box sx={{ mb: 2 }}>
                      <Avatar
                        src={rule.iconUrl}
                        sx={{ width: 80, height: 80 }}
                        variant="rounded"
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
                  name="ruleName"
                  label="Tên quy định"
                  required
                  placeholder="VD: Không hút thuốc, Không mang thú cưng..."
                />

                <FormTextField
                  name="ruleDescription"
                  label="Mô tả"
                  placeholder="Mô tả chi tiết quy định..."
                  multiline
                  rows={3}
                />

                <FormTextField
                  name="ruleType"
                  label="Loại quy định"
                  placeholder="VD: Chung, An toàn, Vệ sinh..."
                  required
                />

                <FormTextField
                  name="displayOrder"
                  label="Thứ tự hiển thị"
                  type="number"
                  required
                />

                <FormCheckbox name="isActive" label="Kích hoạt quy định này" />
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
