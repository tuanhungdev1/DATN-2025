/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/admin/homestay/UpdateHomestay.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Formik, Form } from "formik";
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Card,
  CardContent,
} from "@mui/material";

import { updateHomestayValidationSchema } from "@/validators/homestayValidation";
import {
  useGetHomestayByIdQuery,
  useUpdateHomestayMutation,
} from "@/services/endpoints/homestay.api";
import type { UpdateHomestay } from "@/types/homestay.types";
import { FormTextField } from "@/components/Input";
import { FormSelectField } from "@/components/select";
import { FormCheckbox } from "@/components/checkbox";
import { AppButton } from "@/components/button";

// Import API hooks
import { useGetPropertyTypesQuery } from "@/services/endpoints/propertyType.api";
import { generateSlug } from "@/utils/formatString";
import LeafletMapPicker from "@/components/googleMap/LeafletMapPicker";
import {
  ArrowRight,
  CalendarDays,
  Home,
  Image,
  ScrollText,
} from "lucide-react";
import LoadingDialog from "./LoadingDialog";
import { useToast } from "@/hooks/useToast";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(
  props: TabPanelProps & { setFieldValue?: any; values?: any }
) {
  const { children, value, index, setFieldValue, values, ...other } = props;

  // Clone children và inject props
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, {
        setFieldValue,
        values,
      });
    }
    return child;
  });

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{childrenWithProps}</Box>}
    </div>
  );
}

