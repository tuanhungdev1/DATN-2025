/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { useState } from "react";
import type { Coupon, CouponType } from "@/types/coupon.types";
import { formatCurrency } from "@/utils/format";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface CouponCardProps {
  coupon: Coupon;
}

// === MÀU THEO LOẠI COUPON (giống Traveloka) ===
const getCouponColor = (type: CouponType): string => {
  switch (type) {
    case 1: // Percentage
      return "#1976D2"; // Blue
    case 2: // FixedAmount
      return "#2E7D32"; // Green
    case 3: // FirstBooking
      return "#F57C00"; // Orange
    case 4: // Seasonal
      return "#8E24AA"; // Purple
    case 5: // LongStay
      return "#00897B"; // Teal
    case 6: // Referral
      return "#C2185B"; // Pink
    default:
      return "#455A64";
  }
};

// === HIỂN THỊ GIẢM GIÁ ===
const getDiscountText = (coupon: Coupon): string => {
  if (coupon.couponType === 1) {
    return `Giảm đến ${coupon.discountValue}%`;
  }
  return `Giảm đến ${formatCurrency(coupon.discountValue)}`;
};

// === ĐIỀU KIỆN NGẮN GỌN ===
const getShortCondition = (coupon: Coupon): string => {
  const parts: string[] = [];

  if (coupon.isFirstBookingOnly) {
    parts.push("lần đặt phòng đầu tiên");
  } else if (coupon.isNewUserOnly) {
    parts.push("người dùng mới");
  }

  if (coupon.minimumNights) {
    parts.push(`${coupon.minimumNights} đêm trở lên`);
  }

  if (coupon.minimumBookingAmount) {
    parts.push(`đơn từ ${formatCurrency(coupon.minimumBookingAmount)}`);
  }

  if (parts.length === 0) return "Áp dụng cho mọi đơn đặt";

  return `Cho ${parts.join(", ")}`;
};

const CouponCard = ({ coupon }: CouponCardProps) => {
  const [copied, setCopied] = useState(false);
  const color = getCouponColor(coupon.couponType);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(coupon.couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const isExpiringSoon =
    !coupon.isExpired &&
    new Date(coupon.endDate).getTime() - new Date().getTime() <=
      7 * 24 * 60 * 60 * 1000;

  return (
    <Card
      sx={{
        borderRadius: "8px",
        border: `1px solid ${copied ? "#4CAF50" : "divider"}`,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        transition: "all 0.2s ease",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          borderColor: color,
        },
        opacity: coupon.isActive && !coupon.isExpired ? 1 : 0.7,
      }}
    >
      <CardContent sx={{ p: 2, flex: 1 }}>
        {/* Header: Icon + Info */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1,
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1,
              bgcolor: `${color}15`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LocalOfferIcon
              sx={{
                fontSize: 20,
                color,
              }}
            />
          </Box>

          <Tooltip
            title={
              <Box sx={{ fontSize: "0.8rem", lineHeight: 1.4 }}>
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  {coupon.couponName}
                </Typography>
                <Typography variant="body2">
                  <strong>Hiệu lực:</strong>{" "}
                  {format(new Date(coupon.startDate), "dd/MM", { locale: vi })}{" "}
                  - {format(new Date(coupon.endDate), "dd/MM", { locale: vi })}
                </Typography>
                {coupon.totalUsageLimit && (
                  <Typography variant="body2">
                    <strong>Đã dùng:</strong> {coupon.currentUsageCount}/
                    {coupon.totalUsageLimit}
                  </Typography>
                )}
                {coupon.maxDiscountAmount && (
                  <Typography variant="body2">
                    <strong>Giảm tối đa:</strong>{" "}
                    {formatCurrency(coupon.maxDiscountAmount)}
                  </Typography>
                )}
                {coupon.scopeDisplay && (
                  <Typography variant="body2">
                    <strong>Áp dụng:</strong> {coupon.scopeDisplay}
                  </Typography>
                )}
              </Box>
            }
            arrow
            placement="top"
          >
            <IconButton size="small" sx={{ color: "text.secondary" }}>
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Tiêu đề */}
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: "text.primary",
            mb: 0.5,
            fontSize: "0.95rem",
            lineHeight: 1.3,
            pt: 1,
          }}
        >
          {coupon.couponName}
        </Typography>

        {/* Mô tả ngắn */}
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            fontSize: "0.8rem",
            mb: 1,
            lineHeight: 1.4,
          }}
        >
          {coupon.description || getShortCondition(coupon)}
        </Typography>

        {/* Giảm giá */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color,
            mb: 1.5,
            fontSize: "1rem",
          }}
        >
          {getDiscountText(coupon)}
        </Typography>

        {/* Trạng thái */}
        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 1.5 }}>
          {!coupon.isActive && (
            <Chip
              label="Tạm dừng"
              size="small"
              sx={{ height: 20, fontSize: "0.7rem", bgcolor: "grey.300" }}
            />
          )}
          {coupon.isExpired && (
            <Chip
              label="Hết hạn"
              size="small"
              color="error"
              sx={{ height: 20, fontSize: "0.7rem" }}
            />
          )}
          {isExpiringSoon && (
            <Chip
              label="Sắp hết hạn"
              size="small"
              sx={{
                height: 20,
                fontSize: "0.7rem",
                fontWeight: 600,
                bgcolor: "#FFF3E0",
                color: "#E65100",
                border: "1px solid #FFCC80",
                "& .MuiChip-label": {
                  px: 1,
                },
              }}
            />
          )}
        </Box>
      </CardContent>

      {/* Footer: Mã + Copy */}
      <Box
        sx={{
          borderTop: "1px dashed",
          borderColor: "divider",
          bgcolor: "grey.50",
          p: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flex: 1,
            minWidth: 0,
          }}
        >
          <ContentCopyIcon sx={{ fontSize: 16, color }} />
          <Typography
            variant="body2"
            sx={{
              fontFamily: "monospace",
              fontWeight: 700,
              color,
              fontSize: "0.85rem",
              letterSpacing: 0.5,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {coupon.couponCode}
          </Typography>
        </Box>

        <Box
          component="button"
          onClick={handleCopy}
          sx={{
            px: 2,
            py: 0.5,
            borderRadius: "4px",
            border: `1px solid ${copied ? "#4CAF50" : color}`,
            bgcolor: copied ? "#4CAF50" : color,
            color: "white",
            fontSize: "0.8rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            "&:hover": { opacity: 0.9 },
          }}
        >
          {copied ? (
            <>
              <CheckCircleIcon sx={{ fontSize: 14 }} />
              Đã copy
            </>
          ) : (
            "Copy"
          )}
        </Box>
      </Box>
    </Card>
  );
};

export default CouponCard;
