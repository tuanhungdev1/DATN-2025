/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/homestay/HomestayDetail.tsx
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  Grid,
  Alert,
  Chip,
  Divider,
  Card,
  Typography,
  Avatar,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useGetHomestayBySlugQuery } from "@/services/endpoints/homestay.api";
import { AppButton } from "@/components/button";
import {
  MapPin,
  User,
  Mail,
  Phone,
  Home,
  Bath,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Star,
  Eye,
  Maximize,
  Building,
  BedDouble,
  Car,
  PawPrint,
  Waves,
  Clock,
  Heart,
  Share2,
  DoorOpen,
  Building2,
  DollarSign,
  Check,
  X,
  AlertCircle,
  AlertTriangle,
  Moon,
  Lock,
} from "lucide-react";

import type {
  AmenitySimple,
  AvailabilityCalendar,
  Homestay,
  RuleSimple,
} from "@/types/homestay.types";
import { useMemo, useState } from "react";
import { useWishlist } from "@/hooks/useWishlist";
import ImageSlider from "./components/ImageSlider";
import type { BreadcrumbItem } from "@/components/breadcrumb/AppBreadcrumbs";
import AppBreadcrumbs from "@/components/breadcrumb/AppBreadcrumbs";
import { ROUTES } from "@/constants/routes/routeConstants";
import { useAuth } from "@/hooks/useAuth";
import { useGetMyBookingsQuery } from "@/services/endpoints/booking.api";
import { BookingStatus } from "@/enums/bookingStatus";
import HomestayReviews from "@/components/reviews/HomestayReviews";
import { Tooltip as MuiTooltip } from "@mui/material";
import { DateRangePicker } from "react-date-range";
import { vi } from "date-fns/locale";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { format } from "date-fns";
import LocationInfo from "@/components/common/LocationInfo";
import HomestayDetailSkeleton from "./HomestayDetailSkeleton";
import HomestayLocationMapDialog from "@/components/googleMap/HomestayLocationMapDialog";

const HomestayDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const { data, isLoading, error } = useGetHomestayBySlugQuery(slug!, {
    skip: !slug,
  });

  const homestay = data?.data;
  const {
    isInWishlist,
    toggleWishlist,
    isLoading: isWishlistLoading,
  } = useWishlist(homestay?.id);

  // Lấy danh sách booking của user hiện tại
  const { data: myBookingsData } = useGetMyBookingsQuery(
    {
      homestayId: homestay?.id,
      pageNumber: 1,
      pageSize: 100,
    },
    {
      skip: !isAuthenticated || !homestay?.id,
    }
  );

  const canReview = useMemo(() => {
    if (!isAuthenticated || !user || !myBookingsData?.data?.items) {
      return false;
    }

    // Kiểm tra có booking nào ở trạng thái Completed (5)
    return myBookingsData.data.items.some(
      (booking) =>
        booking.bookingStatus === BookingStatus.CheckedOut ||
        booking.bookingStatus === BookingStatus.Completed // BookingStatus.Completed
    );
  }, [isAuthenticated, user, myBookingsData]);

  const isHost = useMemo(() => {
    if (!isAuthenticated || !user || !homestay) {
      return false;
    }
    return parseInt(user.id) === homestay.ownerId;
  }, [isAuthenticated, user, homestay]);

  const completedBookingId = useMemo(() => {
    if (!myBookingsData?.data?.items) return undefined;

    const completedBooking = myBookingsData.data.items.find(
      (booking) =>
        booking.bookingStatus === BookingStatus.CheckedOut ||
        booking.bookingStatus === BookingStatus.Completed
    );

    return completedBooking?.id;
  }, [myBookingsData]);

  const handleBooking = () => {
    if (homestay) {
      navigate(`/booking/${homestay.slug || homestay.id}/book`);
    }
  };

  const handleShare = async () => {
    if (navigator.share && homestay) {
      try {
        await navigator.share({
          title: homestay.homestayTitle,
          text: homestay.homestayDescription,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Đã copy link vào clipboard!");
    }
  };

  const handleToggleWishlist = () => {
    if (homestay) {
      toggleWishlist(homestay.id);
    }
  };

  if (isLoading) {
    return <HomestayDetailSkeleton />;
  }

  if (error || !homestay) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Không tìm thấy homestay</Alert>
      </Container>
    );
  }

  // Check if homestay is not active or not approved
  if (!homestay.isActive || !homestay.isApproved) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">
          Homestay này hiện không khả dụng hoặc chưa được duyệt
        </Alert>
      </Container>
    );
  }

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Trang chủ", path: ROUTES.HOME, icon: <Home size={14} /> },
    {
      label: "Danh sách Homestay",
      path: "/homestay-list",
      icon: <Building2 size={14} />,
    },
    { label: homestay.homestayTitle },
  ];

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Back Button */}
        <AppBreadcrumbs items={breadcrumbItems} />

        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 2,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                {homestay.homestayTitle}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                  <Star size={16} fill="#ffa500" color="#ffa500" />
                  <Typography variant="body2" fontWeight={600}>
                    {homestay.ratingAverage.toFixed(1)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ({homestay.totalReviews} đánh giá)
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  •
                </Typography>
                <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                  <Eye size={16} />
                  <Typography variant="body2" color="text.secondary">
                    {homestay.viewCount.toLocaleString()} lượt xem
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{ display: "flex", gap: 1, alignItems: "center", mt: 1 }}
              >
                <MapPin size={16} />
                <Typography variant="body2" color="text.secondary">
                  {homestay.city}, {homestay.province}, {homestay.country}
                </Typography>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 1 }}>
              <Tooltip
                title={isInWishlist ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
              >
                <IconButton
                  onClick={handleToggleWishlist}
                  disabled={isWishlistLoading}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <Heart
                    size={20}
                    fill={isInWishlist ? "#f44336" : "none"}
                    color={isInWishlist ? "#f44336" : "currentColor"}
                  />
                </IconButton>
              </Tooltip>
              <Tooltip title="Chia sẻ">
                <IconButton
                  onClick={handleShare}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <Share2 size={20} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Badges */}
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {homestay.isFeatured && (
              <Chip
                label="Nổi bật"
                color="primary"
                size="small"
                icon={<Star size={14} />}
              />
            )}
            {homestay.isInstantBook && (
              <Chip label="Đặt ngay" color="success" size="small" />
            )}
            <Chip
              label={homestay.propertyTypeName}
              variant="outlined"
              size="small"
              icon={<Home size={14} />}
            />

            {homestay.isFreeCancellation && (
              <Chip
                label="Hủy miễn phí"
                color="success"
                size="small"
                icon={<CheckCircle size={14} />}
              />
            )}
            {homestay.isPrepaymentRequired && (
              <Chip
                label="Trả trước"
                color="warning"
                size="small"
                icon={<DollarSign size={14} />}
              />
            )}
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Left Column - Main Content */}
          <Grid size={{ xs: 12, md: 8 }}>
            <ImageSlider images={homestay.images} />
            <HomestayInfo homestay={homestay} />
            <Description homestay={homestay} />
            <PropertyFeatures homestay={homestay} />
            <Amenities amenities={homestay.amenities} />
            <Rules rules={homestay.rules} />
            <AvailabilitySection
              availabilityCalendars={homestay.availabilityCalendars}
            />
            <HostInfo homestay={homestay} />
            {/* <LocationInfoWithMap homestay={homestay} /> */}
            <LocationInfo homestay={homestay} />

            <HomestayReviews
              homestayId={homestay.id}
              currentUserId={user?.id ? parseInt(user.id) : undefined}
              isHost={isHost}
              canReview={canReview}
              bookingId={completedBookingId}
              hostAvatar={homestay.ownerAvatar}
            />
          </Grid>

          {/* Right Column - Sticky Booking Card */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                position: { md: "sticky" },
                top: { md: 20 },
                zIndex: 1,
              }}
            >
              <BookingCard homestay={homestay} onBook={handleBooking} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HomestayDetail;