const UpdateHomestay = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const homestayId = id ? parseInt(id) : 0;
  const [activeTab, setActiveTab] = useState(0);
  const [showLoadingDialog, setShowLoadingDialog] = useState(false);
  const location = useLocation();
  const toast = useToast();
  // Fetch homestay data
  const {
    data: homestayData,
    isLoading: isLoadingHomestay,
    error: homestayError,
  } = useGetHomestayByIdQuery(homestayId, {
    skip: !homestayId,
  });

  const [updateHomestay, { isLoading: isUpdating, error: updateError }] =
    useUpdateHomestayMutation();

  // Fetch data from API
  const { data: propertyTypesData } = useGetPropertyTypesQuery({
    pageNumber: 1,
    pageSize: 100,
    isActive: true,
  });
  const propertyTypes = propertyTypesData?.data?.items || [];

  const homestay = homestayData?.data;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSubmit = async (values: UpdateHomestay) => {
    setShowLoadingDialog(true);

    try {
      const response = await updateHomestay({
        id: homestayId,
        data: values,
      }).unwrap();

      if (response.success) {
        // Xác định đường dẫn trả về theo role
        const isAdmin = location.pathname.startsWith("/admin");
        const isHost = location.pathname.startsWith("/host");

        const redirectPath = isAdmin
          ? `/admin/homestays/${homestayId}`
          : `/host/homestays/${homestayId}`;

        toast.success("Cập nhật homestay thành công!");

        setTimeout(() => {
          setShowLoadingDialog(false);
          navigate(redirectPath);
        }, 800);
      }
    } catch (error: any) {
      setShowLoadingDialog(false);

      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Cập nhật homestay thất bại. Vui lòng thử lại sau.";

      toast.error(errorMessage);
      console.error("Lỗi cập nhật homestay:", error);
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

  const initialValues: UpdateHomestay = {
    homestayTitle: homestay.homestayTitle || "",
    homestayDescription: homestay.homestayDescription || "",
    slug:
      homestay.slug ||
      (homestay.homestayTitle ? generateSlug(homestay.homestayTitle) : ""),
    fullAddress: homestay.fullAddress || "",
    city: homestay.city || "",
    province: homestay.province || "",
    country: homestay.country || "Vietnam",
    postalCode: homestay.postalCode || "",
    latitude: homestay.latitude || 0,
    longitude: homestay.longitude || 0,
    areaInSquareMeters: homestay.areaInSquareMeters || undefined, // Thêm
    numberOfFloors: homestay.numberOfFloors || undefined, // Thêm
    numberOfRooms: homestay.numberOfRooms || 1, // Thêm
    numberOfBedrooms: homestay.numberOfBedrooms || 1,
    numberOfBathrooms: homestay.numberOfBathrooms || 1,
    numberOfBeds: homestay.numberOfBeds || 1,
    availableRooms: homestay.availableRooms || 1, // Thêm
    isFreeCancellation: homestay.isFreeCancellation || false, // Thêm
    freeCancellationDays: homestay.freeCancellationDays || undefined, // Thêm
    isPrepaymentRequired: homestay.isPrepaymentRequired || false, // Thêm
    roomsAtThisPrice: homestay.roomsAtThisPrice || 1, // Thêm
    maximumGuests: homestay.maximumGuests || 2,
    maximumChildren: homestay.maximumChildren || 0, // Thêm
    baseNightlyPrice: homestay.baseNightlyPrice || 0,
    weekendPrice: homestay.weekendPrice || undefined,
    weeklyDiscount: homestay.weeklyDiscount || undefined,
    monthlyDiscount: homestay.monthlyDiscount || undefined,
    minimumNights: homestay.minimumNights || 1,
    maximumNights: homestay.maximumNights || 365,
    checkInTime: homestay.checkInTime || "15:00",
    checkOutTime: homestay.checkOutTime || "11:00",
    isInstantBook: homestay.isInstantBook || false,
    hasParking: homestay.hasParking || false, // Thêm
    isPetFriendly: homestay.isPetFriendly || false, // Thêm
    hasPrivatePool: homestay.hasPrivatePool || false, // Thêm
    searchKeywords: homestay.searchKeywords || "", // Thêm
    propertyTypeId: homestay.propertyTypeId || 0,
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" sx={{ mb: 2, fontWeight: 600 }}>
          Cập nhật Homestay
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {homestay.homestayTitle}
        </Typography>
        <Divider sx={{ mt: 2 }} />
      </Box>

      {updateError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: "4px" }}>
          Lỗi cập nhật homestay. Vui lòng thử lại.
        </Alert>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={updateHomestayValidationSchema}
        onSubmit={handleSubmit}
        validateOnChange={false}
        validateOnBlur={true}
        validate={(values) => {
          const errors: Partial<UpdateHomestay> = {};

          // Tự động tạo slug từ homestayTitle
          if (values.homestayTitle) {
            values.slug = generateSlug(values.homestayTitle);
          } else {
            values.slug = "";
          }

          // Bạn có thể thêm các validation khác ở đây nếu cần
          return errors;
        }}
      >
        {({ isSubmitting, isValid, setFieldValue, values }) => (
          <Form>
            <Paper sx={{ mb: 3 }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  px: 3,
                }}
              >
                <Tab label="Thông tin cơ bản" />
                <Tab label="Địa chỉ & Vị trí" />
                <Tab label="Phòng & Giá cả" />
              </Tabs>

              {/* Tab 1: Thông tin cơ bản */}
              <TabPanel value={activeTab} index={0}>
                <Box sx={{ px: 3 }}>
                  <Typography variant="h6" mb={3}>
                    Thông tin cơ bản
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid
                      size={{
                        xs: 12,
                      }}
                    >
                      <FormTextField
                        name="homestayTitle"
                        label="Tiêu đề homestay"
                        placeholder="Nhập tiêu đề homestay..."
                      />
                    </Grid>
                    <Grid
                      size={{
                        xs: 12,
                      }}
                    >
                      <FormTextField
                        name="homestayDescription"
                        label="Mô tả"
                        placeholder="Nhập mô tả chi tiết..."
                        multiline
                        rows={4}
                      />
                    </Grid>
                    <Grid
                      size={{
                        xs: 12,
                        sm: 6,
                      }}
                    >
                      <FormSelectField
                        name="propertyTypeId"
                        label="Loại bất động sản"
                        options={propertyTypes.map((pt: any) => ({
                          value: pt.id,
                          label: pt.typeName,
                        }))}
                        placeholder="Chọn loại bất động sản"
                      />
                    </Grid>
                    <Grid
                      size={{
                        xs: 12,
                        md: 6,
                      }}
                    >
                      <Box sx={{ pt: 3 }}>
                        <FormCheckbox
                          name="isInstantBook"
                          label="Bật Instant Book"
                          description="Cho phép khách đặt phòng ngay mà không cần duyệt"
                        />
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormTextField
                        name="slug"
                        label="Slug"
                        placeholder="Nhập slug (URL thân thiện)..."
                        disabled
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormTextField
                        name="searchKeywords"
                        label="Từ khóa tìm kiếm"
                        placeholder="Nhập từ khóa, cách nhau bởi dấu phẩy..."
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormCheckbox
                        name="isFreeCancellation"
                        label="Cho phép hủy miễn phí"
                        description="Cho phép khách hủy đặt phòng miễn phí trong thời gian quy định"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormTextField
                        name="freeCancellationDays"
                        label="Số ngày hủy miễn phí"
                        type="number"
                        placeholder="Nhập số ngày..."
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormCheckbox
                        name="isPrepaymentRequired"
                        label="Yêu cầu thanh toán trước"
                        description="Yêu cầu khách thanh toán trước khi đặt phòng"
                      />
                    </Grid>
                  </Grid>
                </Box>
              </TabPanel>

              {/* Tab 2: Địa chỉ & Vị trí */}
              <TabPanel value={activeTab} index={1}>
                <Box sx={{ px: 3 }}>
                  <Typography variant="h6" mb={3}>
                    Địa chỉ & Vị trí
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={12}>
                      <LeafletMapPicker
                        latitude={values.latitude || undefined}
                        longitude={values.longitude || undefined}
                        onLocationSelect={(lat, lng, address, locationData) => {
                          setFieldValue("latitude", lat);
                          setFieldValue("longitude", lng);

                          // Auto-fill địa chỉ
                          if (locationData) {
                            if (locationData.fullAddress) {
                              setFieldValue(
                                "fullAddress",
                                locationData.fullAddress
                              );
                            }
                            if (locationData.city) {
                              setFieldValue("city", locationData.city);
                            }
                            if (locationData.province) {
                              setFieldValue("province", locationData.province);
                            }
                            if (locationData.country) {
                              setFieldValue("country", locationData.country);
                            }
                            if (locationData.postalCode) {
                              setFieldValue(
                                "postalCode",
                                locationData.postalCode
                              );
                            }
                          }
                        }}
                      />
                    </Grid>
                    <Grid
                      size={{
                        xs: 12,
                      }}
                    >
                      <FormTextField
                        name="fullAddress"
                        label="Địa chỉ đầy đủ"
                        placeholder="Nhập địa chỉ..."
                      />
                    </Grid>
                    <Grid
                      size={{
                        xs: 12,
                        md: 6,
                      }}
                    >
                      <FormTextField
                        name="city"
                        label="Thành phố"
                        placeholder="Nhập thành phố..."
                      />
                    </Grid>
                    <Grid
                      size={{
                        xs: 12,
                        md: 6,
                      }}
                    >
                      <FormTextField
                        name="province"
                        label="Tỉnh/Thành phố"
                        placeholder="Nhập tỉnh..."
                      />
                    </Grid>
                    <Grid
                      size={{
                        xs: 12,
                        md: 6,
                      }}
                    >
                      <FormTextField
                        name="country"
                        label="Quốc gia"
                        placeholder="Nhập quốc gia..."
                      />
                    </Grid>
                    <Grid
                      size={{
                        xs: 12,
                        md: 6,
                      }}
                    >
                      <FormTextField
                        name="postalCode"
                        label="Mã bưu điện"
                        placeholder="Nhập mã bưu điện..."
                      />
                    </Grid>
                    <Grid
                      size={{
                        xs: 12,
                        md: 6,
                      }}
                    >
                      <FormTextField
                        name="latitude"
                        label="Vĩ độ"
                        type="number"
                        placeholder="Nhập vĩ độ..."
                      />
                    </Grid>
                    <Grid
                      size={{
                        xs: 12,
                        md: 6,
                      }}
                    >
                      <FormTextField
                        name="longitude"
                        label="Kinh độ"
                        type="number"
                        placeholder="Nhập kinh độ..."
                      />
                    </Grid>
                  </Grid>
                </Box>
              </TabPanel>

              {/* Tab 3: Phòng & Giá cả */}
              <TabPanel value={activeTab} index={2}>
                <Box sx={{ px: 3 }}>
                  <Typography variant="h6" mb={3}>
                    Số phòng
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid
                      size={{
                        xs: 12,
                        md: 6,
                      }}
                    >
                      <FormTextField
                        name="maximumGuests"
                        label="Số lượng khách tối đa"
                        type="number"
                        placeholder="Nhập số khách..."
                      />
                    </Grid>
                    <Grid
                      size={{
                        xs: 12,
                        md: 6,
                      }}
                    >
                      <FormTextField
                        name="numberOfBedrooms"
                        label="Số phòng ngủ"
                        type="number"
                        placeholder="Nhập số phòng ngủ..."
                      />
                    </Grid>
                    <Grid
                      size={{
                        xs: 12,
                        md: 6,
                      }}
                    >
                      <FormTextField
                        name="numberOfBathrooms"
                        label="Số phòng tắm"
                        type="number"
                        placeholder="Nhập số phòng tắm..."
                      />
                    </Grid>
                    <Grid
                      size={{
                        xs: 12,
                        md: 6,
                      }}
                    >
                      <FormTextField
                        name="numberOfBeds"
                        label="Số giường"
                        type="number"
                        placeholder="Nhập số giường..."
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormTextField
                        name="areaInSquareMeters"
                        label="Diện tích (m²)"
                        type="number"
                        placeholder="Nhập diện tích..."
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormTextField
                        name="numberOfFloors"
                        label="Số tầng"
                        type="number"
                        placeholder="Nhập số tầng..."
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormTextField
                        name="numberOfRooms"
                        label="Tổng số phòng"
                        type="number"
                        placeholder="Nhập tổng số phòng..."
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormTextField
                        name="availableRooms"
                        label="Số phòng khả dụng"
                        type="number"
                        placeholder="Nhập số phòng khả dụng..."
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormTextField
                        name="roomsAtThisPrice"
                        label="Số phòng ở mức giá này"
                        type="number"
                        placeholder="Nhập số phòng..."
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <FormTextField
                        name="maximumChildren"
                        label="Số trẻ em tối đa"
                        type="number"
                        placeholder="Nhập số trẻ em..."
                      />
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 3 }} />

                  <Typography variant="h6" mb={3}>
                    Giá cả
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid
                      size={{
                        xs: 12,
                        md: 6,
                      }}
                    >
                      <FormTextField
                        name="baseNightlyPrice"
                        label="Giá ban đêm (VNĐ)"
                        type="number"
                        placeholder="Nhập giá..."
                      />
                    </Grid>
                    <Grid
                      size={{
                        xs: 12,
                        md: 6,
                      }}
                    >
                      <FormTextField
                        name="weekendPrice"
                        label="Giá cuối tuần (VNĐ)"
                        type="number"
                        placeholder="Giá cuối tuần..."
                      />
                    </Grid>
                    <Grid
                      size={{
                        xs: 12,
                        md: 6,
                      }}
                    >
                      <FormTextField
                        name="weeklyDiscount"
                        label="Giảm giá hàng tuần (%)"
                        type="number"
                        placeholder="Nhập % giảm..."
                      />
                    </Grid>
                    <Grid
                      size={{
                        xs: 12,
                        md: 6,
                      }}
                    >
                      <FormTextField
                        name="monthlyDiscount"
                        label="Giảm giá hàng tháng (%)"
                        type="number"
                        placeholder="Nhập % giảm..."
                      />
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 3 }} />

                  <Typography variant="h6" mb={3}>
                    Quy tắc đặt phòng
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid
                      size={{
                        xs: 12,
                        md: 6,
                      }}
                    >
                      <FormTextField
                        name="minimumNights"
                        label="Số đêm tối thiểu"
                        type="number"
                        placeholder="Nhập số đêm..."
                      />
                    </Grid>
                    <Grid
                      size={{
                        xs: 12,
                        md: 6,
                      }}
                    >
                      <FormTextField
                        name="maximumNights"
                        label="Số đêm tối đa"
                        type="number"
                        placeholder="Nhập số đêm..."
                      />
                    </Grid>
                    <Grid
                      size={{
                        xs: 12,
                        md: 6,
                      }}
                    >
                      <FormTextField
                        name="checkInTime"
                        label="Thời gian check-in (HH:mm)"
                        type="time"
                        placeholder="15:00"
                      />
                    </Grid>
                    <Grid
                      size={{
                        xs: 12,
                        md: 6,
                      }}
                    >
                      <FormTextField
                        name="checkOutTime"
                        label="Thời gian check-out (HH:mm)"
                        type="time"
                        placeholder="11:00"
                      />
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" mb={3}>
                      Tiện ích bổ sung
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <FormCheckbox
                          name="hasParking"
                          label="Có chỗ đỗ xe"
                          description="Homestay có chỗ đỗ xe cho khách"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <FormCheckbox
                          name="isPetFriendly"
                          label="Thân thiện với thú cưng"
                          description="Cho phép mang theo thú cưng"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <FormCheckbox
                          name="hasPrivatePool"
                          label="Có hồ bơi riêng"
                          description="Homestay có hồ bơi riêng cho khách"
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              </TabPanel>

              {/* Action Buttons */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  px: 3,
                  pb: 3,
                  pt: 2,
                  borderTop: "1px solid",
                  borderColor: "divider",
                }}
              >
                <AppButton
                  onClick={() => navigate(`/admin/homestays`)}
                  variant="outlined"
                  disabled={isSubmitting}
                >
                  Hủy
                </AppButton>

                <Box sx={{ display: "flex", gap: 2 }}>
                  <AppButton
                    type="submit"
                    success
                    isLoading={isUpdating || isSubmitting}
                    loadingText="Đang cập nhật..."
                    disabled={!isValid || isUpdating}
                  >
                    Cập nhật Homestay
                  </AppButton>
                </Box>
              </Box>
            </Paper>
          </Form>
        )}
      </Formik>

      {/* Quick Access Cards for Managing Sub-resources */}
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Quản lý chi tiết
      </Typography>

      <Grid container spacing={3}>
        {/* Hình ảnh */}
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Card
            sx={{
              cursor: "pointer",
              transition: "all 0.3s",
              "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
            }}
            onClick={() => navigate(`/admin/homestays/${homestayId}/images`)}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Image
                  size={40}
                  strokeWidth={2}
                  className="text-blue-600 mr-3"
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Hình ảnh
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {homestay.images?.length || 0} hình ảnh
                  </Typography>
                </Box>
                <ArrowRight size={20} className="text-gray-500" />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Quản lý hình ảnh homestay
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Tiện nghi */}
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Card
            sx={{
              cursor: "pointer",
              transition: "all 0.3s",
              "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
            }}
            onClick={() => navigate(`/admin/homestays/${homestayId}/amenities`)}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Home
                  size={40}
                  strokeWidth={2}
                  className="text-green-600 mr-3"
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Tiện nghi
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {homestay.amenities?.length || 0} tiện nghi
                  </Typography>
                </Box>
                <ArrowRight size={20} className="text-gray-500" />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Quản lý tiện nghi homestay
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Quy tắc */}
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Card
            sx={{
              cursor: "pointer",
              transition: "all 0.3s",
              "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
            }}
            onClick={() => navigate(`/admin/homestays/${homestayId}/rules`)}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <ScrollText
                  size={40}
                  strokeWidth={2}
                  className="text-amber-600 mr-3"
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Quy tắc
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {homestay.rules?.length || 0} quy tắc
                  </Typography>
                </Box>
                <ArrowRight size={20} className="text-gray-500" />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Quản lý quy tắc nhà
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Lịch khả dụng */}
        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
          <Card
            sx={{
              cursor: "pointer",
              transition: "all 0.3s",
              "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
            }}
            onClick={() =>
              navigate(`/admin/homestays/${homestayId}/availability-calendar`)
            }
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <CalendarDays
                  size={40}
                  strokeWidth={2}
                  className="text-purple-600 mr-3"
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Lịch khả dụng
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {homestay.availabilityCalendars?.length || 0} ngày
                  </Typography>
                </Box>
                <ArrowRight size={20} className="text-gray-500" />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Quản lý lịch trống / đặt
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <LoadingDialog
        open={showLoadingDialog}
        title="Đang cập nhật Homestay"
        message="Vui lòng đợi một chút, chúng tôi đang lưu thông tin mới của bạn..."
      />
    </Container>
  );
};

export default UpdateHomestay;
