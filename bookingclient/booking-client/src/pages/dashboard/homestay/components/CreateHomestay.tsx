/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Formik, Form, FieldArray } from "formik";
import {
  Box,
  Container,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Grid,
  Divider,
  Alert,
  Card,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { createHomestayValidationSchema } from "@/validators/homestayValidation";
import { useCreateHomestayMutation } from "@/services/endpoints/homestay.api";
import type { CreateHomestay } from "@/types/homestay.types";
import { FormTextField } from "@/components/Input";
import { FormSelectField } from "@/components/select";
import { FormCheckbox } from "@/components/checkbox";
import { FormDateTimeField } from "@/components/datetime";
import { AppButton } from "@/components/button";
import ImageUploadField from "@/components/uploadImage/ImageUploadField";
import { useGetPropertyTypesQuery } from "@/services/endpoints/propertyType.api";
import { useGetAmenitiesQuery } from "@/services/endpoints/amenity.api";
import { useGetActiveRulesQuery } from "@/services/endpoints/rule.api";
import { useAuth } from "@/hooks/useAuth";
import { generateSlug } from "@/utils/formatString";
import LeafletMapPicker from "@/components/googleMap/LeafletMapPicker";
import { useToast } from "@/hooks/useToast";
import LoadingDialog from "./LoadingDialog";

const steps = [
  "Thông tin cơ bản",
  "Địa chỉ & Vị trí",
  "Phòng & Giá cả",
  "Tiện nghi & Quy tắc",
  "Hình ảnh",
  "Lịch khả dụng",
];

const DRAFT_KEY = "homestay_create_draft";
const AUTOSAVE_INTERVAL = 30000; // 30 giây

const CreateHomestay = () => {
  const { user } = useAuth();
  const toast = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [justChanged, setJustChanged] = useState(false);
  const [createHomestay, { isLoading: isCreating, error: createError }] =
    useCreateHomestayMutation();
  const activeStepRef = useRef(activeStep);
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [draftData, setDraftData] = useState<{
    data: CreateHomestay;
    step: number;
  } | null>(null);
  const [shouldRestoreDraft, setShouldRestoreDraft] = useState(false);
  const [showLoadingDialog, setShowLoadingDialog] = useState(false);
  // Update activeStepRef when activeStep changes
  useEffect(() => {
    activeStepRef.current = activeStep;
  }, [activeStep]);

  // Fetch data from API
  const { data: propertyTypesData } = useGetPropertyTypesQuery({
    pageNumber: 1,
    pageSize: 100,
    isActive: true,
  });
  const propertyTypes = propertyTypesData?.data?.items || [];

  const { data: amenitiesData } = useGetAmenitiesQuery({
    pageNumber: 1,
    pageSize: 100,
    isActive: true,
  });
  const amenitiesOptions = amenitiesData?.data?.items || [];

  const { data: rulesData } = useGetActiveRulesQuery();
  const rulesOptions = rulesData?.data || [];

  const initialValues: CreateHomestay = useMemo(
    () => ({
      homestayTitle: "",
      homestayDescription: "",
      slug: "",
      fullAddress: "",
      city: "",
      province: "",
      country: "Việt Nam",
      postalCode: "",
      latitude: 0,
      longitude: 0,
      areaInSquareMeters: undefined,
      numberOfFloors: undefined,
      numberOfRooms: 1,
      numberOfBedrooms: 1,
      numberOfBathrooms: 1,
      numberOfBeds: 1,
      maximumGuests: 2,
      maximumChildren: 0,
      baseNightlyPrice: 0,
      isFreeCancellation: false,
      freeCancellationDays: undefined,
      isPrepaymentRequired: false,
      roomsAtThisPrice: 1,
      availableRooms: 1,
      weekendPrice: undefined,
      weeklyDiscount: undefined,
      monthlyDiscount: undefined,
      minimumNights: 1,
      maximumNights: 365,
      checkInTime: "15:00:00",
      checkOutTime: "11:00:00",
      isInstantBook: false,
      hasParking: false,
      isPetFriendly: false,
      hasPrivatePool: false,
      ownerId: parseInt(user?.id || "0") || 0,
      propertyTypeId: 0,
      searchKeywords: "",
      images: [],
      amenities: [],
      rules: [],
      availabilityCalendars: [],
    }),
    [user?.id]
  );

  const valuesRef = useRef<CreateHomestay>(initialValues);

  // Check for existing draft on mount
  useEffect(() => {
    const checkDraft = () => {
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          if (draft.data && draft.timestamp) {
            const draftTime = new Date(draft.timestamp);
            const now = new Date();
            const hoursDiff =
              (now.getTime() - draftTime.getTime()) / (1000 * 60 * 60);

            if (hoursDiff < 24) {
              setDraftData({ data: draft.data, step: draft.step || 0 });
              setLastSavedTime(draftTime);
              setTimeout(() => setShowRestoreDialog(true), 100);
            } else {
              localStorage.removeItem(DRAFT_KEY);
            }
          }
        } catch (error) {
          console.error("Error loading draft:", error);
          localStorage.removeItem(DRAFT_KEY);
        }
      }
    };

    checkDraft();
  }, []);

  // Save draft
  const saveDraft = useCallback((values: CreateHomestay) => {
    try {
      const draftData = {
        ...values,
        images: values.images.map((img) => ({
          ...img,
          imageFile: null,
        })),
      };

      const draft = {
        data: draftData,
        timestamp: new Date().toISOString(),
        step: activeStepRef.current,
      };

      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      setLastSavedTime((prev) => {
        const now = new Date();
        if (!prev || now.getTime() - prev.getTime() > 1000) {
          return now;
        }
        return prev;
      });
      setShowSaveNotification(true);
    } catch (error) {
      console.error("Error saving draft:", error);
    }
  }, []);

  // Auto-save effect
  useEffect(() => {
    const intervalId = setInterval(() => {
      saveDraft(valuesRef.current);
    }, AUTOSAVE_INTERVAL);

    return () => clearInterval(intervalId);
  }, [saveDraft]);

  // Clear draft
  const clearDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_KEY);
    setDraftData(null);
    setLastSavedTime(null);
    setShowRestoreDialog(false);
  }, []);

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
      setJustChanged(true); // Disable tạm submit
      setTimeout(() => setJustChanged(false), 300); // Enable sau 300ms
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (values: CreateHomestay) => {
    setShowLoadingDialog(true);

    try {
      const response = await createHomestay(values).unwrap();

      if (response.success && response.data?.id) {
        clearDraft();

        // Xác định role từ URL hiện tại
        const isAdmin = location.pathname.startsWith("/admin");
        const isHost = location.pathname.startsWith("/host");

        const homestayId = response.data.id;

        if (isAdmin) {
          navigate(`/admin/homestays/${homestayId}`);
        } else if (isHost) {
          navigate(`/host/homestays/${homestayId}`);
        } else {
          navigate(`/admin/homestays/${homestayId}`);
        }

        setTimeout(() => {
          setShowLoadingDialog(false);
        }, 800);
      }
    } catch (error: any) {
      console.error("Lỗi tạo homestay:", error);
      setShowLoadingDialog(false);

      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Tạo homestay thất bại. Vui lòng thử lại.";

      toast.error(errorMessage);
    }
  };

  const formInitialValues = useMemo(() => {
    if (shouldRestoreDraft && draftData) {
      return {
        ...initialValues,
        ...draftData.data,
        images: [],
      };
    }
    return initialValues;
  }, [shouldRestoreDraft, draftData, initialValues]);

  const renderStepContent = (
    step: number,
    values: CreateHomestay,
    setFieldValue: any,
    errors: any,
    touched: any
  ) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" mb={3}>
              Thông tin cơ bản
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <FormTextField
                  name="homestayTitle"
                  label="Tiêu đề homestay"
                  required
                  placeholder="Nhập tiêu đề homestay..."
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormTextField
                  name="homestayDescription"
                  label="Mô tả"
                  placeholder="Nhập mô tả chi tiết..."
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormTextField
                  name="slug"
                  label="Slug (URL thân thiện)"
                  placeholder="Tự động tạo từ tiêu đề..."
                  disabled
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormTextField
                  name="searchKeywords"
                  label="Từ khóa tìm kiếm"
                  placeholder="Nhập từ khóa, cách nhau bằng dấu phẩy..."
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormSelectField
                  name="propertyTypeId"
                  label="Loại bất động sản"
                  required
                  options={propertyTypes.map((pt: any) => ({
                    value: pt.id,
                    label: pt.typeName,
                  }))}
                  placeholder="Chọn loại bất động sản"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormCheckbox
                  name="isInstantBook"
                  label="Bật Instant Book"
                  description="Cho phép khách đặt phòng ngay mà không cần duyệt"
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" mb={3}>
              Địa chỉ & Vị trí
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <LeafletMapPicker
                  latitude={values.latitude || undefined}
                  longitude={values.longitude || undefined}
                  onLocationSelect={(lat, lng, address, locationData) => {
                    setFieldValue("latitude", lat);
                    setFieldValue("longitude", lng);

                    // Auto-fill địa chỉ từ locationData
                    if (locationData) {
                      if (locationData.fullAddress) {
                        setFieldValue("fullAddress", locationData.fullAddress);
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
                        setFieldValue("postalCode", locationData.postalCode);
                      }
                    }
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormTextField
                  name="fullAddress"
                  label="Địa chỉ đầy đủ"
                  required
                  placeholder="Nhập địa chỉ..."
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormTextField
                  name="city"
                  label="Thành phố"
                  required
                  placeholder="Nhập thành phố..."
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormTextField
                  name="province"
                  label="Tỉnh/Thành phố"
                  required
                  placeholder="Nhập tỉnh..."
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormTextField
                  name="country"
                  label="Quốc gia"
                  required
                  placeholder="Nhập quốc gia..."
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormTextField
                  name="postalCode"
                  label="Mã bưu điện"
                  placeholder="Nhập mã bưu điện..."
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormTextField
                  name="latitude"
                  label="Vĩ độ"
                  required
                  type="number"
                  placeholder="Nhập vĩ độ..."
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormTextField
                  name="longitude"
                  label="Kinh độ"
                  required
                  type="number"
                  placeholder="Nhập kinh độ..."
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" mb={3}>
              Số phòng & Giá cả
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormTextField
                  name="areaInSquareMeters"
                  label="Diện tích (m²)"
                  type="number"
                  placeholder="Nhập diện tích..."
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormTextField
                  name="numberOfFloors"
                  label="Số tầng"
                  type="number"
                  placeholder="Nhập số tầng..."
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormTextField
                  name="numberOfRooms"
                  label="Tổng số phòng"
                  required
                  type="number"
                  placeholder="Nhập tổng số phòng..."
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormTextField
                  name="numberOfBedrooms"
                  label="Số phòng ngủ"
                  required
                  type="number"
                  placeholder="Nhập số phòng ngủ..."
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormTextField
                  name="numberOfBathrooms"
                  label="Số phòng tắm"
                  required
                  type="number"
                  placeholder="Nhập số phòng tắm..."
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormTextField
                  name="numberOfBeds"
                  label="Số giường"
                  required
                  type="number"
                  placeholder="Nhập số giường..."
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormTextField
                  name="maximumGuests"
                  label="Số lượng khách tối đa"
                  required
                  type="number"
                  placeholder="Nhập số khách..."
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormTextField
                  name="maximumChildren"
                  label="Số lượng trẻ em tối đa"
                  required
                  type="number"
                  placeholder="Nhập số trẻ em..."
                />
              </Grid>
              <Grid size={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormTextField
                  name="baseNightlyPrice"
                  label="Giá 1 đêm (VNĐ)"
                  required
                  type="number"
                  placeholder="Nhập giá..."
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormTextField
                  name="weekendPrice"
                  label="Giá cuối tuần (VNĐ)"
                  type="number"
                  placeholder="Giá cuối tuần..."
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormTextField
                  name="weeklyDiscount"
                  label="Giảm giá hàng tuần (%)"
                  type="number"
                  placeholder="Nhập % giảm..."
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormTextField
                  name="monthlyDiscount"
                  label="Giảm giá hàng tháng (%)"
                  type="number"
                  placeholder="Nhập % giảm..."
                />
              </Grid>
              <Grid size={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormTextField
                  name="minimumNights"
                  label="Số đêm tối thiểu"
                  required
                  type="number"
                  placeholder="Nhập số đêm..."
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormTextField
                  name="maximumNights"
                  label="Số đêm tối đa"
                  required
                  type="number"
                  placeholder="Nhập số đêm..."
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormTextField
                  name="checkInTime"
                  label="Thời gian check-in (HH:mm)"
                  required
                  type="time"
                  placeholder="15:00"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormTextField
                  name="checkOutTime"
                  label="Thời gian check-out (HH:mm)"
                  required
                  type="time"
                  placeholder="11:00"
                />
              </Grid>
              <Grid size={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormCheckbox
                  name="isFreeCancellation"
                  label="Cho phép hủy miễn phí"
                  description="Khách có thể hủy miễn phí trong thời gian quy định"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormTextField
                  name="freeCancellationDays"
                  label="Số ngày hủy miễn phí"
                  type="number"
                  placeholder="Nhập số ngày..."
                  disabled={!values.isFreeCancellation}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormCheckbox
                  name="isPrepaymentRequired"
                  label="Yêu cầu trả trước"
                  description="Khách cần thanh toán trước khi đặt"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormTextField
                  name="roomsAtThisPrice"
                  label="Số phòng áp dụng giá này"
                  required
                  type="number"
                  placeholder="Nhập số phòng..."
                />
              </Grid>
              <Grid size={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormCheckbox
                  name="hasParking"
                  label="Có bãi đỗ xe"
                  description="Homestay có chỗ đỗ xe cho khách"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormCheckbox
                  name="isPetFriendly"
                  label="Thân thiện với thú cưng"
                  description="Cho phép mang theo thú cưng"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormCheckbox
                  name="hasPrivatePool"
                  label="Có hồ bơi riêng"
                  description="Homestay có hồ bơi riêng cho khách"
                />
              </Grid>

              <Grid size={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" mb={2} fontWeight={600}>
                  Chọn vị trí trên bản đồ
                </Typography>
                <LeafletMapPicker
                  latitude={values.latitude || undefined}
                  longitude={values.longitude || undefined}
                  onLocationSelect={(lat, lng, address) => {
                    setFieldValue("latitude", lat);
                    setFieldValue("longitude", lng);
                    if (!values.fullAddress) {
                      setFieldValue("fullAddress", address);
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" mb={3}>
              Tiện nghi
            </Typography>
            <FieldArray name="amenities">
              {(arrayHelpers) => (
                <Box>
                  {values.amenities?.map((amenity, index) => (
                    <Card key={index} sx={{ mb: 2, p: 2 }}>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 10 }}>
                          <FormSelectField
                            name={`amenities.${index}.amenityId`}
                            label="Tiện nghi"
                            required
                            options={amenitiesOptions.map((a: any) => ({
                              value: a.id,
                              label: a.amenityName,
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
                        <Grid size={12}>
                          <FormTextField
                            name={`amenities.${index}.customNote`}
                            label="Ghi chú"
                            placeholder="Nhập ghi chú..."
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
                        amenityId: "",
                        customNote: "",
                      })
                    }
                    variant="outlined"
                  >
                    + Thêm tiện nghi
                  </AppButton>
                </Box>
              )}
            </FieldArray>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" mb={3}>
              Quy tắc
            </Typography>
            <FieldArray name="rules">
              {(arrayHelpers) => (
                <Box>
                  {values.rules?.map((rule, index) => (
                    <Card key={index} sx={{ mb: 2, p: 2 }}>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 10 }}>
                          <FormSelectField
                            name={`rules.${index}.ruleId`}
                            label="Quy tắc"
                            required
                            options={rulesOptions.map((r: any) => ({
                              value: r.id,
                              label: r.ruleName,
                            }))}
                            placeholder="Chọn quy tắc..."
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
                        <Grid size={12}>
                          <FormTextField
                            name={`rules.${index}.customNote`}
                            label="Ghi chú"
                            placeholder="Nhập ghi chú..."
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
                        ruleId: "",
                        customNote: "",
                      })
                    }
                    variant="outlined"
                  >
                    + Thêm quy tắc
                  </AppButton>
                </Box>
              )}
            </FieldArray>
          </Box>
        );

      case 4:
        return (
          <Box>
            <Typography variant="h6" mb={3}>
              Hình ảnh
            </Typography>
            <FieldArray name="images">
              {(arrayHelpers) => (
                <Box>
                  {values.images?.map((image, index) => (
                    <Card key={index} sx={{ mb: 3, p: 2 }}>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 5 }}>
                          <Typography variant="subtitle2" mb={1}>
                            Ảnh #{index + 1}
                          </Typography>
                          <ImageUploadField
                            value={image.imageFile}
                            onChange={(file: any) => {
                              if (file) {
                                setFieldValue(
                                  `images.${index}.imageFile`,
                                  file
                                );
                              }
                            }}
                            error={
                              touched.images?.[index]?.imageFile &&
                              errors.images?.[index]?.imageFile
                                ? errors.images?.[index]?.imageFile
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
                            <Grid size={12}>
                              <FormTextField
                                name={`images.${index}.imageTitle`}
                                label="Tiêu đề hình ảnh"
                                placeholder="Nhập tiêu đề..."
                              />
                            </Grid>
                            <Grid size={12}>
                              <FormTextField
                                name={`images.${index}.imageDescription`}
                                label="Mô tả hình ảnh"
                                placeholder="Nhập mô tả..."
                                multiline
                                rows={3}
                              />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <FormTextField
                                name={`images.${index}.displayOrder`}
                                label="Thứ tự hiển thị"
                                type="number"
                                placeholder="0"
                              />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <FormSelectField
                                name={`images.${index}.roomType`}
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
                                  {
                                    value: "reception",
                                    label: "Lễ tân / khu tiếp đón",
                                  },
                                  { value: "laundry", label: "Khu giặt ủi" },
                                  { value: "gym", label: "Phòng tập gym" },
                                  { value: "spa", label: "Khu spa / thư giãn" },
                                  {
                                    value: "game",
                                    label: "Phòng trò chơi / giải trí",
                                  },
                                  { value: "workspace", label: "Khu làm việc" },
                                  {
                                    value: "kids",
                                    label: "Khu vui chơi trẻ em",
                                  },
                                  { value: "rooftop", label: "Tầng mái" },
                                  { value: "other", label: "Khác" },
                                ]}
                                placeholder="Chọn loại phòng..."
                              />
                            </Grid>
                            <Grid size={12}>
                              <FormCheckbox
                                name={`images.${index}.isPrimaryImage`}
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
                        displayOrder: values.images.length,
                        isPrimaryImage: values.images.length === 0,
                        roomType: "",
                      })
                    }
                    variant="outlined"
                    fullWidth
                  >
                    + Thêm hình ảnh
                  </AppButton>
                  {values.images.length === 0 && (
                    <Alert severity="info" sx={{ mt: 2, borderRadius: "4px" }}>
                      Vui lòng thêm ít nhất 1 hình ảnh cho homestay
                    </Alert>
                  )}
                </Box>
              )}
            </FieldArray>
          </Box>
        );

      case 5:
        return (
          <Box>
            <Typography variant="h6" mb={3}>
              Lịch khả dụng (Tùy chọn)
            </Typography>
            <Alert severity="info" sx={{ mb: 3, borderRadius: "4px" }}>
              Bạn có thể thêm lịch khả dụng hoặc bỏ qua bước này và cập nhật sau
            </Alert>
            <FieldArray name="availabilityCalendars">
              {(arrayHelpers) => (
                <Box>
                  {values.availabilityCalendars?.map((calendar, index) => (
                    <Card key={index} sx={{ mb: 2, p: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 2,
                        }}
                      >
                        <Typography variant="subtitle2">
                          Lịch #{index + 1}
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
                            name={`availabilityCalendars.${index}.availableDate`}
                            label="Ngày có sẵn"
                            required
                            type="date"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <FormTextField
                            name={`availabilityCalendars.${index}.customPrice`}
                            label="Giá tùy chỉnh (VNĐ)"
                            type="number"
                            placeholder="Để trống nếu dùng giá mặc định"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <FormTextField
                            name={`availabilityCalendars.${index}.minimumNights`}
                            label="Số đêm tối thiểu"
                            type="number"
                            placeholder="Để trống nếu dùng mặc định"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Box sx={{ pt: 3 }}>
                            <FormCheckbox
                              name={`availabilityCalendars.${index}.isAvailable`}
                              label="Có sẵn"
                            />
                          </Box>
                        </Grid>
                        <Grid size={12}>
                          <FormCheckbox
                            name={`availabilityCalendars.${index}.isBlocked`}
                            label="Chặn ngày này"
                            description="Ngày này sẽ không thể đặt"
                          />
                        </Grid>
                        {values.availabilityCalendars[index]?.isBlocked && (
                          <Grid size={12}>
                            <FormTextField
                              name={`availabilityCalendars.${index}.blockReason`}
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
                        values.availabilityCalendars?.[
                          values.availabilityCalendars.length - 1
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
                        minimumNights: 1,
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
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" sx={{ mb: 2, fontWeight: 600 }}>
          Tạo Homestay Mới
        </Typography>
        <Divider />
      </Box>
      {createError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: "4px" }}>
          Lỗi tạo homestay. Vui lòng thử lại.
        </Alert>
      )}
      {showSaveNotification && lastSavedTime && (
        <Alert
          severity="success"
          sx={{ mb: 3, borderRadius: "4px" }}
          onClose={() => setShowSaveNotification(false)}
        >
          Đã lưu bản nháp lúc {lastSavedTime.toLocaleTimeString()}
        </Alert>
      )}
      <Dialog
        open={showRestoreDialog}
        onClose={() => setShowRestoreDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Khôi phục bản nháp?</DialogTitle>
        <DialogContent>
          <Typography>
            Có một bản nháp đã lưu từ {lastSavedTime?.toLocaleString()}. Bạn có
            muốn khôi phục nó không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <AppButton
            onClick={() => {
              clearDraft();
              setShouldRestoreDraft(false);
              setShowRestoreDialog(false);
            }}
            variant="outlined"
            danger
          >
            Xóa bản nháp
          </AppButton>
          <AppButton
            onClick={() => {
              setShouldRestoreDraft(false);
              setShowRestoreDialog(false);
            }}
            variant="outlined"
          >
            Bắt đầu mới
          </AppButton>
          <AppButton
            onClick={() => {
              if (draftData) {
                setShouldRestoreDraft(true);
                setActiveStep(draftData.step);
                setShowRestoreDialog(false);
              }
            }}
            success
          >
            Khôi phục
          </AppButton>
        </DialogActions>
      </Dialog>
      <Formik
        initialValues={formInitialValues}
        validationSchema={createHomestayValidationSchema}
        onSubmit={handleSubmit}
        validateOnChange={false} // đổi thành false
        validateOnBlur={true}
      >
        {({
          values,
          isSubmitting,
          isValid,
          setFieldValue,
          errors,
          touched,
        }) => {
          valuesRef.current = values;

          useEffect(() => {
            if (values.homestayTitle) {
              const newSlug = generateSlug(values.homestayTitle);
              setFieldValue("slug", newSlug);
            }
          }, [values.homestayTitle, setFieldValue]);
          return (
            <Form
              onKeyDown={(e) => {
                if (e.key === "Enter" && activeStep < steps.length - 1) {
                  e.preventDefault();
                }
              }}
            >
              <Paper sx={{ p: 3, mb: 3 }}>
                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
                <Box sx={{ minHeight: 400 }}>
                  {renderStepContent(
                    activeStep,
                    values,
                    setFieldValue,
                    errors,
                    touched
                  )}
                </Box>
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
                    onClick={handleBack}
                    disabled={activeStep === 0 || isSubmitting || isCreating}
                    variant="outlined"
                  >
                    Quay lại
                  </AppButton>

                  <Box sx={{ display: "flex", gap: 2 }}>
                    {activeStep < steps.length - 1 ? (
                      <AppButton
                        onClick={(e) => {
                          // QUAN TRỌNG: Thêm event handler
                          e.preventDefault(); // Chặn submit
                          e.stopPropagation(); // Chặn bubble
                          handleNext();
                        }}
                        type="button" // Không phải submit
                        disabled={isSubmitting || isCreating || justChanged} // Chặn double click
                        variant="contained"
                        color="primary"
                        autoFocus // Enter = Tiếp theo
                      >
                        Tiếp theo
                      </AppButton>
                    ) : (
                      <AppButton
                        type="submit"
                        success
                        isLoading={isCreating || isSubmitting}
                        loadingText="Đang tạo..."
                        disabled={
                          !isValid || isCreating || isSubmitting || justChanged
                        } // Disable tạm sau next
                        variant="contained"
                        autoFocus // Enter = Tạo
                      >
                        Tạo Homestay
                      </AppButton>
                    )}
                  </Box>
                </Box>
              </Paper>
              {import.meta.env.DEV && (
                <Paper sx={{ p: 2, mt: 2, backgroundColor: "#f5f5f5" }}>
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 600, mb: 1, display: "block" }}
                  >
                    Debug Info (Chỉ hiện trong dev mode):
                  </Typography>
                  <Typography variant="caption" color="error" component="pre">
                    {JSON.stringify(errors, null, 2)}
                  </Typography>
                </Paper>
              )}
            </Form>
          );
        }}
      </Formik>

      <LoadingDialog
        open={showLoadingDialog}
        title="Đang tạo Homestay"
        message="Chúng tôi đang xử lý thông tin và hình ảnh của bạn..."
      />
    </Container>
  );
};

export default CreateHomestay;
