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
  useUpdateHomestayImagesMutation,
} from "@/services/endpoints/homestay.api";
import { FormTextField } from "@/components/Input";
import { FormSelectField } from "@/components/select";
import { FormCheckbox } from "@/components/checkbox";
import { AppButton } from "@/components/button";
import ImageUploadField from "@/components/uploadImage/ImageUploadField";
import * as Yup from "yup";
import type { UpdateHomestayImages } from "@/types/homestay.types";
import { useMemo } from "react";

const validationSchema = Yup.object().shape({
  keepImageIds: Yup.array().of(Yup.number()),
  newImages: Yup.array().of(
    Yup.object().shape({
      imageFile: Yup.mixed().required("Vui lòng chọn hình ảnh"),
      imageTitle: Yup.string(),
      imageDescription: Yup.string(),
      displayOrder: Yup.number().min(0, "Thứ tự phải >= 0"),
      isPrimaryImage: Yup.boolean(),
      roomType: Yup.string(),
    })
  ),
  updateExistingImages: Yup.array().of(
    Yup.object().shape({
      imageId: Yup.number().required("ID ảnh là bắt buộc"),
      imageTitle: Yup.string(),
      imageDescription: Yup.string(),
      displayOrder: Yup.number().min(0, "Thứ tự phải >= 0"),
      isPrimaryImage: Yup.boolean(),
      roomType: Yup.string(),
    })
  ),
});

