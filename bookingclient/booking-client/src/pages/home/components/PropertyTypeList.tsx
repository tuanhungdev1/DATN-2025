/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppImage } from "@/components/images";
import { useGetPropertyTypesQuery } from "@/services/endpoints/propertyType.api";
import type { PropertyType } from "@/types/propertyType.types";
import { Box, Typography, Skeleton, IconButton } from "@mui/material";
import Slider from "react-slick";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { MdOutlineHomeWork } from "react-icons/md";
import { useNavigate } from "react-router-dom";

// 🌀 Custom Arrow Buttons
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

const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4000,
  pauseOnHover: true,
  arrows: true,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  responsive: [
    { breakpoint: 1200, settings: { slidesToShow: 3 } },
    { breakpoint: 900, settings: { slidesToShow: 2 } },
    { breakpoint: 600, settings: { slidesToShow: 1 } },
  ],
};

// ✅ Component LoadingSkeleton
const LoadingSkeleton = () => {
  const skeletonItems = Array.from({ length: 4 });

  return (
    <Box sx={{ py: 5 }}>
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          mb: 3,
          display: "flex",
          alignItems: "center",
        }}
      >
        <MdOutlineHomeWork />
        Duyệt theo loại hình chỗ ở
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
              height={200}
              sx={{ borderRadius: 2, mb: 1 }}
            />
            <Skeleton variant="text" width="60%" />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

const PropertyTypeList = () => {
  const { data, isLoading, isError } = useGetPropertyTypesQuery({
    pageNumber: 1,
    pageSize: 100,
    isActive: true,
    sortBy: "displayOrder",
    sortOrder: "asc",
  });
  const navigate = useNavigate();
  if (isLoading) return <LoadingSkeleton />;

  const handlePropertyClick = (propertyId: number) => {
    const params = new URLSearchParams();
    params.set("propertyTypeId", propertyId.toString());
    params.set("pageNumber", "1");
    navigate(`/homestay-list?${params.toString()}`);
  };

  if (isError)
    return (
      <Typography color="error" align="center" sx={{ py: 4 }}>
        Không thể tải danh sách loại chỗ ở.
      </Typography>
    );

  const propertyTypes = data?.data?.items || [];

  return (
    <Box sx={{ py: 5, position: "relative" }}>
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
        <MdOutlineHomeWork size={"28px"} />
        Khám phá theo loại chỗ ở
      </Typography>

      <Slider {...sliderSettings}>
        {propertyTypes.map((property: PropertyType) => (
          <Box
            key={property.id}
            onClick={() => handlePropertyClick(property.id)}
            sx={{
              px: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              pt: 4,
            }}
          >
            <Box
              sx={{
                borderRadius: "6px",
                overflow: "hidden",
                width: "100%",
                height: 200,
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
              <AppImage
                src={
                  property.iconUrl ||
                  "https://via.placeholder.com/300x200?text=No+Image"
                }
                alt={property.typeName}
              />
            </Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, textAlign: "left" }}
            >
              {property.typeName}
            </Typography>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default PropertyTypeList;
