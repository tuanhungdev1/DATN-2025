// src/components/homestay/TopRatedHomestaysSlider.tsx
import { Box, Typography, IconButton, Chip } from "@mui/material";
import Slider from "react-slick";
import type { Homestay } from "@/types/homestay.types";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Star } from "lucide-react";
import HomestayCard from "@/components/homestayCard/HomestayCard";
import { useGetHomestaysQuery } from "@/services/endpoints/homestay.api";
import { HomestayCardSkeleton } from "@/components/homestayCard";

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

  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  infinite: true,

  autoplay: true,
  autoplaySpeed: 4000,
  pauseOnHover: true,
  arrows: true,
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

export const TopRatedHomestaysSlider = () => {
  const { data, isLoading, error } = useGetHomestaysQuery({
    pageNumber: 1,
    pageSize: 12,
    isActive: true,
    isApproved: true,
    sortBy: "popular",
    sortDirection: "desc",
  });

  const homestays: Homestay[] = data?.data?.items || [];

  // Filter homestays with rating >= 4.0 and at least 5 reviews
  const topRatedHomestays = homestays
    .filter(
      (homestay) => homestay.ratingAverage >= 0 && homestay.totalReviews >= 0
    )
    .slice(0, 10);

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
          Homestay đánh giá cao nhất
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
            <HomestayCardSkeleton viewMode="grid" key={index} />
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
          Homestay đánh giá cao nhất
        </Typography>
        <Typography color="error" align="center" sx={{ py: 4 }}>
          Không thể tải danh sách homestay. Vui lòng thử lại sau.
        </Typography>
      </Box>
    );
  }

  // Empty state
  if (!topRatedHomestays.length) {
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
          Homestay đánh giá cao nhất
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
            Chưa có homestay nào đủ tiêu chuẩn
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Homestay cần có ít nhất 5 đánh giá và rating từ 4.0 trở lên.
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "text.primary",
            }}
          >
            Homestay đánh giá cao nhất
          </Typography>
          <Chip
            icon={<Star size={16} fill="#FFB400" color="#FFB400" />}
            label="Top Rated"
            size="small"
            sx={{
              bgcolor: "warning.50",
              color: "warning.dark",
              fontWeight: 600,
              display: { xs: "none", sm: "flex" },
            }}
          />
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ display: { xs: "none", sm: "block" } }}
        >
          {topRatedHomestays.length} homestay
        </Typography>
      </Box>

      <Box sx={{ mx: -2 }}>
        <Slider {...sliderSettings}>
          {topRatedHomestays.map((homestay, index) => (
            <Box key={homestay.id} sx={{ px: 2, position: "relative", py: 4 }}>
              {/* Top 3 Badge */}
              {index < 10 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "42px",
                    left: 8,
                    zIndex: 10,
                    bgcolor: [
                      "#FFD700", // 1st
                      "#C0C0C0", // 2nd
                      "#CD7F32", // 3rd
                      "#FF6B6B", // 4th
                      "#4ECDC4", // 5th
                      "#45B7D1", // 6th
                      "#96CEB4", // 7th
                      "#FECA57", // 8th
                      "#DDA0DD", // 9th
                      "#98D8C8", // 10th
                    ][index],
                    color: "white",
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "1rem",
                    boxShadow: 2,
                  }}
                >
                  #{index + 1}
                </Box>
              )}
              <HomestayCard homestay={homestay} viewMode="grid" />
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};
