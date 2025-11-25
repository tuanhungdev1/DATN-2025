/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, FieldArray } from "formik";
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Divider,
  Alert,
  Card,
  IconButton,
  CircularProgress,
  Checkbox,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import {
  useGetHomestayByIdQuery,
  useUpdateHomestayRulesMutation,
} from "@/services/endpoints/homestay.api";
import { useGetActiveRulesQuery } from "@/services/endpoints/rule.api";
import { FormTextField } from "@/components/Input";
import { FormSelectField } from "@/components/select";
import { AppButton } from "@/components/button";
import * as Yup from "yup";
import { useToast } from "@/hooks/useToast";
import type { UpdateHomestayRules } from "@/types/rule.type";
import { useMemo } from "react";

const validationSchema = Yup.object().shape({
  keepRuleIds: Yup.array().of(Yup.number()),
  newRules: Yup.array().of(
    Yup.object().shape({
      ruleId: Yup.number().required("Chọn quy tắc").min(1),
      customNote: Yup.string().max(500),
    })
  ),
  updateExistingRules: Yup.array().of(
    Yup.object().shape({
      ruleId: Yup.number().required().min(1),
      customNote: Yup.string().max(500),
    })
  ),
});

const UpdateHomestayRules = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const homestayId = id ? parseInt(id) : 0;
  const { success, error: errorToast } = useToast();

  const {
    data: homestayData,
    isLoading: isLoadingHomestay,
    error: homestayError,
  } = useGetHomestayByIdQuery(homestayId, { skip: !homestayId });

  const { data: rulesData } = useGetActiveRulesQuery();
  const rulesOptions = rulesData?.data || [];

  const [updateRules, { isLoading: isUpdating, error: updateError }] =
    useUpdateHomestayRulesMutation();

  const homestay = homestayData?.data;

  const initialValues = useMemo<UpdateHomestayRules>(() => {
    if (!homestay?.rules) {
      return {
        keepRuleIds: [],
        newRules: [],
        updateExistingRules: [],
      };
    }

    return {
      keepRuleIds: homestay.rules.map((r) => r.id),
      newRules: [],
      updateExistingRules: homestay.rules.map((r) => ({
        ruleId: r.id,
        customNote: r.customNote || "",
      })),
    };
  }, [homestay?.rules]);

  const handleSubmit = async (values: UpdateHomestayRules) => {
    try {
      const payload: UpdateHomestayRules = {
        keepRuleIds: values.keepRuleIds || [],
        newRules: values.newRules || [],
        updateExistingRules: values.updateExistingRules || [],
      };

      const response = await updateRules({
        id: homestayId,
        data: payload,
      }).unwrap();

      if (response.success) {
        success("Cập nhật quy tắc thành công!");
        navigate(`/admin/homestays/${homestayId}/edit`);
      }
    } catch (err: any) {
      console.error("Lỗi cập nhật quy tắc:", err);
      errorToast(err?.data?.message || "Cập nhật thất bại");
    }
  };

  if (isLoadingHomestay) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (homestayError || !homestay) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Không tìm thấy homestay</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <IconButton
            onClick={() => navigate(`/admin/homestays/${homestayId}/edit`)}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h2" sx={{ fontWeight: 600 }}>
            Quản lý Quy tắc
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          {homestay.homestayTitle}
        </Typography>
        <Divider sx={{ mt: 2 }} />
      </Box>

      {updateError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {(updateError as any)?.data?.message || "Lỗi cập nhật quy tắc"}
        </Alert>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnChange={false}
        validateOnBlur={true}
        enableReinitialize
      >
        {({ values, setFieldValue, isValid, isSubmitting }) => (
          <Form>
            {/* Quy tắc hiện tại */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" mb={3}>
                Quy tắc hiện tại ({homestay.rules?.length || 0})
              </Typography>
              <Grid container spacing={2}>
                {homestay.rules?.map((rule, index) => (
                  <Grid key={rule.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Card sx={{ p: 2 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <Checkbox
                          checked={values.keepRuleIds.includes(rule.id)}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            const newKeepIds = checked
                              ? [...values.keepRuleIds, rule.id]
                              : values.keepRuleIds.filter(
                                  (id) => id !== rule.id
                                );

                            if (!checked) {
                              const updated = values.updateExistingRules.filter(
                                (r) => r.ruleId !== rule.id
                              );
                              setFieldValue("updateExistingRules", updated);
                            }

                            setFieldValue("keepRuleIds", newKeepIds);
                          }}
                        />
                        <Typography variant="subtitle2">Giữ quy tắc</Typography>
                      </Box>
                      <Typography fontWeight={600}>{rule.ruleName}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Loại: {rule.ruleType}
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      <FormTextField
                        name={`updateExistingRules.${index}.customNote`}
                        label="Ghi chú"
                        placeholder="Ghi chú thêm..."
                        multiline
                        rows={2}
                      />
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* Thêm quy tắc mới */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" mb={3}>
                Thêm quy tắc mới
              </Typography>

              <FieldArray name="newRules">
                {(helpers) => (
                  <Box>
                    {values.newRules?.map((_, index) => (
                      <Card key={index} sx={{ mb: 2, p: 2 }}>
                        <Grid container spacing={2}>
                          <Grid size={{ xs: 12, sm: 10 }}>
                            <FormSelectField
                              name={`newRules.${index}.ruleId`}
                              label="Quy tắc"
                              required
                              options={rulesOptions.map((r: any) => ({
                                value: r.id,
                                label: `${r.ruleName} (${r.ruleType})`,
                              }))}
                            />
                          </Grid>
                          <Grid
                            size={{ xs: 12, sm: 2 }}
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <IconButton
                              color="error"
                              onClick={() => helpers.remove(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Grid>
                          <Grid size={12}>
                            <FormTextField
                              name={`newRules.${index}.customNote`}
                              label="Ghi chú"
                              multiline
                              rows={2}
                            />
                          </Grid>
                        </Grid>
                      </Card>
                    ))}
                    <AppButton
                      onClick={() =>
                        helpers.push({ ruleId: 0, customNote: "" })
                      }
                      variant="outlined"
                      fullWidth
                    >
                      + Thêm quy tắc
                    </AppButton>
                  </Box>
                )}
              </FieldArray>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 4,
                  pt: 3,
                  borderTop: "1px solid",
                  borderColor: "divider",
                }}
              >
                <AppButton
                  onClick={() =>
                    navigate(`/admin/homestays/${homestayId}/edit`)
                  }
                  variant="outlined"
                  disabled={isSubmitting}
                >
                  Hủy
                </AppButton>
                <AppButton
                  type="submit"
                  success
                  isLoading={isUpdating || isSubmitting}
                  disabled={
                    !isValid ||
                    isUpdating ||
                    (values.newRules.length === 0 &&
                      values.updateExistingRules.length === 0 &&
                      values.keepRuleIds.length === homestay.rules?.length)
                  }
                >
                  Cập nhật Quy tắc
                </AppButton>
              </Box>
            </Paper>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default UpdateHomestayRules;
