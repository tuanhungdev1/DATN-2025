/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/homestay/HomestayCard.tsx
import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  Rating,
  IconButton,
  styled,
  alpha,
} from "@mui/material";
import {
  Heart,
  MapPin,
  Users,
  Bed,
  Bath,
  Sofa,
  Moon,
  CheckCircle,
  Ruler,
} from "lucide-react"; // 🟢 Dùng icon từ lucide-react
import { useNavigate } from "react-router-dom";
import type { Homestay } from "@/types/homestay.types";
import { AppImage } from "../images";
import { useWishlist } from "@/hooks/useWishlist";

const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== "viewMode",
})<{ viewMode: "grid" | "list" }>(({ theme, viewMode }) => ({
  display: "flex",
  flexDirection: viewMode === "list" ? "row" : "column",
  height: viewMode === "list" ? "auto" : "100%",
  minHeight: viewMode === "list" ? 250 : "auto",
  cursor: "pointer",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  overflow: "hidden",
  borderRadius: "8px",
  boxShadow: "0px 2px 8px 0px rgba(26, 26, 26, 0.16)",
}));

const ImageWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== "viewMode",
})<{ viewMode: "grid" | "list" }>(({ viewMode }) => ({
  position: "relative",
  overflow: "hidden",
  width: viewMode === "list" ? 300 : "100%",
  minWidth: viewMode === "list" ? 300 : "auto",
  height: viewMode === "list" ? 400 : 200,
  flexShrink: 0,
}));

const FavoriteButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: 12,
  right: 12,
  backgroundColor: alpha(theme.palette.background.paper, 0.9),
  backdropFilter: "blur(4px)",
  zIndex: 2,
  padding: 8,
  "&:hover": {
    backgroundColor: theme.palette.background.paper,
    transform: "scale(1.1)",
  },
}));

const FeaturedBadge = styled(Chip)(({ theme }) => ({
  position: "absolute",
  top: 12,
  left: 12,
  backgroundColor: theme.palette.warning.main,
  color: theme.palette.warning.contrastText,
  fontWeight: 600,
  zIndex: 2,
  height: 28,
}));

const PriceBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "baseline",
  gap: 0.5,
  marginTop: "auto",
  paddingTop: theme.spacing(1),
}));

const DiscountChip = styled(Chip)(({ theme }) => ({
  height: 24,
  fontSize: "0.75rem",
  fontWeight: 500,
  backgroundColor: alpha("#e7000b", 0.1),
  color: "#e7000b",
}));

const BenefitBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 0.5,
  marginBottom: theme.spacing(0.5),
}));

const RoomsAvailableText = styled(Typography)(({ theme }) => ({
  color: "#d32f2f",
  fontWeight: 700,
  fontSize: "0.813rem",
  marginTop: theme.spacing(1),
}));

interface HomestayCardProps {
  homestay: Homestay;
  viewMode: "grid" | "list";
  onFavoriteToggle?: (homestayId: number) => void;
  isFavorite?: boolean;
}

