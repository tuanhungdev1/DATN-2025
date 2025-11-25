// src/components/homestay/LatestHomestaysSlider.tsx
import { Box, Typography, IconButton, Chip } from "@mui/material";
import Slider from "react-slick";
import type { Homestay } from "@/types/homestay.types";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import HomestayCard from "@/components/homestayCard/HomestayCard";
import { useGetHomestaysQuery } from "@/services/endpoints/homestay.api";
import { HomestayCardSkeleton } from "@/components/homestayCard";
import { RiBuilding2Line } from "react-icons/ri";

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
  arrows: true,
  infinite: true,

  autoplay: true,
  autoplaySpeed: 4000,
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

export const LatestHomestaysSlider = () => {
  const { data, isLoading, error } = useGetHomestaysQuery({
    pageNumber: 1,
    pageSize: 12,
    isActive: true,
    isApproved: true,
    sortBy: "newest",
    sortDirection: "desc",
  });

  const homestays: Homestay[] = data?.data?.items || [];

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
          Homestay mới nhất
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
          Homestay mới nhất
        </Typography>
        <Typography color="error" align="center" sx={{ py: 4 }}>
          Không thể tải danh sách homestay. Vui lòng thử lại sau.
        </Typography>
      </Box>
    );
  }

  // Empty state
  if (!homestays.length) {
    return (
      <Box sx={{ py: 5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 4,
          }}
        >
          {/* Tag "Mới" */}
          <Chip
            label="Mới"
            size="small"
            sx={{
              bgcolor: "#FF3B30", // Màu đỏ nổi bật
              color: "white",
              fontWeight: 700,
              fontSize: "0.7rem",
              height: 22,
              borderRadius: 2,
              px: 0.5,
              "& .MuiChip-label": {
                px: 1,
              },
            }}
          />

          {/* Tiêu đề */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              m: 0,
            }}
          >
            Homestay mới nhất
          </Typography>
        </Box>
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
            Chưa có homestay nào
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hiện tại chưa có homestay mới được đăng tải.
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
          <RiBuilding2Line size={"28px"} />
          Homestay mới nhất
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ display: { xs: "none", sm: "block" } }}
        >
          {homestays.length} homestay
        </Typography>
      </Box>

      <Box sx={{ mx: -2 }}>
        <Slider {...sliderSettings}>
          {homestays.map((homestay) => (
            <Box key={homestay.id} sx={{ px: 2, pb: 4 }}>
              <HomestayCard homestay={homestay} viewMode="grid" />
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};
