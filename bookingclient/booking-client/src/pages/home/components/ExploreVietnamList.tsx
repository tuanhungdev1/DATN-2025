/* eslint-disable @typescript-eslint/no-explicit-any */
import Slider from "react-slick";
import { Box, Typography, Skeleton, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { vietnamCities } from "@/constants/vietnamCities";
import type { City } from "@/constants/vietnamCities";
import { AppImage } from "@/components/images";
import { useNavigate } from "react-router-dom";

// 🌀 Custom Arrow Buttons (giống PropertyTypeList)
const NextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: "absolute",
        top: "50%",
        right: 6,
        transform: "translate(50%, -100%)",
        backgroundColor: "rgba(255,255,255)",
        color: "black",
        boxShadow: 2,
        "&:hover": {
          backgroundColor: "rgba(255,255,255,1)",
        },
      }}
    >
      <ArrowForwardIosIcon fontSize="small" />
    </IconButton>
  );
};

const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: "absolute",
        top: "50%",
        left: 6,
        zIndex: 1,
        transform: "translate(-50%, -100%)",
        backgroundColor: "rgba(255,255,255)",
        color: "black",
        boxShadow: 2,
        "&:hover": {
          backgroundColor: "rgba(255,255,255,1)",
        },
      }}
    >
      <ArrowBackIosNewIcon fontSize="small" />
    </IconButton>
  );
};

// ⚙️ Slider settings
const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 1,
  arrows: true,

  autoplay: true,
  autoplaySpeed: 3000,
  pauseOnHover: true,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  responsive: [
    { breakpoint: 1440, settings: { slidesToShow: 5 } },
    { breakpoint: 1200, settings: { slidesToShow: 4 } },
    { breakpoint: 900, settings: { slidesToShow: 3 } },
    { breakpoint: 600, settings: { slidesToShow: 2 } },
    {
      breakpoint: 0,
      settings: { slidesToShow: 1.2, centerMode: true, centerPadding: "10%" },
    }, // Mobile đẹp hơn
  ],
};

// ✅ LoadingSkeleton (hiển thị khi đang tải)
const LoadingSkeleton = () => {
  const skeletonItems = Array.from({ length: 5 });
  return (
    <Box sx={{ py: 5 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
        Khám phá Việt Nam
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 3,
        }}
      >
        {skeletonItems.map((_, index) => (
          <Box key={index}>
            <Skeleton
              variant="rectangular"
              width="100%"
              height={180}
              sx={{ borderRadius: 2, mb: 1 }}
            />
            <Skeleton variant="text" width="60%" />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// 🏙️ Main Component
export const ExploreVietnamList: React.FC<{ isLoading?: boolean }> = ({
  isLoading = false,
}) => {
  const navigate = useNavigate();

  // THÊM HÀM NÀY
  const handleCityClick = (cityName: string) => {
    const params = new URLSearchParams();
    params.set("city", cityName);
    params.set("pageNumber", "1");
    navigate(`/homestay-list?${params.toString()}`);
  };
  if (isLoading) return <LoadingSkeleton />;

  return (
    <Box sx={{ py: 5, position: "relative" }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
        Khám phá Việt Nam
      </Typography>

      <Typography variant="body1" sx={{ mb: 4 }}>
        Những điểm đến nổi tiếng này có rất nhiều điều hấp dẫn để khám phá.
      </Typography>

      <Slider {...sliderSettings}>
        {vietnamCities.map((city: City) => (
          <Box
            key={city.id}
            onClick={() => handleCityClick(city.name)}
            sx={{
              px: 1,
              cursor: "pointer",
              borderRadius: 2,
              overflow: "hidden",
              transition: "all 0.3s ease",
            }}
          >
            <Box
              sx={{
                borderRadius: "8px",
                overflow: "hidden",
                width: "100%",
                height: 180,
                mb: 1.5,
                boxShadow: 1,
                "& img": {
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.3s",
                },
                "&:hover img": {
                  transform: "scale(1.05)",
                },
              }}
            >
              <AppImage src={city.imageUrl} alt={city.name} />
            </Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, textAlign: "left" }}
            >
              {city.name}
            </Typography>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};
