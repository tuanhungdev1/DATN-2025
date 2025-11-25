/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/admin/CouponManagement/CreateEditCouponPage.tsx
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Box, Typography, Grid, Card, CardContent, Alert } from "@mui/material";
import { AppButton } from "@/components/button";
import FormTextField from "@/components/Input/FormTextField";
import FormSelectField from "@/components/select/FormSelectField";
import FormDateTimeField from "@/components/datetime/FormDateTimeField";
import FormCheckbox from "@/components/checkbox/FormCheckbox";
import {
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useGetCouponByIdQuery,
} from "@/services/endpoints/coupon.api";
import { useToast } from "@/hooks/useToast";
import { CouponType, CouponScope } from "@/types/coupon.types";
import type { CreateCoupon, UpdateCoupon } from "@/types/coupon.types";
import { ArrowLeft, Save } from "lucide-react";
import { useGetHomestaysQuery } from "@/services/endpoints/homestay.api";

const validationSchema = Yup.object({
  couponCode: Yup.string()
    .required("Mã coupon là bắt buộc")
    .min(3, "Mã coupon phải có ít nhất 3 ký tự")
    .max(50, "Mã coupon không được quá 50 ký tự")
    .matches(
      /^[A-Z0-9_-]+$/,
      "Mã coupon chỉ được chứa chữ in hoa, số, gạch dưới và gạch ngang"
    ),
  couponName: Yup.string()
    .required("Tên coupon là bắt buộc")
    .min(3, "Tên coupon phải có ít nhất 3 ký tự")
    .max(200, "Tên coupon không được quá 200 ký tự"),
  description: Yup.string().max(1000, "Mô tả không được quá 1000 ký tự"),
  couponType: Yup.number().required("Loại coupon là bắt buộc"),
  discountValue: Yup.number()
    .required("Giá trị giảm là bắt buộc")
    .min(0, "Giá trị giảm phải lớn hơn 0"),
  maxDiscountAmount: Yup.number()
    .nullable()
    .min(0, "Giảm tối đa phải lớn hơn 0"),
  startDate: Yup.string().required("Ngày bắt đầu là bắt buộc"),
  endDate: Yup.string()
    .required("Ngày kết thúc là bắt buộc")
    .test(
      "is-greater",
      "Ngày kết thúc phải sau ngày bắt đầu",
      function (value) {
        const { startDate } = this.parent;
        return !startDate || !value || new Date(value) > new Date(startDate);
      }
    ),
  totalUsageLimit: Yup.number()
    .nullable()
    .min(1, "Giới hạn sử dụng phải lớn hơn 0"),
  usagePerUser: Yup.number()
    .nullable()
    .min(1, "Giới hạn mỗi người phải lớn hơn 0"),
  minimumBookingAmount: Yup.number()
    .nullable()
    .min(0, "Giá trị đơn tối thiểu phải lớn hơn 0"),
  minimumNights: Yup.number()
    .nullable()
    .min(1, "Số đêm tối thiểu phải lớn hơn 0"),
  scope: Yup.number().required("Phạm vi áp dụng là bắt buộc"),
  priority: Yup.number().min(0, "Độ ưu tiên phải lớn hơn hoặc bằng 0"),
  applicableHomestayIds: Yup.array()
    .of(Yup.number())
    .when("scope", {
      is: CouponScope.MultipleHomestays,
      then: (schema) =>
        schema
          .min(1, "Phải chọn ít nhất 1 homestay")
          .required("Phải chọn các homestay áp dụng"),
      otherwise: (schema) => schema.default([]), // Luôn là array
    }),
  specificHomestayId: Yup.number()
    .nullable()
    .when("scope", {
      is: CouponScope.SpecificHomestay,
      then: (schema) => schema.required("Phải chọn homestay"),
      otherwise: (schema) => schema.nullable(),
    }),
});

const CreateEditCouponPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const isEditMode = !!id;

  const { data: couponData, isLoading: isLoadingCoupon } =
    useGetCouponByIdQuery(Number(id), {
      skip: !isEditMode,
    });

  const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
  const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();

  const { data: homestaysData, isLoading: isLoadingHomestays } =
    useGetHomestaysQuery({
      pageNumber: 1,
      pageSize: 1000, // Lấy nhiều để có đủ options
      isActive: true,
      isApproved: true,
    });

  const homestayOptions =
    homestaysData?.data?.items?.map((h) => ({
      value: h.id,
      label: `${h.homestayTitle} - ${h.city}`,
    })) || [];

  const initialValues: CreateCoupon = {
    couponCode: "",
    couponName: "",
    description: "",
    couponType: CouponType.Percentage,
    discountValue: 0,
    maxDiscountAmount: null,
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    totalUsageLimit: null,
    usagePerUser: null,
    minimumBookingAmount: null,
    minimumNights: null,
    isFirstBookingOnly: false,
    isNewUserOnly: false,
    scope: CouponScope.AllHomestays,
    specificHomestayId: null,
    applicableHomestayIds: [],
    isPublic: true,
    priority: 0,
    actingAsRole: "Admin",
  };

  const handleSubmit = async (values: CreateCoupon) => {
    try {
      const payload: CreateCoupon = {
        ...values,
        startDate: new Date(values.startDate).toISOString(),
        endDate: new Date(values.endDate).toISOString(),
        specificHomestayId:
          values.scope === CouponScope.SpecificHomestay
            ? values.specificHomestayId
            : null,
        applicableHomestayIds:
          values.scope === CouponScope.MultipleHomestays
            ? values.applicableHomestayIds
            : [],
      };

      if (isEditMode) {
        const updatePayload: UpdateCoupon = {
          couponName: values.couponName,
          description: values.description,
          discountValue: values.discountValue,
          maxDiscountAmount: values.maxDiscountAmount,
          startDate: new Date(values.startDate).toISOString(),
          endDate: new Date(values.endDate).toISOString(),
          totalUsageLimit: values.totalUsageLimit,
          usagePerUser: values.usagePerUser,
          minimumBookingAmount: values.minimumBookingAmount,
          minimumNights: values.minimumNights,
          scope: values.scope,
          specificHomestayId:
            values.scope === CouponScope.SpecificHomestay
              ? values.specificHomestayId
              : null,
          applicableHomestayIds:
            values.scope === CouponScope.MultipleHomestays
              ? values.applicableHomestayIds
              : null,
          isPublic: values.isPublic,
          priority: values.priority,
          actingAsRole: "Admin",
        };
        await updateCoupon({
          id: Number(id),
          data: updatePayload,
        }).unwrap();
        toast.success("Cập nhật coupon thành công");
      } else {
        await createCoupon(payload).unwrap();
        toast.success("Tạo coupon thành công");
      }
      navigate("/admin/coupons");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.data?.message || "Có lỗi xảy ra");
    }
  };

  if (isEditMode && isLoadingCoupon) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <Typography>Đang tải...</Typography>
      </Box>
    );
  }

  const editInitialValues =
    isEditMode && couponData?.data
      ? {
          ...initialValues,
          couponCode: couponData.data.couponCode,
          couponName: couponData.data.couponName,
          description: couponData.data.description || "",
          couponType: couponData.data.couponType,
          discountValue: couponData.data.discountValue,
          maxDiscountAmount: couponData.data.maxDiscountAmount,
          startDate: couponData.data.startDate.split("T")[0],
          endDate: couponData.data.endDate.split("T")[0],
          totalUsageLimit: couponData.data.totalUsageLimit,
          usagePerUser: couponData.data.usagePerUser,
          minimumBookingAmount: couponData.data.minimumBookingAmount,
          minimumNights: couponData.data.minimumNights,
          isFirstBookingOnly: couponData.data.isFirstBookingOnly,
          isNewUserOnly: couponData.data.isNewUserOnly,
          scope: couponData.data.scope,
          specificHomestayId: couponData.data.specificHomestayId,
          applicableHomestayIds: couponData.data.applicableHomestayIds || [],
          isPublic: couponData.data.isPublic,
          priority: couponData.data.priority,
        }
      : initialValues;

  return (
    <Box sx={{ py: 2 }}>
      <Box
        sx={{
          boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px;",
          borderRadius: "10px",
          px: 3,
          py: 2,
        }}
      >
        <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
          <AppButton
            variant="outlined"
            startIcon={<ArrowLeft size={18} />}
            onClick={() => navigate("/admin/coupons")}
            size="small"
          >
            Quay lại
          </AppButton>
          <Typography variant="h4" fontSize={"34px"}>
            {isEditMode ? "Chỉnh sửa Coupon" : "Tạo Coupon mới"}
          </Typography>
        </Box>

        <Formik
          initialValues={editInitialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
          validateOnChange={false}
          validateOnBlur={true}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <Grid container spacing={3}>
                {/* Basic Information */}
                <Grid size={{ xs: 12 }}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" mb={2} fontWeight={600}>
                        Thông tin cơ bản
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <FormTextField
                            name="couponCode"
                            label="Mã Coupon"
                            placeholder="VD: SUMMER2024"
                            required
                            disabled={isEditMode}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <FormTextField
                            name="couponName"
                            label="Tên Coupon"
                            placeholder="VD: Giảm giá mùa hè"
                            required
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <FormTextField
                            name="description"
                            label="Mô tả"
                            placeholder="Nhập mô tả chi tiết"
                            multiline
                            rows={3}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Discount Configuration */}
                <Grid size={{ xs: 12 }}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" mb={2} fontWeight={600}>
                        Cấu hình giảm giá
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <FormSelectField
                            name="couponType"
                            label="Loại Coupon"
                            required
                            options={[
                              {
                                value: CouponType.Percentage,
                                label: "Phần trăm",
                              },
                              {
                                value: CouponType.FixedAmount,
                                label: "Số tiền cố định",
                              },
                              {
                                value: CouponType.FirstBooking,
                                label: "Đặt phòng đầu tiên",
                              },
                              {
                                value: CouponType.Seasonal,
                                label: "Theo mùa",
                              },
                              {
                                value: CouponType.LongStay,
                                label: "Ở dài hạn",
                              },
                              {
                                value: CouponType.Referral,
                                label: "Giới thiệu",
                              },
                            ]}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <FormTextField
                            name="discountValue"
                            label={
                              values.couponType === CouponType.Percentage
                                ? "Giảm (%)"
                                : "Giảm (VND)"
                            }
                            type="number"
                            required
                            placeholder="0"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                          <FormTextField
                            name="maxDiscountAmount"
                            label="Giảm tối đa (VND)"
                            type="number"
                            placeholder="Không giới hạn"
                          />
                        </Grid>
                      </Grid>

                      {values.couponType === CouponType.Percentage && (
                        <Alert severity="info" sx={{ mt: 2 }}>
                          Với loại phần trăm, bạn nên đặt giá trị giảm tối đa để
                          kiểm soát chi phí
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                {/* Validity Period */}
                <Grid size={{ xs: 12 }}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" mb={2} fontWeight={600}>
                        Thời gian hiệu lực
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <FormDateTimeField
                            name="startDate"
                            label="Ngày bắt đầu"
                            type="date"
                            required
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <FormDateTimeField
                            name="endDate"
                            label="Ngày kết thúc"
                            type="date"
                            required
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Usage Limits */}
                <Grid size={{ xs: 12 }}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" mb={2} fontWeight={600}>
                        Giới hạn sử dụng
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <FormTextField
                            name="totalUsageLimit"
                            label="Tổng số lần sử dụng"
                            type="number"
                            placeholder="Không giới hạn"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <FormTextField
                            name="usagePerUser"
                            label="Số lần mỗi người"
                            type="number"
                            placeholder="Không giới hạn"
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Conditions */}
                <Grid size={{ xs: 12 }}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" mb={2} fontWeight={600}>
                        Điều kiện áp dụng
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <FormTextField
                            name="minimumBookingAmount"
                            label="Giá trị đơn tối thiểu (VND)"
                            type="number"
                            placeholder="0"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <FormTextField
                            name="minimumNights"
                            label="Số đêm tối thiểu"
                            type="number"
                            placeholder="0"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <FormCheckbox
                            name="isFirstBookingOnly"
                            label="Chỉ áp dụng cho đặt phòng đầu tiên"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <FormCheckbox
                            name="isNewUserOnly"
                            label="Chỉ áp dụng cho người dùng mới"
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Scope */}
                <Grid size={{ xs: 12 }}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" mb={2} fontWeight={600}>
                        Phạm vi áp dụng
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid
                          size={{
                            xs: 12,
                            md:
                              values.scope === CouponScope.MultipleHomestays
                                ? 12
                                : 6,
                          }}
                        >
                          <FormSelectField
                            name="scope"
                            label="Phạm vi"
                            required
                            options={[
                              {
                                value: CouponScope.AllHomestays,
                                label: "Tất cả Homestay",
                              },
                              {
                                value: CouponScope.SpecificHomestay,
                                label: "Homestay cụ thể",
                              },
                              {
                                value: CouponScope.MultipleHomestays,
                                label: "Nhiều Homestay",
                              },
                            ]}
                          />
                        </Grid>

                        {values.scope === CouponScope.SpecificHomestay && (
                          <Grid size={{ xs: 12, md: 6 }}>
                            <FormSelectField
                              name="specificHomestayId"
                              label="Chọn Homestay"
                              required
                              options={homestayOptions}
                              disabled={isLoadingHomestays}
                            />
                          </Grid>
                        )}

                        {values.scope === CouponScope.MultipleHomestays && (
                          <Grid size={{ xs: 12 }}>
                            <FormSelectField
                              name="applicableHomestayIds"
                              label="Chọn các Homestay áp dụng"
                              required
                              multiple
                              options={homestayOptions}
                              disabled={isLoadingHomestays}
                              helperText="Có thể chọn nhiều homestay"
                            />
                          </Grid>
                        )}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Additional Settings */}
                <Grid size={{ xs: 12 }}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" mb={2} fontWeight={600}>
                        Cài đặt bổ sung
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <FormTextField
                            name="priority"
                            label="Độ ưu tiên"
                            type="number"
                            placeholder="0"
                            helperText="Số càng cao, ưu tiên càng cao"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                          <FormCheckbox
                            name="isPublic"
                            label="Coupon công khai (hiển thị cho mọi người)"
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Action Buttons */}
                <Grid size={{ xs: 12 }}>
                  <Box
                    sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}
                  >
                    <AppButton
                      variant="outlined"
                      onClick={() => navigate("/admin/coupons")}
                      disabled={isCreating || isUpdating}
                    >
                      Hủy
                    </AppButton>
                    <AppButton
                      variant="contained"
                      type="submit"
                      startIcon={<Save size={18} />}
                      disabled={isCreating || isUpdating}
                    >
                      {isCreating || isUpdating
                        ? "Đang xử lý..."
                        : isEditMode
                        ? "Cập nhật"
                        : "Tạo Coupon"}
                    </AppButton>
                  </Box>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default CreateEditCouponPage;