// Component HomestayInfo
const HomestayInfo = ({ homestay }: { homestay: Homestay }) => (
  <Paper sx={{ p: 3, mb: 3, borderRadius: "4px" }}>
    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
      Thông tin chỗ ở
    </Typography>

    {/* Hàng chính với các thông tin cơ bản */}
    <Grid container spacing={2}>
      {/* Nhóm khách và trẻ em */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1 }}>
          <Users size={20} color="#666" />
          <Typography variant="body2" fontWeight={500}>
            {homestay.maximumGuests} khách, {homestay.maximumChildren} trẻ em
          </Typography>
        </Box>
      </Grid>

      {/* Nhóm phòng ngủ và giường */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1 }}>
          <BedDouble size={20} color="#666" />
          <Typography variant="body2" fontWeight={500}>
            {homestay.numberOfBedrooms} phòng ngủ, {homestay.numberOfBeds}{" "}
            giường
          </Typography>
        </Box>
      </Grid>

      {/* Phòng tắm */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1 }}>
          <Bath size={20} color="#666" />
          <Typography variant="body2" fontWeight={500}>
            {homestay.numberOfBathrooms} phòng tắm
          </Typography>
        </Box>
      </Grid>

      {/* Tổng số phòng và phòng trống */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1 }}>
          <DoorOpen size={20} color="#666" />
          <Typography variant="body2" fontWeight={500}>
            {homestay.numberOfRooms} phòng ({homestay.availableRooms} trống)
          </Typography>
        </Box>
      </Grid>

      {/* Diện tích */}
      {homestay.areaInSquareMeters && (
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1 }}>
            <Maximize size={20} color="#666" />
            <Typography variant="body2" fontWeight={500}>
              {homestay.areaInSquareMeters} m²
            </Typography>
          </Box>
        </Grid>
      )}

      {/* Số tầng */}
      {homestay.numberOfFloors && (
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1 }}>
            <Building size={20} color="#666" />
            <Typography variant="body2" fontWeight={500}>
              {homestay.numberOfFloors} tầng
            </Typography>
          </Box>
        </Grid>
      )}

      {/* Phòng áp dụng giá */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1 }}>
          <DollarSign size={20} color="#666" />
          <Typography variant="body2" fontWeight={500}>
            {homestay.roomsAtThisPrice} phòng áp dụng giá
          </Typography>
        </Box>
      </Grid>
    </Grid>
  </Paper>
);

// Component Description
const Description = ({ homestay }: { homestay: Homestay }) =>
  homestay.homestayDescription && (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Mô tả
      </Typography>
      <Typography
        variant="body1"
        sx={{
          whiteSpace: "pre-wrap",
          lineHeight: 1.8,
          color: "text.secondary",
        }}
      >
        {homestay.homestayDescription}
      </Typography>
    </Paper>
  );

// Component PropertyFeatures
const PropertyFeatures = ({ homestay }: { homestay: Homestay }) => (
  <Paper sx={{ p: 3, mb: 3 }}>
    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
      Đặc điểm nổi bật
    </Typography>
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            p: 2,
            border: "1px solid",
            borderColor: homestay.hasParking ? "success.main" : "divider",
            borderRadius: 2,
            bgcolor: homestay.hasParking ? "success.50" : "grey.50",
          }}
        >
          <Car size={24} color={homestay.hasParking ? "#4caf50" : "#999"} />
          <Box>
            <Typography variant="body2" fontWeight={600}>
              Bãi đỗ xe
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {homestay.hasParking ? "Có sẵn" : "Không có"}
            </Typography>
          </Box>
        </Box>
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            p: 2,
            border: "1px solid",
            borderColor: homestay.isPetFriendly ? "success.main" : "divider",
            borderRadius: 2,
            bgcolor: homestay.isPetFriendly ? "success.50" : "grey.50",
          }}
        >
          <PawPrint
            size={24}
            color={homestay.isPetFriendly ? "#4caf50" : "#999"}
          />
          <Box>
            <Typography variant="body2" fontWeight={600}>
              Thú cưng
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {homestay.isPetFriendly ? "Cho phép" : "Không cho phép"}
            </Typography>
          </Box>
        </Box>
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            p: 2,
            border: "1px solid",
            borderColor: homestay.hasPrivatePool ? "success.main" : "divider",
            borderRadius: 2,
            bgcolor: homestay.hasPrivatePool ? "success.50" : "grey.50",
          }}
        >
          <Waves
            size={24}
            color={homestay.hasPrivatePool ? "#4caf50" : "#999"}
          />
          <Box>
            <Typography variant="body2" fontWeight={600}>
              Hồ bơi riêng
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {homestay.hasPrivatePool ? "Có sẵn" : "Không có"}
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  </Paper>
);

