// src/pages/admin/homestay/HomestayDetail.tsx
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  Card,
  Typography,
  Avatar,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import {
  useGetHomestayByIdQuery,
  useDeleteHomestayMutation,
  useActivateHomestayMutation,
  useDeactivateHomestayMutation,
  useApproveHomestayMutation,
  useRejectHomestayMutation,
} from "@/services/endpoints/homestay.api";
import { AppButton } from "@/components/button";
import {
  Edit,
  Trash2,
  MapPin,
  User,
  Mail,
  Phone,
  Home,
  Bath,
  Users,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  Star,
  Eye,
  ShoppingCart,
  Maximize,
  Building,
  BedDouble,
  Car,
  PawPrint,
  Waves,
  Clock,
  FileText,
  Check,
  X,
  ThumbsUp,
} from "lucide-react";

import type {
  AmenitySimple,
  AvailabilityCalendar,
  Homestay,
  RuleSimple,
} from "@/types/homestay.types";
import ImageSlider from "./ImageSlider";
import { useState } from "react";
import { useToast } from "@/hooks/useToast";

const HomestayDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, error: errorToast } = useToast();
  const [approveHomestay, { isLoading: isApproving }] =
    useApproveHomestayMutation();
  const [rejectHomestay, { isLoading: isRejecting }] =
    useRejectHomestayMutation();

  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const homestayId = id ? parseInt(id) : 0;

  const { data, isLoading, error } = useGetHomestayByIdQuery(homestayId, {
    skip: !homestayId,
  });

  const [deleteHomestay, { isLoading: isDeleting }] =
    useDeleteHomestayMutation();
  const [activateHomestay, { isLoading: isActivating }] =
    useActivateHomestayMutation();
  const [deactivateHomestay, { isLoading: isDeactivating }] =
    useDeactivateHomestayMutation();

  const homestay = data?.data;

  const handleApprove = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn duyệt homestay này?")) return;

    try {
      await approveHomestay({
        id: homestayId,
        data: {
          isApproved: true,
          approvalNote: "Approved by admin",
          autoActivate: true,
        },
      }).unwrap();
      success("Duyệt homestay thành công!");
    } catch (error) {
      console.error("Lỗi duyệt homestay:", error);
      errorToast("Duyệt homestay thất bại!");
    }
  };

  const handleReject = async () => {
    if (!rejectionReason) {
      error("Vui lòng nhập lý do từ chối!");
      return;
    }

    try {
      await rejectHomestay({ id: homestayId, rejectionReason }).unwrap();
      success("Từ chối homestay thành công!");
      setOpenRejectDialog(false);
      setRejectionReason("");
    } catch (error) {
      console.error("Lỗi từ chối homestay:", error);
      errorToast("Từ chối homestay thất bại!");
    }
  };
  // Xử lý delete
  const handleDelete = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa homestay này?")) return;

    try {
      await deleteHomestay(homestayId).unwrap();
      success("Xóa homestay thành công!");
      navigate("/admin/homestays");
    } catch (error) {
      console.error("Lỗi xóa homestay:", error);
      errorToast("Xóa homestay thất bại!");
    }
  };

  // Xử lý chỉnh sửa
  const handleEdit = () => {
    navigate(`/admin/homestays/${homestayId}/edit`);
  };

  // Xử lý toggle active/inactive
  const handleToggleStatus = async () => {
    const confirmMessage = homestay?.isActive
      ? "Bạn có chắc chắn muốn vô hiệu hóa homestay này?"
      : "Bạn có chắc chắn muốn kích hoạt homestay này?";

    if (!window.confirm(confirmMessage)) return;

    try {
      if (homestay?.isActive) {
        await deactivateHomestay(homestayId).unwrap();
      } else {
        await activateHomestay(homestayId).unwrap();
      }
      success("Cập nhật trạng thái thành công!");
    } catch (error) {
      console.error("Lỗi thay đổi trạng thái:", error);
      errorToast("Cập nhật trạng thái thất bại!");
    }
  };

  if (isLoading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !homestay) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Không tìm thấy homestay</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
            {homestay.homestayTitle}
          </Typography>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1 }}>
            <MapPin size={16} />
            <Typography variant="body2" color="text.secondary">
              {homestay.fullAddress}, {homestay.city}, {homestay.province},{" "}
              {homestay.country}
            </Typography>
          </Box>
          {homestay.slug && (
            <Typography variant="caption" color="text.secondary">
              Slug: {homestay.slug}
            </Typography>
          )}
          {homestay.searchKeywords && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 0.5 }}
            >
              Từ khóa: {homestay.searchKeywords}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", height: "50px" }}>
          {!homestay.isApproved && (
            <AppButton
              variant="contained"
              onClick={handleApprove}
              startIcon={<ThumbsUp size={18} />}
              isLoading={isApproving}
              success
            >
              Duyệt
            </AppButton>
          )}
          {!homestay.isApproved && (
            <AppButton
              variant="contained"
              onClick={() => setOpenRejectDialog(true)}
              startIcon={<XCircle size={18} />}
              danger
              disabled={isRejecting}
            >
              Từ chối
            </AppButton>
          )}
          <AppButton
            variant="outlined"
            onClick={handleEdit}
            startIcon={<Edit size={18} />}
          >
            Chỉnh sửa
          </AppButton>
          <AppButton
            danger
            variant="outlined"
            startIcon={<Trash2 size={18} />}
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Xóa
          </AppButton>
          <AppButton
            variant="outlined"
            onClick={handleToggleStatus}
            isLoading={isActivating || isDeactivating}
            success={!homestay.isActive}
            danger={homestay.isActive}
            startIcon={
              homestay.isActive ? (
                <XCircle size={18} />
              ) : (
                <CheckCircle size={18} />
              )
            }
          >
            {homestay.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
          </AppButton>
        </Box>
      </Box>

      {/* Status Badges */}
      <Box sx={{ display: "flex", gap: 1, mb: 3, flexWrap: "wrap" }}>
        <Chip
          label={homestay.isActive ? "Đang hoạt động" : "Đã tắt"}
          color={homestay.isActive ? "success" : "error"}
          size="small"
          icon={homestay.isActive ? <Check size={14} /> : <X size={14} />}
        />
        <Chip
          label={homestay.isApproved ? "Đã duyệt" : "Chờ duyệt"}
          color={homestay.isApproved ? "success" : "warning"}
          size="small"
        />
        {homestay.isFeatured && (
          <Chip
            label="Nổi bật"
            color="primary"
            size="small"
            icon={<Star size={14} />}
          />
        )}
        {homestay.isInstantBook && (
          <Chip label="Instant Book" color="info" size="small" />
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Left Column - Main Content */}
        <Grid size={{ xs: 12, md: 8 }}>
          <ImageSlider images={homestay.images} />
          <Statistics homestay={homestay} />
          <HomestayInfo homestay={homestay} />
          <OwnerInfo homestay={homestay} />
          <Description homestay={homestay} />
          <Address homestay={homestay} />
          <PropertyFeatures homestay={homestay} />
          <Amenities amenities={homestay.amenities} />
          <Rules rules={homestay.rules} />
          <Availability
            availabilityCalendars={homestay.availabilityCalendars}
          />
          <ApprovalInfo homestay={homestay} />
        </Grid>

        <Dialog
          open={openRejectDialog}
          onClose={() => setOpenRejectDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Từ chối Homestay</DialogTitle>
          <DialogContent>
            <Typography variant="body2" mb={2}>
              Vui lòng nhập lý do từ chối homestay:
            </Typography>
            <TextField
              fullWidth
              label="Lý do từ chối"
              multiline
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              error={!rejectionReason}
              helperText={!rejectionReason ? "Lý do từ chối là bắt buộc" : ""}
            />
          </DialogContent>
          <DialogActions>
            <AppButton
              variant="outlined"
              onClick={() => {
                setOpenRejectDialog(false);
                setRejectionReason("");
              }}
            >
              Hủy
            </AppButton>
            <AppButton
              variant="outlined"
              onClick={handleReject}
              color="error"
              disabled={isRejecting || !rejectionReason}
              isLoading={isRejecting}
            >
              Xác nhận từ chối
            </AppButton>
          </DialogActions>
        </Dialog>

        {/* Right Column - Sticky Pricing */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Box
            sx={{
              position: { md: "sticky" },
              top: { md: 20 },
              zIndex: 1,
            }}
          >
            <PricingInfo homestay={homestay} />
            <BookingRules homestay={homestay} />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomestayDetail;

// Component Statistics (mới)
const Statistics = ({ homestay }: { homestay: Homestay }) => (
  <Paper sx={{ p: 3, mb: 3 }}>
    <Typography variant="h6" sx={{ mb: 2 }}>
      Thống kê
    </Typography>
    <Grid container spacing={2}>
      <Grid size={{ xs: 6, sm: 3 }}>
        <Box
          sx={{
            textAlign: "center",
            p: 2,
            bgcolor: "background.default",
            borderRadius: 1,
          }}
        >
          <Eye size={24} style={{ marginBottom: 8 }} color="#666" />
          <Typography variant="h6" fontWeight={600}>
            {homestay.viewCount.toLocaleString()}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Lượt xem
          </Typography>
        </Box>
      </Grid>
      <Grid size={{ xs: 6, sm: 3 }}>
        <Box
          sx={{
            textAlign: "center",
            p: 2,
            bgcolor: "background.default",
            borderRadius: 1,
          }}
        >
          <Star size={24} style={{ marginBottom: 8 }} color="#ffa500" />
          <Typography variant="h6" fontWeight={600}>
            {homestay.ratingAverage.toFixed(1)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Đánh giá
          </Typography>
        </Box>
      </Grid>
      <Grid size={{ xs: 6, sm: 3 }}>
        <Box
          sx={{
            textAlign: "center",
            p: 2,
            bgcolor: "background.default",
            borderRadius: 1,
          }}
        >
          <FileText size={24} style={{ marginBottom: 8 }} color="#666" />
          <Typography variant="h6" fontWeight={600}>
            {homestay.totalReviews.toLocaleString()}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Nhận xét
          </Typography>
        </Box>
      </Grid>
      <Grid size={{ xs: 6, sm: 3 }}>
        <Box
          sx={{
            textAlign: "center",
            p: 2,
            bgcolor: "background.default",
            borderRadius: 1,
          }}
        >
          <ShoppingCart size={24} style={{ marginBottom: 8 }} color="#666" />
          <Typography variant="h6" fontWeight={600}>
            {homestay.bookingCount.toLocaleString()}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Đặt phòng
          </Typography>
        </Box>
      </Grid>
      <Grid size={{ xs: 6, sm: 3 }}>
        <Box
          sx={{
            textAlign: "center",
            p: 2,
            bgcolor: "background.default",
            borderRadius: 1,
          }}
        >
          <Calendar size={24} style={{ marginBottom: 8 }} color="#666" />
          <Typography variant="h6" fontWeight={600}>
            {new Date(homestay.createdAt).toLocaleDateString("vi-VN")}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Tạo ngày
          </Typography>
        </Box>
      </Grid>

      {homestay.updatedAt && (
        <Grid size={{ xs: 6, sm: 3 }}>
          <Box
            sx={{
              textAlign: "center",
              p: 2,
              bgcolor: "background.default",
              borderRadius: 1,
            }}
          >
            <Clock size={24} style={{ marginBottom: 8 }} color="#666" />
            <Typography variant="h6" fontWeight={600}>
              {new Date(homestay.updatedAt).toLocaleDateString("vi-VN")}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Cập nhật
            </Typography>
          </Box>
        </Grid>
      )}
    </Grid>
  </Paper>
);

// Component HomestayInfo
const HomestayInfo = ({ homestay }: { homestay: Homestay }) => (
  <Paper sx={{ p: 3, mb: 3 }}>
    <Typography variant="h6" sx={{ mb: 2 }}>
      Thông tin cơ bản
    </Typography>
    <Grid container spacing={2}>
      <Grid size={{ xs: 6, md: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Home size={20} color="#666" />
          <Box>
            <Typography variant="caption" color="text.secondary">
              Loại bất động sản
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {homestay.propertyTypeName}
            </Typography>
          </Box>
        </Box>
      </Grid>
      <Grid size={{ xs: 6, md: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Users size={20} color="#666" />
          <Box>
            <Typography variant="caption" color="text.secondary">
              Số khách
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {homestay.maximumGuests} người lớn, {homestay.maximumChildren} trẻ
              em
            </Typography>
          </Box>
        </Box>
      </Grid>
      <Grid size={{ xs: 6, md: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <BedDouble size={20} color="#666" />
          <Box>
            <Typography variant="caption" color="text.secondary">
              Phòng ngủ / Giường
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {homestay.numberOfBedrooms} / {homestay.numberOfBeds}
            </Typography>
          </Box>
        </Box>
      </Grid>
      <Grid size={{ xs: 6, md: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Bath size={20} color="#666" />
          <Box>
            <Typography variant="caption" color="text.secondary">
              Phòng tắm
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {homestay.numberOfBathrooms} phòng
            </Typography>
          </Box>
        </Box>
      </Grid>
      <Grid size={{ xs: 6, md: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Home size={20} color="#666" />
          <Box>
            <Typography variant="caption" color="text.secondary">
              Tổng số phòng
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {homestay.numberOfRooms} phòng
            </Typography>
          </Box>
        </Box>
      </Grid>
      <Grid size={{ xs: 6, md: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CheckCircle size={20} color="#4caf50" />
          <Box>
            <Typography variant="caption" color="text.secondary">
              Phòng trống
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {homestay.availableRooms} phòng
            </Typography>
          </Box>
        </Box>
      </Grid>
      {homestay.areaInSquareMeters && (
        <Grid size={{ xs: 6, md: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Maximize size={20} color="#666" />
            <Box>
              <Typography variant="caption" color="text.secondary">
                Diện tích
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {homestay.areaInSquareMeters} m²
              </Typography>
            </Box>
          </Box>
        </Grid>
      )}
      {homestay.numberOfFloors && (
        <Grid size={{ xs: 6, md: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Building size={20} color="#666" />
            <Box>
              <Typography variant="caption" color="text.secondary">
                Số tầng
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {homestay.numberOfFloors} tầng
              </Typography>
            </Box>
          </Box>
        </Grid>
      )}

      <Grid size={{ xs: 6, md: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <DollarSign size={20} color="#666" />
          <Box>
            <Typography variant="caption" color="text.secondary">
              Số phòng áp dụng giá
            </Typography>
            <Typography variant="body1" fontWeight={500}>
              {homestay.roomsAtThisPrice} phòng
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  </Paper>
);

// Component PropertyFeatures (mới)
const PropertyFeatures = ({ homestay }: { homestay: Homestay }) => (
  <Paper sx={{ p: 3, mb: 3 }}>
    <Typography variant="h6" sx={{ mb: 2 }}>
      Đặc điểm nổi bật
    </Typography>
    <Grid container spacing={2}>
      <Grid size={{ xs: 6, sm: 4 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            p: 2,
            border: "1px solid",
            borderColor: homestay.hasParking ? "success.main" : "divider",
            borderRadius: 1,
            bgcolor: homestay.hasParking ? "success.50" : "transparent",
          }}
        >
          <Car size={24} color={homestay.hasParking ? "#4caf50" : "#999"} />
          <Box>
            <Typography variant="body2" fontWeight={500}>
              Bãi đỗ xe
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {homestay.hasParking ? "Có" : "Không"}
            </Typography>
          </Box>
        </Box>
      </Grid>
      <Grid size={{ xs: 6, sm: 4 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            p: 2,
            border: "1px solid",
            borderColor: homestay.isPetFriendly ? "success.main" : "divider",
            borderRadius: 1,
            bgcolor: homestay.isPetFriendly ? "success.50" : "transparent",
          }}
        >
          <PawPrint
            size={24}
            color={homestay.isPetFriendly ? "#4caf50" : "#999"}
          />
          <Box>
            <Typography variant="body2" fontWeight={500}>
              Thú cưng
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {homestay.isPetFriendly ? "Cho phép" : "Không cho phép"}
            </Typography>
          </Box>
        </Box>
      </Grid>
      <Grid size={{ xs: 6, sm: 4 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            p: 2,
            border: "1px solid",
            borderColor: homestay.hasPrivatePool ? "success.main" : "divider",
            borderRadius: 1,
            bgcolor: homestay.hasPrivatePool ? "success.50" : "transparent",
          }}
        >
          <Waves
            size={24}
            color={homestay.hasPrivatePool ? "#4caf50" : "#999"}
          />
          <Box>
            <Typography variant="body2" fontWeight={500}>
              Hồ bơi riêng
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {homestay.hasPrivatePool ? "Có" : "Không"}
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  </Paper>
);

// Component OwnerInfo
const OwnerInfo = ({ homestay }: { homestay: Homestay }) => (
  <Paper sx={{ p: 3, mb: 3 }}>
    <Typography variant="h6" sx={{ mb: 2 }}>
      Thông tin chủ sở hữu
    </Typography>
    <Stack spacing={2}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Avatar src={homestay.ownerAvatar} sx={{ width: 60, height: 60 }}>
          <User size={30} />
        </Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight={600}>
            {homestay.ownerName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ID: {homestay.ownerId}
          </Typography>
        </Box>
      </Box>
      <Divider />
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

// Component Description
const Description = ({ homestay }: { homestay: Homestay }) =>
  homestay.homestayDescription && (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Mô tả
      </Typography>
      <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
        {homestay.homestayDescription}
      </Typography>
    </Paper>
  );

// Component Address
const Address = ({ homestay }: { homestay: Homestay }) => (
  <Paper sx={{ p: 3, mb: 3 }}>
    <Typography variant="h6" sx={{ mb: 2 }}>
      <MapPin size={20} style={{ verticalAlign: "middle", marginRight: 8 }} />
      Vị trí
    </Typography>
    <Stack spacing={2}>
      <Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Địa chỉ đầy đủ:
        </Typography>
        <Typography variant="body1">{homestay.fullAddress}</Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Thành phố:
          </Typography>
          <Typography variant="body1">{homestay.city}</Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Tỉnh:
          </Typography>
          <Typography variant="body1">{homestay.province}</Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Quốc gia:
          </Typography>
          <Typography variant="body1">{homestay.country}</Typography>
        </Grid>
      </Grid>
      {homestay.postalCode && (
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Mã bưu điện:
          </Typography>
          <Typography variant="body1">{homestay.postalCode}</Typography>
        </Box>
      )}
      <Grid container spacing={2}>
        <Grid size={{ xs: 6 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Vĩ độ:
          </Typography>
          <Typography variant="body1">{homestay.latitude}</Typography>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Kinh độ:
          </Typography>
          <Typography variant="body1">{homestay.longitude}</Typography>
        </Grid>
      </Grid>
    </Stack>
  </Paper>
);

// Component Amenities - Cải thiện Grid layout
const Amenities = ({ amenities }: { amenities: AmenitySimple[] }) =>
  amenities &&
  amenities.length > 0 && (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Tiện nghi ({amenities.length})
      </Typography>
      <Grid container spacing={2}>
        {amenities.map((amenity, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 2,
                border: "1px solid",
                borderColor: amenity.isHighlight ? "primary.main" : "divider",
                borderRadius: 1,
                bgcolor: amenity.isHighlight ? "primary.50" : "transparent",
                height: "100%",
                minHeight: 80,
              }}
            >
              {amenity.iconUrl ? (
                <img
                  src={amenity.iconUrl}
                  alt={amenity.amenityName}
                  style={{ width: 32, height: 32, flexShrink: 0 }}
                />
              ) : (
                <CheckCircle
                  size={32}
                  color="#4caf50"
                  style={{ flexShrink: 0 }}
                />
              )}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" fontWeight={500} noWrap>
                  {amenity.amenityName}
                </Typography>
                {amenity.customNote && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {amenity.customNote}
                  </Typography>
                )}
                {amenity.isHighlight && (
                  <Chip
                    label="Nổi bật"
                    size="small"
                    color="primary"
                    sx={{ mt: 0.5, height: 20 }}
                  />
                )}
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );

// Component Rules - Cải thiện Grid layout
const Rules = ({ rules }: { rules: RuleSimple[] }) =>
  rules &&
  rules.length > 0 && (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Quy tắc nhà ({rules.length})
      </Typography>
      <Grid container spacing={2}>
        {rules.map((rule, index) => (
          <Grid size={{ xs: 12, sm: 6 }} key={index}>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
                p: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                height: "100%",
                minHeight: 90,
              }}
            >
              {rule.iconUrl ? (
                <img
                  src={rule.iconUrl}
                  alt={rule.ruleName}
                  style={{ width: 32, height: 32, flexShrink: 0 }}
                />
              ) : (
                <XCircle size={32} color="#f44336" style={{ flexShrink: 0 }} />
              )}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" fontWeight={500}>
                  {rule.ruleName}
                </Typography>
                {rule.ruleDescription && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    sx={{ mt: 0.5 }}
                  >
                    {rule.ruleDescription}
                  </Typography>
                )}
                {rule.customNote && (
                  <Typography
                    variant="caption"
                    color="primary.main"
                    display="block"
                    sx={{ mt: 0.5 }}
                  >
                    Ghi chú: {rule.customNote}
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );

// Component Availability - Cải thiện hiển thị
const Availability = ({
  availabilityCalendars,
}: {
  availabilityCalendars: AvailabilityCalendar[];
}) => {
  const [showAll, setShowAll] = useState(false);
  const displayCalendars = showAll
    ? availabilityCalendars
    : availabilityCalendars.slice(0, 12);

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">
          Lịch khả dụng ({availabilityCalendars.length})
        </Typography>
        {availabilityCalendars.length > 12 && (
          <AppButton
            variant="text"
            onClick={() => setShowAll(!showAll)}
            size="small"
          >
            {showAll
              ? "Thu gọn"
              : `Xem tất cả (${availabilityCalendars.length})`}
          </AppButton>
        )}
      </Box>
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
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}
              >
                <Calendar size={18} />
                <Typography variant="subtitle2" fontWeight={600}>
                  {(() => {
                    const date = new Date(calendar.availableDate);
                    const weekdays = [
                      "Chủ Nhật",
                      "Thứ Hai",
                      "Thứ Ba",
                      "Thứ Tư",
                      "Thứ Năm",
                      "Thứ Sáu",
                      "Thứ Bảy",
                    ];
                    const day = date.getDate();
                    const month = date.getMonth() + 1;
                    const year = date.getFullYear();
                    const weekday = weekdays[date.getDay()];

                    return `${weekday}, ngày ${day} tháng ${month} năm ${year}`;
                  })()}
                </Typography>
              </Box>

              <Divider sx={{ my: 1 }} />

              <Stack spacing={1}>
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
                    {calendar.isAvailable ? "Có sẵn" : "Không có sẵn"}
                  </Typography>
                </Box>

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

      {availabilityCalendars.length === 0 && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Chưa có lịch khả dụng nào
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

// Component ApprovalInfo (mới) - Hiển thị thông tin duyệt
const ApprovalInfo = ({ homestay }: { homestay: Homestay }) => (
  <Paper sx={{ p: 3, mb: 3 }}>
    <Typography variant="h6" sx={{ mb: 2 }}>
      Thông tin phê duyệt
    </Typography>
    <Stack spacing={2}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Trạng thái:
        </Typography>
        <Chip
          label={homestay.isApproved ? "Đã duyệt" : "Chờ duyệt"}
          color={homestay.isApproved ? "success" : "warning"}
          size="small"
          icon={
            homestay.isApproved ? (
              <CheckCircle size={14} />
            ) : (
              <Clock size={14} />
            )
          }
        />
      </Box>

      {homestay.approvedAt && (
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Ngày duyệt:
          </Typography>
          <Typography variant="body1">
            {new Date(homestay.approvedAt).toLocaleString("vi-VN")}
          </Typography>
        </Box>
      )}

      {homestay.approvedBy && (
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Người duyệt:
          </Typography>
          <Typography variant="body1">{homestay.approvedBy}</Typography>
        </Box>
      )}

      {homestay.approvalNote && (
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Ghi chú phê duyệt:
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
            {homestay.approvalNote}
          </Typography>
        </Box>
      )}

      {homestay.rejectionReason && (
        <Box
          sx={{
            p: 2,
            bgcolor: "error.50",
            borderRadius: 1,
            border: "1px solid",
            borderColor: "error.main",
          }}
        >
          <Typography
            variant="body2"
            color="error.main"
            fontWeight={600}
            gutterBottom
          >
            Lý do từ chối:
          </Typography>
          <Typography
            variant="body2"
            color="error.dark"
            sx={{ whiteSpace: "pre-wrap" }}
          >
            {homestay.rejectionReason}
          </Typography>
        </Box>
      )}

      {homestay.searchKeywords && (
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Từ khóa tìm kiếm:
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {homestay.searchKeywords.split(",").map((kw, i) => (
              <Chip key={i} label={kw.trim()} size="small" variant="outlined" />
            ))}
          </Box>
        </Box>
      )}
    </Stack>
  </Paper>
);

// Component PricingInfo (sticky)
const PricingInfo = ({ homestay }: { homestay: Homestay }) => (
  <Paper sx={{ p: 3, mb: 3 }}>
    <Typography variant="h6" sx={{ mb: 2 }}>
      <DollarSign
        size={20}
        style={{ verticalAlign: "middle", marginRight: 8 }}
      />
      Thông tin giá
    </Typography>
    <Stack spacing={2}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          bgcolor: "primary.50",
          borderRadius: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Giá 1 đêm:
        </Typography>
        <Typography variant="h6" fontWeight={700} color="primary.main">
          {homestay.baseNightlyPrice.toLocaleString()} VNĐ / đêm
        </Typography>
      </Box>

      {homestay.weekendPrice && (
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body2" color="text.secondary">
            Giá vào cuối tuần:
          </Typography>
          <Typography variant="body1" fontWeight={600} color="#e7000b">
            {homestay.weekendPrice.toLocaleString()} VNĐ / đêm
          </Typography>
        </Box>
      )}

      <Divider />

      {homestay.weeklyDiscount && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
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
          <Typography variant="body2" color="text.secondary">
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
    </Stack>
  </Paper>
);

// Component BookingRules (sticky)
const BookingRules = ({ homestay }: { homestay: Homestay }) => (
  <Paper sx={{ p: 3 }}>
    <Typography variant="h6" sx={{ mb: 2 }}>
      <Calendar size={20} style={{ verticalAlign: "middle", marginRight: 8 }} />
      Quy tắc đặt phòng
    </Typography>
    <Stack spacing={2}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Clock size={16} color="#666" />
          <Typography variant="body2" color="text.secondary">
            Check-in:
          </Typography>
        </Box>
        <Typography variant="body1" fontWeight={600}>
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
        <Typography variant="body1" fontWeight={600}>
          {homestay.checkOutTime}
        </Typography>
      </Box>

      <Divider />

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="body2" color="text.secondary">
          Số đêm tối thiểu:
        </Typography>
        <Typography variant="body1" fontWeight={600}>
          {homestay.minimumNights} đêm
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="body2" color="text.secondary">
          Số đêm tối đa:
        </Typography>
        <Typography variant="body1" fontWeight={600}>
          {homestay.maximumNights} đêm
        </Typography>
      </Box>

      <Divider />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Instant Book:
        </Typography>
        {homestay.isInstantBook ? (
          <Chip
            label="Có"
            size="small"
            color="success"
            icon={<CheckCircle size={14} />}
          />
        ) : (
          <Chip
            label="Không"
            size="small"
            color="default"
            icon={<XCircle size={14} />}
          />
        )}
      </Box>

      {homestay.isFreeCancellation && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Hủy miễn phí:
          </Typography>
          <Chip
            label={`${homestay.freeCancellationDays} ngày`}
            size="small"
            color="success"
            icon={<CheckCircle size={14} />}
          />
        </Box>
      )}

      {homestay.isPrepaymentRequired && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Yêu cầu trả trước
          </Typography>
          <Chip label="Bắt buộc" size="small" color="warning" />
        </Box>
      )}
    </Stack>
  </Paper>
);
