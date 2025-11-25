/* eslint-disable @typescript-eslint/no-unused-vars */
import { AppButton } from "@/components/button";
import { FormCheckbox } from "@/components/checkbox";
import { FormDateTimeField } from "@/components/datetime";
import { FormTextField } from "@/components/Input";
import { useToast } from "@/hooks/useToast";
import {
  useGetHomestayByIdQuery,
  useUpdateAvailabilityCalendarsMutation,
} from "@/services/endpoints/homestay.api";
import type {
  CreateAvailabilityCalendar,
  UpdateExistingAvailabilityCalendar,
  UpdateHomestayAvailabilityCalendars,
} from "@/types/homestay.types";
import {
  Alert,
  Box,
  Card,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { FieldArray, Form, Formik } from "formik";
import { DeleteIcon, EditIcon } from "lucide-react";
import { useState } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";

import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  newCalendars: Yup.array().of(
    Yup.object().shape({
      availableDate: Yup.string().required("Vui lòng chọn ngày"),
      isAvailable: Yup.boolean(),
      customPrice: Yup.number().nullable().min(0, "Giá phải >= 0"),
      minimumNights: Yup.number().nullable().min(1, "Số đêm tối thiểu >= 1"),
      isBlocked: Yup.boolean(),
      blockReason: Yup.string().when("isBlocked", {
        is: true,
        then: (schema) => schema.required("Vui lòng nhập lý do chặn"),
        otherwise: (schema) => schema.nullable(),
      }),
    })
  ),
});

