// src/pages/admin/CouponManagement/components/CouponDetailDialog.tsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Grid,
  Chip,
  Divider,
  alpha,
} from "@mui/material";
import { AppButton } from "@/components/button";
import {
  Tag,
  Calendar,
  DollarSign,
  Users,
  Home,
  TrendingUp,
  Eye,
  Lock,
  CheckCircle,
  XCircle,
  Percent,
  Clock,
} from "lucide-react";
import type { Coupon } from "@/types/coupon.types";
import {
  getCouponScopeDisplay,
  getCouponTypeDisplay,
} from "@/utils/formatCoupon";
import { formatVietnameseDate } from "@/utils/dateUtils";

interface CouponDetailDialogProps {
  open: boolean;
  coupon: Coupon | null;
  onClose: () => void;
}

export const CouponDetailDialog: React.FC<CouponDetailDialogProps> = ({
  open,
  coupon,
  onClose,
}) => {
  if (!coupon) return null;

  const InfoRow = ({
    icon,
    label,
    value,
    valueColor,
  }: {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
    valueColor?: string;
  }) => (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 2 }}>
      <Box
        sx={{
          mt: 0.5,
          color: "text.secondary",
        }}
      >
        {icon}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" color="text.secondary" mb={0.5}>
          {label}
        </Typography>
        <Typography
          variant="body1"
          fontWeight={600}
          sx={{ color: valueColor || "text.primary" }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );

  const isPercentage = coupon.couponType === 1;
  const daysLeft = Math.ceil(
    (new Date(coupon.endDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: (theme) =>
                alpha(theme.palette.primary.main, 0.1),
            }}
          >
            <Tag size={28} color="#1976d2" />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" fontWeight={700}>
              {coupon.couponCode}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {coupon.couponName}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Chip
              label={coupon.isActive ? "Hoạt động" : "Ngừng"}
              color={coupon.isActive ? "success" : "error"}
              size="small"
            />
            {coupon.isExpired && (
              <Chip label="Hết hạn" color="error" size="small" />
            )}
            {coupon.isAvailable && !coupon.isExpired && (
              <Chip label="Khả dụng" color="success" size="small" />
            )}
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {/* Description */}
        {coupon.description && (
          <Box
            sx={{
              p: 2,
              marginTop: 2,
              borderRadius: "4px",
              backgroundColor: (theme) => alpha(theme.palette.info.main, 0.05),
              border: "1px solid",
              borderColor: (theme) => alpha(theme.palette.info.main, 0.2),
              mb: 3,
            }}
          >
            <Typography variant="body2">{coupon.description}</Typography>
          </Box>
        )}

        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="subtitle2"
              fontWeight={700}
              mb={2}
              color="primary"
            >
              Thông tin chung
            </Typography>

            <InfoRow
              icon={<Tag size={18} />}
              label="Loại Coupon"
              value={getCouponTypeDisplay(coupon.couponType)}
            />

            <InfoRow
              icon={
                isPercentage ? <Percent size={18} /> : <DollarSign size={18} />
              }
              label="Giá trị giảm"
              value={
                isPercentage
                  ? `${coupon.discountValue}%`
                  : `${coupon.discountValue.toLocaleString("vi-VN")} VND`
              }
              valueColor="#1976d2"
            />

            {coupon.maxDiscountAmount && (
              <InfoRow
                icon={<DollarSign size={18} />}
                label="Giảm tối đa"
                value={`${coupon.maxDiscountAmount.toLocaleString(
                  "vi-VN"
                )} VND`}
              />
            )}

            <InfoRow
              icon={<Calendar size={18} />}
              label="Ngày bắt đầu"
              value={formatVietnameseDate(coupon.startDate)}
            />

            <InfoRow
              icon={<Calendar size={18} />}
              label="Ngày kết thúc"
              value={
                <Box>
                  <Typography
                    variant="body1"
                    fontWeight={600}
                    color={coupon.isExpired ? "error.main" : "text.primary"}
                  >
                    {formatVietnameseDate(coupon.endDate)}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mt: 0.5,
                    }}
                  >
                    <Clock size={12} />
                    <Typography
                      variant="caption"
                      color={daysLeft > 0 ? "success.main" : "error.main"}
                    >
                      {daysLeft > 0
                        ? `Còn ${daysLeft} ngày`
                        : `Đã hết hạn ${Math.abs(daysLeft)} ngày`}
                    </Typography>
                  </Box>
                </Box>
              }
            />
          </Grid>

          {/* Right Column */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="subtitle2"
              fontWeight={700}
              mb={2}
              color="primary"
            >
              Điều kiện & giới hạn
            </Typography>

            <InfoRow
              icon={<Users size={18} />}
              label="Lượt sử dụng"
              value={
                <Box>
                  <Typography variant="body1" fontWeight={600}>
                    {coupon.currentUsageCount} / {coupon.totalUsageLimit || "∞"}
                  </Typography>
                  {coupon.totalUsageLimit && (
                    <Typography variant="caption" color="text.secondary">
                      {(
                        (coupon.currentUsageCount / coupon.totalUsageLimit) *
                        100
                      ).toFixed(1)}
                      % đã sử dụng
                    </Typography>
                  )}
                </Box>
              }
            />

            {coupon.usagePerUser && (
              <InfoRow
                icon={<Users size={18} />}
                label="Giới hạn mỗi người"
                value={`${coupon.usagePerUser} lần`}
              />
            )}

            {coupon.minimumBookingAmount && (
              <InfoRow
                icon={<DollarSign size={18} />}
                label="Giá trị đơn tối thiểu"
                value={`${coupon.minimumBookingAmount.toLocaleString(
                  "vi-VN"
                )} VND`}
              />
            )}

            {coupon.minimumNights && (
              <InfoRow
                icon={<Calendar size={18} />}
                label="Số đêm tối thiểu"
                value={`${coupon.minimumNights} đêm`}
              />
            )}

            <InfoRow
              icon={<Home size={18} />}
              label="Phạm vi áp dụng"
              value={getCouponScopeDisplay(coupon.scope)}
            />

            <InfoRow
              icon={<TrendingUp size={18} />}
              label="Độ ưu tiên"
              value={coupon.priority}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Additional Info */}
        <Typography variant="subtitle2" fontWeight={700} mb={2}>
          Thông tin bổ sung
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
          {coupon.isPublic ? (
            <Chip
              icon={<Eye size={14} />}
              label="Công khai"
              size="small"
              color="success"
              variant="outlined"
            />
          ) : (
            <Chip
              icon={<Lock size={14} />}
              label="Riêng tư"
              size="small"
              variant="outlined"
            />
          )}

          {coupon.isFirstBookingOnly && (
            <Chip
              icon={<CheckCircle size={14} />}
              label="Chỉ đặt phòng đầu"
              size="small"
              color="info"
              variant="outlined"
            />
          )}

          {coupon.isNewUserOnly && (
            <Chip
              icon={<CheckCircle size={14} />}
              label="Chỉ người dùng mới"
              size="small"
              color="info"
              variant="outlined"
            />
          )}

          {!coupon.isAvailable && (
            <Chip
              icon={<XCircle size={14} />}
              label="Không khả dụng"
              size="small"
              color="error"
              variant="outlined"
            />
          )}
        </Box>

        {/* Specific Homestay Info */}
        {coupon.specificHomestayName && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              borderRadius: 2,
              backgroundColor: (theme) =>
                alpha(theme.palette.success.main, 0.05),
              border: "1px solid",
              borderColor: (theme) => alpha(theme.palette.success.main, 0.2),
            }}
          >
            <Typography variant="body2" fontWeight={600} mb={0.5}>
              <Home
                size={16}
                style={{ verticalAlign: "middle", marginRight: 4 }}
              />
              Áp dụng cho homestay cụ thể
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {coupon.specificHomestayName}
            </Typography>
          </Box>
        )}

        {/* Creator Info */}
        {coupon.createdByUserName && (
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="caption" color="text.secondary">
              Được tạo bởi: <strong>{coupon.createdByUserName}</strong>
            </Typography>
            <br />
            <Typography variant="caption" color="text.secondary">
              Ngày tạo: {formatVietnameseDate(coupon.createdAt)}
            </Typography>
            <br />
            <Typography variant="caption" color="text.secondary">
              Cập nhật lần cuối: {formatVietnameseDate(coupon.updatedAt)}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <AppButton variant="contained" onClick={onClose} size="small">
          Đóng
        </AppButton>
      </DialogActions>
    </Dialog>
  );
};