// Component Amenities
const Amenities = ({ amenities }: { amenities: AmenitySimple[] }) => {
  const [showAll, setShowAll] = useState(false);
  const displayAmenities = showAll ? amenities : amenities.slice(0, 12);

  if (!amenities || amenities.length === 0) return null;

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Tiện nghi ({amenities.length})
      </Typography>
      <Grid container spacing={2}>
        {displayAmenities.map((amenity, index) => (
          <Grid size={{ xs: 12, sm: 6 }} key={index}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 1.5,
                borderRadius: 1,
                "&:hover": {
                  bgcolor: "action.hover",
                },
              }}
            >
              {amenity.iconUrl ? (
                <img
                  src={amenity.iconUrl}
                  alt={amenity.amenityName}
                  style={{ width: 24, height: 24, flexShrink: 0 }}
                />
              ) : (
                <CheckCircle
                  size={24}
                  color="#4caf50"
                  style={{ flexShrink: 0 }}
                />
              )}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" fontWeight={500}>
                  {amenity.amenityName}
                  {amenity.isHighlight && (
                    <Chip
                      label="Nổi bật"
                      size="small"
                      color="primary"
                      sx={{ ml: 1, height: 18, fontSize: "0.65rem" }}
                    />
                  )}
                </Typography>
                {amenity.customNote && (
                  <Typography variant="caption" color="text.secondary">
                    {amenity.customNote}
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {amenities.length > 12 && (
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <AppButton variant="outlined" onClick={() => setShowAll(!showAll)}>
            {showAll ? "Thu gọn" : `Xem tất cả ${amenities.length} tiện nghi`}
          </AppButton>
        </Box>
      )}
    </Paper>
  );
};

// Component Rules
const Rules = ({ rules }: { rules: RuleSimple[] }) => {
  if (!rules || rules.length === 0) return null;

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Nội quy nhà
      </Typography>
      <Stack spacing={2}>
        {rules.map((rule, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 1.5,
              p: 1.5,
              borderRadius: 1,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            {rule.iconUrl ? (
              <img
                src={rule.iconUrl}
                alt={rule.ruleName}
                style={{ width: 24, height: 24, flexShrink: 0, marginTop: 2 }}
              />
            ) : (
              <XCircle
                size={24}
                color="#f44336"
                style={{ flexShrink: 0, marginTop: 2 }}
              />
            )}
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" fontWeight={600}>
                {rule.ruleName}
              </Typography>
              {rule.ruleDescription && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  {rule.ruleDescription}
                </Typography>
              )}
              {rule.customNote && (
                <Typography
                  variant="caption"
                  color="primary.main"
                  sx={{ mt: 0.5, display: "block" }}
                >
                  Ghi chú: {rule.customNote}
                </Typography>
              )}
            </Box>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
};

const LocationInfoWithMap = ({ homestay }: { homestay: Homestay }) => {
  const [showLocationDialog, setShowLocationDialog] = useState(false);

  return (
    <>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Vị trí
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <MapPin size={18} color="#666" />
            <Typography variant="body1" fontWeight={500}>
              {homestay.fullAddress}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {homestay.city}, {homestay.province}, {homestay.country}
          </Typography>
        </Box>

        <AppButton
          variant="outlined"
          startIcon={<MapPin size={16} />}
          onClick={() => setShowLocationDialog(true)}
          fullWidth
        >
          Xem vị trí & địa điểm xung quanh
        </AppButton>
      </Paper>

      <HomestayLocationMapDialog
        open={showLocationDialog}
        onClose={() => setShowLocationDialog(false)}
        homestay={homestay}
      />
    </>
  );
};

// Component AvailabilitySection
const AvailabilitySection = ({
  availabilityCalendars,
}: {
  availabilityCalendars: AvailabilityCalendar[];
}) => {
  const [showAll, setShowAll] = useState(false);
  const [showCalendar, setShowCalendar] = useState(true);

  const dateInfoMap = useMemo(() => {
    const map = new Map<string, AvailabilityCalendar>();
    availabilityCalendars.forEach((cal) => {
      const dateKey = format(new Date(cal.availableDate), "yyyy-MM-dd");
      map.set(dateKey, cal);
    });
    return map;
  }, [availabilityCalendars]);

  const customDayContent = (day: Date) => {
    const dateKey = format(day, "yyyy-MM-dd");
    const dateInfo = dateInfoMap.get(dateKey);

    if (!dateInfo) return <span>{format(day, "d")}</span>;

    // Màu sắc ngày
    let bgColor = "#ffffff";
    let textColor = "#000000";
    let borderColor = "transparent";

    if (dateInfo.isBlocked) {
      bgColor = "#ffebee";
      borderColor = "#f44336";
      textColor = "#c62828";
    } else if (dateInfo.isAvailable) {
      bgColor = "#e8f5e9";
      borderColor = "#4caf50";
      textColor = "#2e7d32";
    } else {
      bgColor = "#f5f5f5";
      textColor = "#757575";
      borderColor = "#e0e0e0";
    }

    // Tooltip content với nền SÁNG + icon lucide
    const tooltipContent = (
      <Box
        sx={{
          p: 1.5,
          minWidth: 180,
          bgcolor: "background.paper", // Nền trắng/sáng (tùy theme)
          color: "text.primary",
          borderRadius: 1,
          boxShadow: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          variant="caption"
          fontWeight={700}
          display="block"
          gutterBottom
        >
          {format(new Date(dateInfo.availableDate), "dd MMMM yyyy", {
            locale: vi,
          })}
        </Typography>

        <Divider sx={{ my: 0.75 }} />

        <Stack spacing={0.75} fontSize="0.75rem">
          {dateInfo.isBlocked ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: "error.main",
              }}
            >
              <Lock size={14} />
              <span>Bị khóa</span>
            </Box>
          ) : dateInfo.isAvailable ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: "success.main",
              }}
            >
              <CheckCircle size={14} />
              <span>Phòng trống</span>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: "text.secondary",
              }}
            >
              <XCircle size={14} />
              <span>Không khả dụng</span>
            </Box>
          )}

          {dateInfo.customPrice && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: "primary.main",
              }}
            >
              <DollarSign size={14} />
              <span>{dateInfo.customPrice.toLocaleString()} VNĐ</span>
            </Box>
          )}

          {dateInfo.minimumNights && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: "text.secondary",
              }}
            >
              <Moon size={14} />
              <span>Tối thiểu: {dateInfo.minimumNights} đêm</span>
            </Box>
          )}

          {dateInfo.blockReason && (
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 0.5,
                color: "error.main",
              }}
            >
              <AlertTriangle size={14} style={{ marginTop: 1 }} />
              <span>{dateInfo.blockReason}</span>
            </Box>
          )}
        </Stack>
      </Box>
    );

    return (
      <MuiTooltip
        title={tooltipContent}
        arrow
        placement="top"
        componentsProps={{
          tooltip: {
            sx: {
              bgcolor: "transparent",
              p: 0,
              boxShadow: "none",
              "& .MuiTooltip-arrow": {
                color: "background.paper",
              },
            },
          },
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: bgColor,
            border: `2.5px solid ${borderColor}`,
            borderRadius: "6px",
            color: textColor,
            fontWeight: 700,
            fontSize: "0.9rem",
            cursor: "pointer",
            transition: "all 0.2s ease",
            "&:hover": {
              transform: "scale(1.12)",
              boxShadow: 3,
              zIndex: 1,
            },
          }}
        >
          {format(day, "d")}
        </Box>
      </MuiTooltip>
    );
  };

  // 🔹 Lọc các ngày còn trống (có thể book được)
  const availableDates = availabilityCalendars.filter(
    (cal) => cal.isAvailable && !cal.isBlocked
  );

  const displayCalendars = showAll
    ? availableDates
    : availableDates.slice(0, 12);

  // 🔹 Khi không có ngày trống
  if (availableDates.length === 0) {
    return (
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Lịch khả dụng
        </Typography>
        <Alert severity="info">
          Hiện tại không có ngày trống. Vui lòng liên hệ chủ nhà để biết thêm
          thông tin.
        </Alert>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      {/* 🔹 Header */}
      {/* Toggle Button để bật/tắt Calendar */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <AppButton
          variant="outlined"
          size="small"
          onClick={() => setShowCalendar(!showCalendar)}
        >
          {showCalendar ? "Ẩn lịch" : "Hiện lịch"}
        </AppButton>

        {/* Legend - Chú thích màu sắc */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                bgcolor: "#e8f5e9",
                border: "2px solid #4caf50",
                borderRadius: 0.5,
              }}
            />
            <Typography variant="caption">Còn trống</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                bgcolor: "#ffebee",
                border: "2px solid #f44336",
                borderRadius: 0.5,
              }}
            />
            <Typography variant="caption">Bị khóa</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                bgcolor: "#fafafa",
                borderRadius: 0.5,
              }}
            />
            <Typography variant="caption">Không có sẵn</Typography>
          </Box>
        </Box>
      </Box>

      {/* DateRangePicker với custom styling */}
      {showCalendar && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            overflowX: "auto", // hỗ trợ cuộn ngang trên mobile nếu cần

            "& .rdrCalendarWrapper": {
              fontSize: { xs: "12px", sm: "14px" },
              width: "100%",
            },

            "& .rdrDateRangePickerWrapper": {
              width: "100%",
            },

            "& .rdrDefinedRangesWrapper": {
              display: "none",
            },

            "& .rdrMonthAndYearWrapper": {
              paddingTop: "12px",
            },

            "& .rdrMonth": {
              width: { xs: "100%", sm: "auto" },
              minWidth: "300px", // đảm bảo mỗi tháng đủ rộng
            },

            // TIÊU ĐỀ THỨ (T2, T3, ...)
            "& .rdrWeekDays": {
              display: "flex",
              justifyContent: "space-between",
            },

            "& .rdrWeekDay": {
              flex: "1 1 0",
              textAlign: "center",
              fontWeight: 600,
              color: "text.secondary",
              fontSize: { xs: "10px", sm: "12px" },
              minWidth: "40px", // Đảm bảo mỗi thứ rộng ít nhất 40px
              maxWidth: "50px",
            },

            // NGÀY TRONG LỊCH
            "& .rdrDays": {
              fontSize: { xs: "11px", sm: "13px" },
            },

            "& .rdrDay": {
              height: { xs: "40px", sm: "46px" },
              width: { xs: "40px", sm: "46px" },
              minWidth: "40px", // quan trọng: đồng bộ với rdrWeekDay
              maxWidth: "50px", // đồng bộ
              margin: "0 auto", // căn giữa trong ô
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },

            // Các trạng thái chọn ngày
            "& .rdrSelected, & .rdrInRange, & .rdrStartEdge, & .rdrEndEdge": {
              background: "#1976d2",
            },
          }}
        >
          <DateRangePicker
            ranges={[]} // Không hiển thị range selection
            locale={vi}
            months={2}
            direction="horizontal"
            showMonthAndYearPickers={true}
            showDateDisplay={false}
            staticRanges={[]}
            inputRanges={[]}
            weekdayDisplayFormat="EEEEE"
            dayContentRenderer={customDayContent}
            minDate={new Date()}
            maxDate={
              availabilityCalendars.length > 0
                ? new Date(
                    Math.max(
                      ...availabilityCalendars.map((cal) =>
                        new Date(cal.availableDate).getTime()
                      )
                    )
                  )
                : undefined
            }
          />
        </Box>
      )}

      <Divider sx={{ my: 3 }} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Lịch khả dụng ({availableDates.length})
        </Typography>

        {availableDates.length > 12 && (
          <AppButton
            variant="text"
            onClick={() => setShowAll(!showAll)}
            size="small"
          >
            {showAll ? "Thu gọn" : `Xem tất cả (${availableDates.length})`}
          </AppButton>
        )}
      </Box>

      {/* 🔹 Danh sách ngày khả dụng */}
      <Grid container spacing={2}>
        {displayCalendars.map((calendar, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }} key={index}>
            <Card
              sx={{
                p: 2,
                height: "100%",
                border: "1px solid",
                borderColor: calendar.isAvailable
                  ? "success.light"
                  : "error.light",
                bgcolor: calendar.isBlocked
                  ? "error.50"
                  : calendar.isAvailable
                  ? "success.50"
                  : "grey.50",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "success.main",
                  boxShadow: 2,
                },
              }}
            >
              {/* 🔸 Ngày */}
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}
              >
                <Calendar size={18} />
                <Typography variant="subtitle2" fontWeight={600}>
                  {new Date(calendar.availableDate).toLocaleDateString(
                    "vi-VN",
                    {
                      weekday: "long", // hiển thị đầy đủ: Thứ Hai
                      day: "2-digit",
                      month: "long", // hiển thị đầy đủ: tháng Mười
                      year: "numeric",
                    }
                  )}
                </Typography>
              </Box>

              <Divider sx={{ my: 1 }} />

              <Stack spacing={1}>
                {/* 🔸 Trạng thái khả dụng */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {calendar.isAvailable ? (
                    <CheckCircle size={16} color="#4caf50" />
                  ) : (
                    <XCircle size={16} color="#f44336" />
                  )}
                  <Typography
                    variant="body2"
                    color={calendar.isAvailable ? "success.main" : "error.main"}
                    fontWeight={500}
                  >
                    {calendar.isAvailable ? "Phòng trống" : "Không khả dụng"}
                  </Typography>
                </Box>

                {/* 🔸 Nếu bị chặn */}
                {calendar.isBlocked && (
                  <Box
                    sx={{
                      p: 1,
                      bgcolor: "error.100",
                      borderRadius: 0.5,
                      border: "1px solid",
                      borderColor: "error.main",
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="error.main"
                      fontWeight={500}
                    >
                      ⚠️ Bị chặn
                    </Typography>
                    {calendar.blockReason && (
                      <Typography
                        variant="caption"
                        display="block"
                        color="error.dark"
                      >
                        Lý do: {calendar.blockReason}
                      </Typography>
                    )}
                  </Box>
                )}

                {/* 🔸 Giá tùy chỉnh */}
                {calendar.customPrice && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <DollarSign size={14} color="#666" />
                    <Typography variant="caption" color="text.secondary">
                      Giá:
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="primary.main"
                    >
                      {calendar.customPrice.toLocaleString()} VNĐ
                    </Typography>
                  </Box>
                )}

                {/* 🔸 Số đêm tối thiểu */}
                {calendar.minimumNights && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Clock size={14} color="#666" />
                    <Typography variant="caption" color="text.secondary">
                      Tối thiểu:
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {calendar.minimumNights} đêm
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 🔹 Nếu danh sách trống (fallback an toàn) */}
      {availableDates.length === 0 && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Chưa có lịch khả dụng nào
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

// Component HostInfo
const HostInfo = ({ homestay }: { homestay: Homestay }) => (
  <Paper sx={{ p: 3, mb: 3 }}>
    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
      Thông tin chủ nhà
    </Typography>
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
      <Avatar src={homestay.ownerAvatar} sx={{ width: 64, height: 64 }}>
        <User size={32} />
      </Avatar>
      <Box>
        <Typography variant="h6" fontWeight={600}>
          {homestay.ownerName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Chủ nhà
        </Typography>
      </Box>
    </Box>
    <Stack spacing={1.5}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Mail size={18} color="#666" />
        <Typography variant="body2">{homestay.ownerEmail}</Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Phone size={18} color="#666" />
        <Typography variant="body2">{homestay.ownerPhone}</Typography>
      </Box>
    </Stack>
  </Paper>
);

// Component BookingCard (Sticky)
const BookingCard = ({
  homestay,
  onBook,
}: {
  homestay: Homestay;
  onBook: () => void;
}) => (
  <Card sx={{ p: 3, border: "1px solid", borderColor: "divider" }}>
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mb: 1 }}>
        <Typography variant="h4" fontWeight={700} color="primary.main">
          {homestay.baseNightlyPrice.toLocaleString()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          VNĐ / đêm
        </Typography>
      </Box>
      {homestay.weekendPrice && (
        <Typography variant="caption" color="text.secondary">
          Cuối tuần: {homestay.weekendPrice.toLocaleString()} VNĐ
        </Typography>
      )}
    </Box>

    <Divider sx={{ my: 2 }} />

    <Stack spacing={2}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Clock size={16} color="#666" />
          <Typography variant="body2" color="text.secondary">
            Check-in:
          </Typography>
        </Box>
        <Typography variant="body2" fontWeight={600}>
          {homestay.checkInTime}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Clock size={16} color="#666" />
          <Typography variant="body2" color="text.secondary">
            Check-out:
          </Typography>
        </Box>
        <Typography variant="body2" fontWeight={600}>
          {homestay.checkOutTime}
        </Typography>
      </Box>

      <Divider />

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="body2" color="text.secondary">
          Tối thiểu:
        </Typography>
        <Typography variant="body2" fontWeight={600}>
          {homestay.minimumNights} đêm
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="body2" color="text.secondary">
          Tối đa:
        </Typography>
        <Typography variant="body2" fontWeight={600}>
          {homestay.maximumNights} đêm
        </Typography>
      </Box>
      {homestay.isFreeCancellation ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Check size={16} color="#4caf50" />
            <Typography variant="body2" color="text.secondary">
              Hủy miễn phí:
            </Typography>
          </Box>
          <Typography variant="body2" fontWeight={600}>
            Trong {homestay.freeCancellationDays} ngày
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <X size={16} color="#f44336" />
            <Typography variant="body2" color="text.secondary">
              Hủy miễn phí:
            </Typography>
          </Box>
          <Typography variant="body2" fontWeight={600} color="error.main">
            Không hỗ trợ
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AlertCircle size={16} color="#666" />
          <Typography variant="body2" color="text.secondary">
            Trả trước:
          </Typography>
        </Box>
        <Chip
          label={homestay.isPrepaymentRequired ? "Bắt buộc" : "Không yêu cầu"}
          size="small"
          color={homestay.isPrepaymentRequired ? "warning" : "success"}
          icon={
            homestay.isPrepaymentRequired ? (
              <X size={14} />
            ) : (
              <Check size={14} />
            )
          }
        />
      </Box>

      {(homestay.weeklyDiscount || homestay.monthlyDiscount) && (
        <>
          <Divider />
          {homestay.weeklyDiscount && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Giảm giá hàng tuần:
              </Typography>
              <Chip
                label={`-${homestay.weeklyDiscount}%`}
                size="small"
                color="success"
                sx={{ fontWeight: 600 }}
              />
            </Box>
          )}
          {homestay.monthlyDiscount && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Giảm giá hàng tháng:
              </Typography>
              <Chip
                label={`-${homestay.monthlyDiscount}%`}
                size="small"
                color="success"
                sx={{ fontWeight: 600 }}
              />
            </Box>
          )}
        </>
      )}
    </Stack>

    <AppButton
      variant="contained"
      fullWidth
      size="large"
      onClick={onBook}
      sx={{ mt: 3, py: 1.5, fontWeight: 600 }}
    >
      Đặt phòng ngay
    </AppButton>

    {homestay.isInstantBook && (
      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Chip
          label="Đặt ngay - Không cần chờ xác nhận"
          size="small"
          color="success"
          icon={<CheckCircle size={14} />}
        />
      </Box>
    )}
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{ display: "block", mt: 2, textAlign: "center" }}
    >
      Bạn chưa bị trừ tiền ngay bây giờ
    </Typography>

    <style>{`
  .homestay-marker, .place-marker {
    background: transparent !important;
    border: none !important;
  }
  
  .leaflet-popup-content-wrapper {
    border-radius: 8px;
  }
`}</style>
  </Card>
);