const HomestayCard: React.FC<HomestayCardProps> = ({ homestay, viewMode }) => {
  const navigate = useNavigate();

  const { isInWishlist, toggleWishlist, isLoading } = useWishlist(homestay.id);

  const handleCardClick = () => {
    navigate(`/homestay/${homestay.slug || homestay.id}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(homestay.id);
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  return (
    <StyledCard viewMode={viewMode} onClick={handleCardClick}>
      {/* Image Section */}
      <ImageWrapper viewMode={viewMode}>
        <AppImage
          src={
            homestay.mainImageUrl ||
            homestay.images[0]?.imageUrl ||
            "/placeholder-homestay.jpg"
          }
          alt={homestay.homestayTitle}
          fallbackSrc="https://placehold.net/default.svg"
          sx={{
            height: "100%",
            width: "100%",
            objectFit: "cover",
            transition: "transform 0.3s ease",
            "&:hover": { transform: "scale(1.05)" },
          }}
          useBlurEffect={true}
        />

        {/* Favorite Button */}
        <FavoriteButton
          size="small"
          onClick={handleFavoriteClick}
          disabled={isLoading}
          aria-label={
            isInWishlist ? "Remove from favorites" : "Add to favorites"
          }
        >
          {isInWishlist ? (
            <Heart fill="#e7000b" color="#e7000b" size={18} />
          ) : (
            <Heart size={18} />
          )}
        </FavoriteButton>

        {/* Featured Badge */}
        {homestay.isFeatured && <FeaturedBadge label="Nổi bật" size="small" />}
      </ImageWrapper>

      {/* Content Section */}
      <CardContent
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          p: 2,
          overflow: "visible",
        }}
      >
        {/* Property Type and Discounts */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
          <Chip
            label={homestay.propertyTypeName}
            size="small"
            sx={{
              height: 24,
              fontSize: "0.75rem",
              fontWeight: 500,
            }}
          />
          {homestay.weeklyDiscount && (
            <DiscountChip
              label={`Giảm ${homestay.weeklyDiscount}%/tuần`}
              size="small"
            />
          )}
          {homestay.monthlyDiscount && (
            <DiscountChip
              label={`Giảm ${homestay.monthlyDiscount}%/tháng`}
              size="small"
            />
          )}
        </Box>

        {/* Title */}
        <Typography
          variant="h6"
          className="homestay-title"
          sx={{
            fontWeight: 600,
            mb: 0.5,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: viewMode === "list" ? 2 : 1,
            WebkitBoxOrient: "vertical",
            fontSize: "1.1rem",
            color: "#006ce4",
          }}
        >
          {homestay.homestayTitle}
        </Typography>

        {/* Location */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
          <MapPin size={14} color="#666" />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {homestay.city}, {homestay.province}
          </Typography>
        </Box>

        {/* Amenities Icons */}
        <Box sx={{ display: "flex", gap: 1.5, mb: 1, flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.3 }}>
            <Users size={14} color="#666" />
            <Typography variant="caption" color="text.secondary">
              {homestay.maximumGuests} khách
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.3 }}>
            <Sofa size={14} color="#666" />
            <Typography variant="caption" color="text.secondary">
              {homestay.numberOfBedrooms} phòng ngủ
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.3 }}>
            <Bed size={14} color="#666" />
            <Typography variant="caption" color="text.secondary">
              {homestay.numberOfBeds} giường
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.3 }}>
            <Bath size={14} color="#666" />
            <Typography variant="caption" color="text.secondary">
              {homestay.numberOfBathrooms} phòng tắm
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.3 }}>
            <Moon size={14} color="#666" />
            <Typography variant="caption" color="text.secondary">
              Tối thiểu {homestay.minimumNights} đêm
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.3 }}>
            <Ruler size={14} color="#666" />
            <Typography variant="caption" color="text.secondary">
              60 m²
            </Typography>
          </Box>
        </Box>

        {/* Benefits */}
        <Box sx={{ mb: 1 }}>
          {homestay.isFreeCancellation && (
            <BenefitBox>
              <CheckCircle size={14} color="#4caf50" />
              <Typography
                variant="caption"
                sx={{ color: "#4caf50", fontWeight: 600 }}
              >
                Hủy miễn phí trong {homestay.freeCancellationDays} ngày
              </Typography>
            </BenefitBox>
          )}
          {homestay.isPrepaymentRequired ? (
            <BenefitBox>
              <CheckCircle size={14} color="#f44336" />
              <Typography
                variant="caption"
                sx={{ color: "#f44336", fontWeight: 600 }}
              >
                Yêu cầu thanh toán trước
              </Typography>
            </BenefitBox>
          ) : (
            <BenefitBox>
              <CheckCircle size={14} color="#4caf50" />
              <Typography
                variant="caption"
                sx={{ color: "#4caf50", fontWeight: 600 }}
              >
                Không cần thanh toán trước
              </Typography>
            </BenefitBox>
          )}
        </Box>

        {/* Rating */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Rating
            value={homestay.ratingAverage}
            precision={0.1}
            readOnly
            size="small"
          />
          <Typography variant="body2" color="text.secondary">
            {homestay.ratingAverage.toFixed(1)} ({homestay.totalReviews} đánh
            giá)
          </Typography>
        </Box>

        {/* Price */}
        <PriceBox>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: "primary.main" }}
          >
            {formatPrice(homestay.baseNightlyPrice)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            / đêm
          </Typography>
        </PriceBox>

        {homestay.weekendPrice && (
          <Typography variant="caption" color="text.secondary">
            Cuối tuần: {formatPrice(homestay.weekendPrice)}
          </Typography>
        )}

        <RoomsAvailableText
          sx={{
            color: homestay.roomsAtThisPrice > 0 ? "#f44336" : "#f44336",
            fontWeight: 600,
            mb: 1,
          }}
        >
          {homestay.roomsAtThisPrice > 0
            ? `Chúng tôi còn ${homestay.roomsAtThisPrice} phòng với mức giá này!`
            : "Hiện tại không còn phòng nào với mức giá này."}
        </RoomsAvailableText>

        {homestay.roomsAtThisPrice > 0 ? (
          homestay.isInstantBook && (
            <Chip
              label="Đặt ngay"
              size="small"
              color="success"
              sx={{
                alignSelf: "flex-start",
                height: 28,
                fontWeight: 600,
                fontSize: "0.8rem",
              }}
            />
          )
        ) : (
          <Chip
            label="Hết phòng"
            size="small"
            color="error"
            variant="outlined"
            sx={{
              alignSelf: "flex-start",
              height: 28,
              fontWeight: 600,
              fontSize: "0.8rem",
              border: "2px solid",
            }}
          />
        )}
      </CardContent>
    </StyledCard>
  );
};

export default HomestayCard;