const UpdateAvailabilityCalendar = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const homestayId = id ? parseInt(id) : 0;
  const toast = useToast();

  const [editingCalendar, setEditingCalendar] = useState<number | null>(null);
  const [deleteCalendarIds, setDeleteCalendarIds] = useState<number[]>([]);

  const {
    data: homestayData,
    isLoading: isLoadingHomestay,
    error: homestayError,
  } = useGetHomestayByIdQuery(homestayId, {
    skip: !homestayId,
  });

  const [updateCalendars, { isLoading: isUpdating, error: updateError }] =
    useUpdateAvailabilityCalendarsMutation();

  const homestay = homestayData?.data;

  const handleSubmit = async (values: {
    newCalendars: CreateAvailabilityCalendar[];
    updateCalendars: UpdateExistingAvailabilityCalendar[];
  }) => {
    try {
      const data: UpdateHomestayAvailabilityCalendars = {
        newCalendars: values.newCalendars.map((cal) => ({
          ...cal,
          homestayId,
        })),
        updateCalendars: values.updateCalendars,
        deleteCalendarIds:
          deleteCalendarIds.length > 0 ? deleteCalendarIds : undefined,
      };
      console.log("Data to submit:", data);

      const response = await updateCalendars({
        id: homestayId,
        data,
      }).unwrap();

      if (response.success) {
        toast.success("Cập nhật lịch khả dụng thành công!");
        navigate(`/admin/homestays/${homestayId}/edit`);
      } else {
        toast.error("Cập nhật lịch thất bại. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Lỗi cập nhật lịch:", error);
      toast.error("Đã xảy ra lỗi khi cập nhật lịch!");
    }
  };

  const handleDeleteExisting = (calendarId: number) => {
    setDeleteCalendarIds((prev) => [...prev, calendarId]);
    toast.info("Lịch đã được đánh dấu xóa. Nhấn 'Hoàn tác' nếu muốn phục hồi.");
  };

  const handleUndoDelete = (calendarId: number) => {
    setDeleteCalendarIds((prev) => prev.filter((id) => id !== calendarId));
    toast.success("Hoàn tác xóa lịch thành công!");
  };

  const handleCancelEdit = () => {
    setEditingCalendar(null);
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

  const initialValues = {
    newCalendars: [] as CreateAvailabilityCalendar[],
    updateCalendars: [] as UpdateExistingAvailabilityCalendar[],
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <IconButton
            onClick={() => navigate(`/admin/homestays/${homestayId}/edit`)}
          >
            <IoArrowBackCircleOutline />
          </IconButton>
          <Typography variant="h2" sx={{ fontWeight: 600 }}>
            Quản lý Lịch Khả Dụng
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          {homestay.homestayTitle}
        </Typography>
        <Divider sx={{ mt: 2 }} />
      </Box>

      {updateError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: "4px" }}>
          Lỗi cập nhật lịch. Vui lòng thử lại.
        </Alert>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, isSubmitting, isValid, setFieldValue }) => {
          // ✅ Định nghĩa handler BÊN TRONG Formik render props
          const handleEditCalendar = (calendarId: number) => {
            const calendar = homestay.availabilityCalendars?.find(
              (c) => c.id === calendarId
            );
            if (!calendar) return;

            // Kiểm tra xem đã có trong updateCalendars chưa
            const existingIndex = values.updateCalendars.findIndex(
              (c) => c.calendarId === calendarId
            );

            // Chỉ thêm nếu chưa tồn tại
            if (existingIndex === -1) {
              const newUpdate: UpdateExistingAvailabilityCalendar = {
                calendarId: calendar.id,
                availableDate: calendar.availableDate,
                isAvailable: calendar.isAvailable,
                customPrice: calendar.customPrice || undefined,
                minimumNights: calendar.minimumNights || undefined,
                isBlocked: calendar.isBlocked,
                blockReason: calendar.blockReason || undefined,
              };

              setFieldValue("updateCalendars", [
                ...values.updateCalendars,
                newUpdate,
              ]);
            }

            setEditingCalendar(calendarId);
          };

          return (
            <Form>
              {/* ✅ BẢNG LỊCH HIỆN TẠI - DI CHUYỂN VÀO TRONG FORM */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" mb={3}>
                  Lịch khả dụng hiện tại (
                  {homestay.availabilityCalendars?.length || 0})
                </Typography>
                {homestay.availabilityCalendars &&
                homestay.availabilityCalendars.length > 0 ? (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Ngày</TableCell>
                          <TableCell>Trạng thái</TableCell>
                          <TableCell align="right">Giá tùy chỉnh</TableCell>
                          <TableCell align="center">Số đêm tối thiểu</TableCell>
                          <TableCell align="center">Hành động</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {homestay.availabilityCalendars.map((calendar) => {
                          const isMarkedForDelete = deleteCalendarIds.includes(
                            calendar.id
                          );

                          return (
                            <TableRow
                              key={calendar.id}
                              sx={{
                                opacity: isMarkedForDelete ? 0.5 : 1,
                                textDecoration: isMarkedForDelete
                                  ? "line-through"
                                  : "none",
                              }}
                            >
                              <TableCell>
                                {(() => {
                                  const formatted = new Date(
                                    calendar.availableDate
                                  ).toLocaleDateString("vi-VN", {
                                    weekday: "long",
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  });
                                  return (
                                    formatted.charAt(0).toUpperCase() +
                                    formatted.slice(1)
                                  );
                                })()}
                              </TableCell>

                              <TableCell>
                                {calendar.isBlocked ? (
                                  <Chip
                                    label="Đã chặn"
                                    color="error"
                                    size="small"
                                  />
                                ) : calendar.isAvailable ? (
                                  <Chip
                                    label="Có sẵn"
                                    color="success"
                                    size="small"
                                  />
                                ) : (
                                  <Chip
                                    label="Không có sẵn"
                                    color="default"
                                    size="small"
                                  />
                                )}
                              </TableCell>
                              <TableCell align="right">
                                {calendar.customPrice
                                  ? `${calendar.customPrice.toLocaleString()} VNĐ`
                                  : "-"}
                              </TableCell>
                              <TableCell align="center">
                                {calendar.minimumNights || "-"}
                              </TableCell>
                              <TableCell align="center">
                                {isMarkedForDelete ? (
                                  <AppButton
                                    size="small"
                                    onClick={() =>
                                      handleUndoDelete(calendar.id)
                                    }
                                  >
                                    Hoàn tác
                                  </AppButton>
                                ) : (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      gap: 1,
                                      justifyContent: "center",
                                    }}
                                  >
                                    {/* ✅ BÂY GIỜ CÓ THỂ GỌI handleEditCalendar */}
                                    <IconButton
                                      size="small"
                                      color="primary"
                                      onClick={() =>
                                        handleEditCalendar(calendar.id)
                                      }
                                    >
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() =>
                                        handleDeleteExisting(calendar.id)
                                      }
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Box>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Chưa có lịch khả dụng nào
                  </Typography>
                )}
              </Paper>

              {/* ✅ SECTION CHỈNH SỬA */}
              {editingCalendar && (
                <Paper sx={{ p: 3, mb: 3, bgcolor: "info.lighter" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 3,
                    }}
                  >
                    <Typography variant="h6">Chỉnh sửa lịch</Typography>
                    <IconButton
                      size="small"
                      onClick={handleCancelEdit}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  {(() => {
                    const updateIndex = values.updateCalendars.findIndex(
                      (c) => c.calendarId === editingCalendar
                    );

                    if (updateIndex === -1) {
                      return <Alert severity="info">Đang tải dữ liệu...</Alert>;
                    }

                    return (
                      <Card sx={{ p: 2 }}>
                        <Grid container spacing={2}>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <FormDateTimeField
                              name={`updateCalendars.${updateIndex}.availableDate`}
                              label="Ngày có sẵn"
                              required
                              type="date"
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <FormTextField
                              name={`updateCalendars.${updateIndex}.customPrice`}
                              label="Giá tùy chỉnh (VNĐ)"
                              type="number"
                              placeholder="Để trống nếu dùng giá mặc định"
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <FormTextField
                              name={`updateCalendars.${updateIndex}.minimumNights`}
                              label="Số đêm tối thiểu"
                              type="number"
                              placeholder="Để trống nếu dùng mặc định"
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <Box sx={{ pt: 3 }}>
                              <FormCheckbox
                                name={`updateCalendars.${updateIndex}.isAvailable`}
                                label="Có sẵn"
                              />
                            </Box>
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <FormCheckbox
                              name={`updateCalendars.${updateIndex}.isBlocked`}
                              label="Chặn ngày này"
                              description="Ngày này sẽ không thể đặt"
                            />
                          </Grid>
                          {values.updateCalendars[updateIndex]?.isBlocked && (
                            <Grid size={{ xs: 12 }}>
                              <FormTextField
                                name={`updateCalendars.${updateIndex}.blockReason`}
                                label="Lý do chặn"
                                placeholder="Nhập lý do..."
                                multiline
                                rows={2}
                                required
                              />
                            </Grid>
                          )}
                        </Grid>
                        <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                          <AppButton
                            variant="outlined"
                            onClick={handleCancelEdit}
                            fullWidth
                          >
                            Hủy
                          </AppButton>
                          <AppButton
                            success
                            onClick={() => {
                              handleCancelEdit();
                              toast.success(
                                "Đã lưu thay đổi vào danh sách cập nhật!"
                              );
                            }}
                            fullWidth
                          >
                            Lưu thay đổi
                          </AppButton>
                        </Box>
                      </Card>
                    );
                  })()}
                </Paper>
              )}

              {/* SECTION THÊM LỊCH MỚI */}
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" mb={3}>
                  Thêm lịch mới
                </Typography>

                <FieldArray name="newCalendars">
                  {(arrayHelpers) => (
                    <Box>
                      {values.newCalendars?.map((calendar, index) => (
                        <Card key={index} sx={{ mb: 2, p: 2 }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 2,
                            }}
                          >
                            <Typography variant="subtitle2">
                              Lịch mới #{index + 1}
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
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <FormDateTimeField
                                name={`newCalendars.${index}.availableDate`}
                                label="Ngày có sẵn"
                                required
                                type="date"
                              />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <FormTextField
                                name={`newCalendars.${index}.customPrice`}
                                label="Giá tùy chỉnh (VNĐ)"
                                type="number"
                                placeholder="Để trống nếu dùng giá mặc định"
                              />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <FormTextField
                                name={`newCalendars.${index}.minimumNights`}
                                label="Số đêm tối thiểu"
                                type="number"
                                placeholder="Để trống nếu dùng mặc định"
                              />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Box sx={{ pt: 3 }}>
                                <FormCheckbox
                                  name={`newCalendars.${index}.isAvailable`}
                                  label="Có sẵn"
                                />
                              </Box>
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                              <FormCheckbox
                                name={`newCalendars.${index}.isBlocked`}
                                label="Chặn ngày này"
                                description="Ngày này sẽ không thể đặt"
                              />
                            </Grid>
                            {values.newCalendars[index]?.isBlocked && (
                              <Grid size={{ xs: 12 }}>
                                <FormTextField
                                  name={`newCalendars.${index}.blockReason`}
                                  label="Lý do chặn"
                                  placeholder="Nhập lý do..."
                                  multiline
                                  rows={2}
                                  required
                                />
                              </Grid>
                            )}
                          </Grid>
                        </Card>
                      ))}
                      <AppButton
                        onClick={() => {
                          const lastItem =
                            values.newCalendars?.[
                              values.newCalendars.length - 1
                            ];
                          const lastDate = lastItem
                            ? new Date(lastItem.availableDate)
                            : new Date();
                          const nextDate = new Date(lastDate);
                          nextDate.setDate(lastDate.getDate() + 1);

                          arrayHelpers.push({
                            homestayId: 0,
                            availableDate: nextDate.toISOString().split("T")[0],
                            isAvailable: true,
                            customPrice: null,
                            minimumNights: null,
                            isBlocked: false,
                            blockReason: null,
                          });
                        }}
                        variant="outlined"
                        fullWidth
                      >
                        + Thêm lịch khả dụng
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
                      isUpdating ||
                      (values.newCalendars.length === 0 &&
                        values.updateCalendars.length === 0 &&
                        deleteCalendarIds.length === 0)
                    }
                  >
                    Cập nhật Lịch
                  </AppButton>
                </Box>
              </Paper>
            </Form>
          );
        }}
      </Formik>
    </Container>
  );
};

export default UpdateAvailabilityCalendar;
