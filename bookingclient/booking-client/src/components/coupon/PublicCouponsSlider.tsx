// src/components/coupon/PublicCouponsSlider.tsx
import { Box, Typography, IconButton } from "@mui/material";
import Slider from "react-slick";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { RiCoupon3Line } from "react-icons/ri";
import { useGetPublicCouponsQuery } from "@/services/endpoints/coupon.api";
import type { Coupon } from "@/types/coupon.types";
import CouponCard from "./CouponCard";
import CouponCardSkeleton from "./CouponCardSkeleton";

const NextArrow = ({ onClick }: { onClick?: () => void }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: "absolute",
      top: "50%",
      right: -16,
      transform: "translateY(-50%)",
      backgroundColor: "rgba(255,255,255,0.95)",
      color: "black",
      boxShadow: 2,
      zIndex: 2,
      width: 40,
      height: 40,
      "&:hover": {
        backgroundColor: "rgba(255,255,255,1)",
      },
      "&.slick-disabled": {
        display: "none !important",
      },
    }}
  >
    <ArrowForwardIosIcon fontSize="small" />
  </IconButton>
);

const PrevArrow = ({ onClick }: { onClick?: () => void }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: "absolute",
      top: "50%",
      left: -16,
      zIndex: 2,
      transform: "translateY(-50%)",
      backgroundColor: "rgba(255,255,255,0.95)",
      color: "black",
      boxShadow: 2,
      width: 40,
      height: 40,
      "&:hover": {
        backgroundColor: "rgba(255,255,255,1)",
      },
      "&.slick-disabled": {
        display: "none !important",
      },
    }}
  >
    <ArrowBackIosNewIcon fontSize="small" />
  </IconButton>
);

const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  arrows: true,
  autoplay: true,
  autoplaySpeed: 3000,
  pauseOnHover: true,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  responsive: [
    {
      breakpoint: 1536,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 900,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
      },
    },
  ],
};

const PublicCouponsSlider = () => {
  const { data, isLoading, error } = useGetPublicCouponsQuery({
    pageNumber: 1,
    pageSize: 12,
    isActive: true,
    isExpired: false,
    sortBy: "priority",
    sortDirection: "desc",
  });

  const coupons: Coupon[] = data?.data?.items || [];

  // Loading skeleton
  if (isLoading) {
    return (
      <Box sx={{ py: 5 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 4,
            color: "text.primary",
          }}
        >
          Mã giảm giá đặc biệt
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 3,
          }}
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <CouponCardSkeleton key={index} />
          ))}
        </Box>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ py: 5 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 4,
            color: "text.primary",
          }}
        >
          Mã giảm giá đặc biệt
        </Typography>
        <Typography color="error" align="center" sx={{ py: 4 }}>
          Không thể tải danh sách mã giảm giá. Vui lòng thử lại sau.
        </Typography>
      </Box>
    );
  }

  // Empty state
  if (!coupons.length) {
    return (
      <Box sx={{ py: 5 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 4,
            color: "text.primary",
          }}
        >
          Mã giảm giá đặc biệt
        </Typography>
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            px: 3,
            bgcolor: "grey.50",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Chưa có mã giảm giá
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hiện tại chưa có mã giảm giá nào được công khai.
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 5, position: "relative", px: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "text.primary",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <RiCoupon3Line size={"28px"} />
          Mã giảm giá đặc biệt
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ display: { xs: "none", sm: "block" } }}
        >
          {coupons.length} mã giảm giá
        </Typography>
      </Box>

      <Box sx={{ mx: -2 }}>
        <Slider {...sliderSettings}>
          {coupons.map((coupon) => (
            <Box key={coupon.id} sx={{ px: 2, py: 1, height: "300px" }}>
              <CouponCard coupon={coupon} />
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default PublicCouponsSlider;