const UpdateHomestayImages = () => {
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

  const [updateImages, { isLoading: isUpdating, error: updateError }] =
    useUpdateHomestayImagesMutation();

  const homestay = homestayData?.data;

  const initialValues = useMemo<UpdateHomestayImages>(() => {
    if (!homestay?.images) {
      return {
        keepImageIds: [],
        newImages: [],
        updateExistingImages: [],
      };
    }

    return {
      keepImageIds: homestay.images.map((img) => img.id),
      newImages: [],
      updateExistingImages: homestay.images.map((img) => ({
        imageId: img.id,
        imageTitle: img.imageTitle || "",
        imageDescription: img.imageDescription || "",
        displayOrder: img.displayOrder || 0,
        isPrimaryImage: img.isPrimaryImage || false,
        roomType: img.roomType || "",
      })),
    };
  }, [homestay?.images]);

  const handleSubmit = async (values: UpdateHomestayImages) => {
    try {
      // Đảm bảo các trường không phải undefined
      const payload: UpdateHomestayImages = {
        keepImageIds: values.keepImageIds || [],
        newImages: values.newImages || [],
        updateExistingImages: values.updateExistingImages || [],
      };

      const response = await updateImages({
        id: homestayId,
        data: payload,
      }).unwrap();

      if (response.success) {
        navigate(`/admin/homestays/${homestayId}/edit`);
      }
    } catch (error) {
      console.error("Lỗi cập nhật hình ảnh:", error);
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
            Quản lý Hình ảnh
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          {homestay.homestayTitle}
        </Typography>
        <Divider sx={{ mt: 2 }} />
      </Box>

      {updateError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: "4px" }}>
          Lỗi cập nhật hình ảnh:{" "}
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
                Hình ảnh hiện tại ({homestay.images?.length || 0})
              </Typography>
              <Grid container spacing={2}>
                {homestay.images?.map((image, index) => (
                  <Grid
                    key={image.id}
                    size={{
                      xs: 12,
                      sm: 6,
                      md: 4,
                    }}
                  >
                    <Card sx={{ p: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Checkbox
                          checked={values.keepImageIds.includes(image.id)}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            const currentKeepIds = [...values.keepImageIds];
                            if (isChecked) {
                              if (!currentKeepIds.includes(image.id)) {
                                currentKeepIds.push(image.id);
                              }
                            } else {
                              const keepIndex = currentKeepIds.indexOf(
                                image.id
                              );
                              if (keepIndex !== -1) {
                                currentKeepIds.splice(keepIndex, 1);
                              }
                              // Cũng xóa khỏi updateExistingImages nếu không giữ
                              const updatedImages =
                                values.updateExistingImages?.filter(
                                  (img) => img.imageId !== image.id
                                ) || [];
                              setFieldValue(
                                "updateExistingImages",
                                updatedImages
                              );
                            }
                            setFieldValue("keepImageIds", currentKeepIds);
                          }}
                        />
                        <Typography variant="subtitle2">Giữ ảnh này</Typography>
                      </Box>
                      <Box
                        component="img"
                        src={image.imageUrl}
                        alt={image.imageTitle || "Image"}
                        sx={{
                          width: "100%",
                          height: 200,
                          objectFit: "cover",
                          borderRadius: 1,
                          mb: 1,
                        }}
                      />
                      <Typography variant="body2" fontWeight={600}>
                        {image.imageTitle || "Không có tiêu đề"}
                      </Typography>
                      {image.isPrimaryImage && (
                        <Typography variant="caption" color="primary">
                          Ảnh đại diện
                        </Typography>
                      )}
                      <Typography
                        variant="caption"
                        display="block"
                        color="text.secondary"
                      >
                        Thứ tự: {image.displayOrder}
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" mb={1}>
                        Chỉnh sửa Metadata
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                          <FormTextField
                            name={`updateExistingImages.${index}.imageTitle`}
                            label="Tiêu đề hình ảnh"
                            placeholder="Nhập tiêu đề..."
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <FormTextField
                            name={`updateExistingImages.${index}.imageDescription`}
                            label="Mô tả hình ảnh"
                            placeholder="Nhập mô tả..."
                            multiline
                            rows={3}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <FormTextField
                            name={`updateExistingImages.${index}.displayOrder`}
                            label="Thứ tự hiển thị"
                            type="number"
                            placeholder="0"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <FormSelectField
                            name={`updateExistingImages.${index}.roomType`}
                            label="Loại phòng"
                            options={[
                              { value: "bedroom", label: "Phòng ngủ" },
                              { value: "bathroom", label: "Phòng tắm" },
                              { value: "kitchen", label: "Bếp" },
                              { value: "living", label: "Phòng khách" },
                              { value: "dining", label: "Phòng ăn" },
                              { value: "balcony", label: "Ban công" },
                              { value: "terrace", label: "Sân thượng" },
                              { value: "garden", label: "Sân vườn" },
                              { value: "pool", label: "Hồ bơi" },
                              { value: "outdoor", label: "Ngoài trời" },
                              { value: "parking", label: "Bãi đậu xe" },
                              { value: "other", label: "Khác" },
                            ]}
                            placeholder="Chọn loại phòng..."
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <FormCheckbox
                            name={`updateExistingImages.${index}.isPrimaryImage`}
                            label="Đặt làm ảnh đại diện"
                            description="Ảnh này sẽ được hiển thị đầu tiên"
                          />
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" mb={3}>
                Thêm hình ảnh mới
              </Typography>

              <FieldArray name="newImages">
                {(arrayHelpers) => (
                  <Box>
                    {values.newImages?.map((image: any, index: any) => (
                      <Card key={index} sx={{ mb: 3, p: 2 }}>
                        <Grid container spacing={2}>
                          <Grid size={{ xs: 12, md: 5 }}>
                            <Typography variant="subtitle2" mb={1}>
                              Ảnh mới #{index + 1}
                            </Typography>
                            <ImageUploadField
                              value={image.imageFile}
                              onChange={(file: any) => {
                                if (file) {
                                  setFieldValue(
                                    `newImages.${index}.imageFile`,
                                    file
                                  );
                                }
                              }}
                              error={
                                touched.newImages?.[index]?.imageFile &&
                                typeof errors.newImages?.[index] === "object" &&
                                "imageFile" in errors.newImages[index]
                                  ? String(errors.newImages[index].imageFile)
                                  : undefined
                              }
                            />
                          </Grid>
                          <Grid size={{ xs: 12, md: 7 }}>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 2,
                              }}
                            >
                              <Typography variant="subtitle2">
                                Thông tin hình ảnh #{index + 1}
                              </Typography>
                              <IconButton
                                color="error"
                                size="small"
                                onClick={() => arrayHelpers.remove(index)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                            <Grid container spacing={2}>
                              <Grid size={{ xs: 12 }}>
                                <FormTextField
                                  name={`newImages.${index}.imageTitle`}
                                  label="Tiêu đề hình ảnh"
                                  placeholder="Nhập tiêu đề..."
                                />
                              </Grid>
                              <Grid size={{ xs: 12 }}>
                                <FormTextField
                                  name={`newImages.${index}.imageDescription`}
                                  label="Mô tả hình ảnh"
                                  placeholder="Nhập mô tả..."
                                  multiline
                                  rows={3}
                                />
                              </Grid>
                              <Grid size={{ xs: 12, sm: 6 }}>
                                <FormTextField
                                  name={`newImages.${index}.displayOrder`}
                                  label="Thứ tự hiển thị"
                                  type="number"
                                  placeholder="0"
                                />
                              </Grid>
                              <Grid size={{ xs: 12, sm: 6 }}>
                                <FormSelectField
                                  name={`newImages.${index}.roomType`}
                                  label="Loại phòng"
                                  options={[
                                    { value: "bedroom", label: "Phòng ngủ" },
                                    { value: "bathroom", label: "Phòng tắm" },
                                    { value: "kitchen", label: "Bếp" },
                                    { value: "living", label: "Phòng khách" },
                                    { value: "dining", label: "Phòng ăn" },
                                    { value: "balcony", label: "Ban công" },
                                    { value: "terrace", label: "Sân thượng" },
                                    { value: "garden", label: "Sân vườn" },
                                    { value: "pool", label: "Hồ bơi" },
                                    { value: "outdoor", label: "Ngoài trời" },
                                    { value: "parking", label: "Bãi đậu xe" },
                                    { value: "other", label: "Khác" },
                                  ]}
                                  placeholder="Chọn loại phòng..."
                                />
                              </Grid>
                              <Grid size={{ xs: 12 }}>
                                <FormCheckbox
                                  name={`newImages.${index}.isPrimaryImage`}
                                  label="Đặt làm ảnh đại diện"
                                  description="Ảnh này sẽ được hiển thị đầu tiên"
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Card>
                    ))}
                    <AppButton
                      onClick={() =>
                        arrayHelpers.push({
                          imageFile: null,
                          imageTitle: "",
                          imageDescription: "",
                          displayOrder: values.newImages.length,
                          isPrimaryImage: false,
                          roomType: "",
                        })
                      }
                      variant="outlined"
                      fullWidth
                    >
                      + Thêm hình ảnh mới
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
                  disabled={
                    !isValid ||
                    isUpdating ||
                    (values.newImages.length === 0 &&
                      values.updateExistingImages?.length === 0 &&
                      values.keepImageIds.length === homestay.images?.length)
                  }
                >
                  Cập nhật Hình ảnh
                </AppButton>
              </Box>
            </Paper>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default UpdateHomestayImages;
