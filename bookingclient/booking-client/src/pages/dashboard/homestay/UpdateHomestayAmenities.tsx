/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
  useUpdateHomestayAmenitiesMutation,
} from "@/services/endpoints/homestay.api";
import { useGetAmenitiesQuery } from "@/services/endpoints/amenity.api";
import { FormTextField } from "@/components/Input";
import { FormSelectField } from "@/components/select";
import { AppButton } from "@/components/button";
import type { UpdateHomestayAmenities } from "@/types/homestay.types";
import * as Yup from "yup";
import { useMemo } from "react";

const validationSchema = Yup.object().shape({
  keepAmenityIds: Yup.array().of(Yup.number()),
  newAmenities: Yup.array().of(
    Yup.object().shape({
      amenityId: Yup.number()
        .required("Vui lòng chọn tiện nghi")
        .min(1, "Vui lòng chọn tiện nghi"),
      customNote: Yup.string().max(500, "Ghi chú tối đa 500 ký tự"),
    })
  ),
  updateExistingAmenities: Yup.array().of(
    Yup.object().shape({
      amenityId: Yup.number()
        .required("ID tiện nghi là bắt buộc")
        .min(1, "ID tiện nghi không hợp lệ"),
      customNote: Yup.string().max(500, "Ghi chú tối đa 500 ký tự"),
    })
  ),
});

const UpdateHomestayAmenities = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const homestayId = id ? parseInt(id) : 0;

  const {
    data: homestayData,
    isLoading: isLoadingHomestay,
    error: homestayError,
  } = useGetHomestayByIdQuery(homestayId, {
    skip: !homestayId,
  });

  const { data: amenitiesData } = useGetAmenitiesQuery({
    pageNumber: 1,
    pageSize: 100,
    isActive: true,
  });
  const amenitiesOptions = amenitiesData?.data?.items || [];

  const [updateAmenities, { isLoading: isUpdating, error: updateError }] =
    useUpdateHomestayAmenitiesMutation();

  const homestay = homestayData?.data;

  const initialValues = useMemo<UpdateHomestayAmenities>(() => {
    if (!homestay?.amenities) {
      return {
        keepAmenityIds: [],
        newAmenities: [],
        updateExistingAmenities: [],
      };
    }

    return {
      keepAmenityIds: homestay.amenities.map((a) => a.id),
      newAmenities: [],
      updateExistingAmenities: homestay.amenities.map((a) => ({
        amenityId: a.id,
        customNote: a.customNote || "",
      })),
    };
  }, [homestay?.amenities]);

  const handleSubmit = async (values: UpdateHomestayAmenities) => {
    try {
      const payload: UpdateHomestayAmenities = {
        keepAmenityIds: values.keepAmenityIds || [],
        newAmenities: values.newAmenities || [],
        updateExistingAmenities: values.updateExistingAmenities || [],
      };
      console.log("Payload gửi đi:", JSON.stringify(payload, null, 2));

      const response = await updateAmenities({
        id: homestayId,
        data: payload,
      }).unwrap();

      if (response.success) {
        navigate(`/admin/homestays/${homestayId}/edit`);
      }
    } catch (error) {
      console.error("Lỗi cập nhật tiện nghi:", JSON.stringify(error, null, 2));
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
            Quản lý Tiện nghi
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          {homestay.homestayTitle}
        </Typography>
        <Divider sx={{ mt: 2 }} />
      </Box>

      {updateError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: "4px" }}>
          Lỗi cập nhật tiện nghi:{" "}
          {(updateError as any)?.data?.message || "Vui lòng thử lại."}
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
        {({
          values,
          isSubmitting,
          isValid,
          setFieldValue,
          errors,
          touched,
        }) => (
          <Form>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" mb={3}>
                Tiện nghi hiện tại ({homestay.amenities?.length || 0})
              </Typography>
              <Grid container spacing={2}>
                {homestay.amenities?.map((amenity, index) => (
                  <Grid
                    key={amenity.id}
                    size={{
                      xs: 12,
                      sm: 6,
                      md: 4,
                    }}
                  >
                    <Card sx={{ p: 2 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <Checkbox
                          checked={values.keepAmenityIds.includes(amenity.id)}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            let newKeepIds: number[];

                            if (isChecked) {
                              newKeepIds = [
                                ...values.keepAmenityIds,
                                amenity.id,
                              ];
                            } else {
                              newKeepIds = values.keepAmenityIds.filter(
                                (id) => id !== amenity.id
                              );

                              // Chỉ xóa khỏi updateExistingAmenities nếu thực sự cần
                              // và làm trong một lần setFieldValue
                              const updatedAmenities =
                                values.updateExistingAmenities?.filter(
                                  (a) => a.amenityId !== amenity.id
                                ) || [];

                              // Batch update
                              setFieldValue("keepAmenityIds", newKeepIds);
                              setFieldValue(
                                "updateExistingAmenities",
                                updatedAmenities
                              );
                              return; // Thoát sớm để tránh gọi setFieldValue 2 lần
                            }

                            setFieldValue("keepAmenityIds", newKeepIds);
                          }}
                        />
                        <Typography variant="subtitle2">
                          Giữ tiện nghi này
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight={600}>
                        {amenity.amenityName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Danh mục: {amenity.category}
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" mb={1}>
                        Chỉnh sửa Ghi chú
                      </Typography>
                      <FormTextField
                        name={`updateExistingAmenities.${index}.customNote`}
                        label="Ghi chú"
                        placeholder="Nhập ghi chú thêm về tiện nghi này..."
                        multiline
                        rows={2}
                      />
                    </Card>
                  </Grid>
                ))}
                {(!homestay.amenities || homestay.amenities.length === 0) && (
                  <Typography variant="body2" color="text.secondary">
                    Chưa có tiện nghi nào
                  </Typography>
                )}
              </Grid>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" mb={3}>
                Thêm tiện nghi mới
              </Typography>

              <FieldArray name="newAmenities">
                {(arrayHelpers) => (
                  <Box>
                    {values.newAmenities?.map((amenity, index) => (
                      <Card key={index} sx={{ mb: 2, p: 2 }}>
                        <Grid container spacing={2}>
                          <Grid size={{ xs: 12, sm: 10 }}>
                            <FormSelectField
                              name={`newAmenities.${index}.amenityId`}
                              label="Tiện nghi"
                              required
                              options={amenitiesOptions.map((a: any) => ({
                                value: a.id,
                                label: `${a.amenityName} (${a.category})`,
                              }))}
                              placeholder="Chọn tiện nghi..."
                            />
                          </Grid>
                          <Grid
                            size={{ xs: 12, sm: 2 }}
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <IconButton
                              color="error"
                              onClick={() => arrayHelpers.remove(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <FormTextField
                              name={`newAmenities.${index}.customNote`}
                              label="Ghi chú"
                              placeholder="Nhập ghi chú thêm về tiện nghi này..."
                              multiline
                              rows={2}
                            />
                          </Grid>
                        </Grid>
                      </Card>
                    ))}
                    <AppButton
                      onClick={() =>
                        arrayHelpers.push({
                          amenityId: 0,
                          customNote: "",
                        })
                      }
                      variant="outlined"
                      fullWidth
                    >
                      + Thêm tiện nghi
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
                  loadingText="Đang cập nhật..."
                  disabled={isSubmitting || isUpdating}
                >
                  Cập nhật Tiện nghi
                </AppButton>
              </Box>
            </Paper>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default UpdateHomestayAmenities;
