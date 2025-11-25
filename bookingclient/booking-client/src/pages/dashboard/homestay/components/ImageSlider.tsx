import { useRef, useState } from "react";
import {
  Box,
  Paper,
  Grid,
  CardMedia,
  IconButton,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Slider from "react-slick";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";
import type { HomestayImage } from "@/types/homestay.types";

// Custom Arrow Buttons
const NextArrow = ({ onClick }: { onClick?: () => void }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: "absolute",
      top: "50%",
      right: 8,
      transform: "translateY(-50%)",
      bgcolor: "rgba(255,255,255,0.7)",
      "&:hover": {
        bgcolor: "rgba(255,255,255,0.9)",
      },
      zIndex: 1,
    }}
  >
    <ArrowForwardIosIcon />
  </IconButton>
);

const PrevArrow = ({ onClick }: { onClick?: () => void }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: "absolute",
      top: "50%",
      left: 8,
      transform: "translateY(-50%)",
      bgcolor: "rgba(255,255,255,0.7)",
      "&:hover": {
        bgcolor: "rgba(255,255,255,0.9)",
      },
      zIndex: 1,
    }}
  >
    <ArrowBackIosNewIcon />
  </IconButton>
);

// Slider settings cho main slider
const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
};

// Slider settings cho preview modal
const previewSliderSettings = {
  ...sliderSettings,
  adaptiveHeight: true,
};

interface ImageSliderProps {
  images: HomestayImage[];
}

const ImageSlider = ({ images }: ImageSliderProps) => {
  const sliderRef = useRef<Slider>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  // Đồng bộ slider khi nhấp vào thumbnail
  const handleThumbnailClick = (index: number) => {
    setPreviewIndex(index);
    setIsPreviewOpen(true);
  };

  const handleThumbnailNotOpenPreview = (index: number) => {
    setSelectedIndex(index);
    sliderRef.current?.slickGoTo(index);
  };

  // Cập nhật selectedIndex khi slider thay đổi
  const handleSlideChange = (index: number) => {
    setSelectedIndex(index);
  };

  // Cập nhật previewIndex khi slide trong modal
  const handlePreviewSlideChange = (index: number) => {
    setPreviewIndex(index);
  };

  // Đóng preview modal
  const handleClosePreview = () => {
    setIsPreviewOpen(false);
  };

  // Nếu không có ảnh, hiển thị placeholder
  if (!images || images.length === 0) {
    return (
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Hình ảnh
        </Typography>
        <Typography color="text.secondary">Không có hình ảnh</Typography>
      </Paper>
    );
  }

  const currentPreviewImage = images[previewIndex];

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Hình ảnh
      </Typography>
      <Box sx={{ position: "relative" }}>
        <Slider
          {...sliderSettings}
          ref={sliderRef}
          afterChange={handleSlideChange}
        >
          {images.map((image, index) => (
            <Box
              key={index}
              onClick={() => handleThumbnailClick(index)}
              sx={{
                position: "relative",
                cursor: "pointer",
                height: 400, // Cố định chiều cao slider
                overflow: "hidden",
              }}
            >
              <CardMedia
                component="img"
                height="400" // Đảm bảo chiều cao cố định
                image={image.imageUrl}
                alt={image.imageTitle || `Image ${index + 1}`}
                sx={{
                  objectFit: "cover", // Cắt ảnh để lấp đầy khung
                  width: "100%",
                  height: "100%", // Đảm bảo lấp đầy container
                  borderRadius: 1,
                }}
              />
              {image.isPrimaryImage && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    bgcolor: "primary.main",
                    color: "white",
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: "0.75rem",
                  }}
                >
                  Đại diện
                </Box>
              )}
            </Box>
          ))}
        </Slider>
      </Box>
      <Grid container spacing={1} sx={{ mt: 2 }}>
        {images.map((image, index) => (
          <Grid size={{ xs: 3, sm: 2, md: 2 }} key={index}>
            <CardMedia
              component="img"
              height="100"
              image={image.imageUrl}
              alt={image.imageTitle || `Thumbnail ${index + 1}`}
              sx={{
                cursor: "pointer",
                borderRadius: 1,
                border: index === selectedIndex ? "2px solid" : "none",
                borderColor: "primary.main",
                objectFit: "cover",
                transition: "border 0.3s",
              }}
              onClick={() => handleThumbnailNotOpenPreview(index)}
            />
          </Grid>
        ))}
      </Grid>

      {/* Preview Modal */}
      <Dialog
        open={isPreviewOpen}
        onClose={handleClosePreview}
        maxWidth="lg"
        fullWidth={false}
        sx={{
          "& .MuiDialog-paper": {
            // maxWidth: "900px",
            // maxHeight: "700px",
            // width: "900px",
            // height: "700px",
          },
        }}
      >
        <DialogTitle sx={{ textAlign: "left", p: 2 }}>
          <Typography variant="h5">Xem ảnh chi tiết</Typography>
          <IconButton
            onClick={handleClosePreview}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "white",
              bgcolor: "rgba(0,0,0,0.5)",
              "&:hover": {
                bgcolor: "rgba(0,0,0,0.7)",
              },
              zIndex: 1300, // Đảm bảo button nổi lên trên slider
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 4, flexGrow: 1 }}>
          <Slider
            {...previewSliderSettings}
            initialSlide={previewIndex}
            afterChange={handlePreviewSlideChange}
          >
            {images.map((image, index) => (
              <Box
                key={index}
                sx={{
                  height: 800, // ✅ Chiều cao cố định
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  borderRadius: 1,
                }}
              >
                <CardMedia
                  component="img"
                  sx={{
                    maxHeight: "100%",
                    maxWidth: "100%",
                    objectFit: "contain", // giữ tỷ lệ ảnh
                  }}
                  image={image.imageUrl}
                  alt={image.imageTitle || `Preview ${index + 1}`}
                />
              </Box>
            ))}
          </Slider>

          <Box
            sx={{
              color: "white",

              borderRadius: 1,
              height: 80, // ✅ cố định chiều cao vùng thông tin
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography variant="subtitle1" color="text.primary">
              {previewIndex + 1}/{images.length}
            </Typography>
            {currentPreviewImage.imageTitle && (
              <Typography
                variant="subtitle1"
                color="text.primary"
                fontSize={"18px"}
                fontWeight={700}
              >
                {currentPreviewImage.imageTitle}
              </Typography>
            )}
            {currentPreviewImage.imageDescription && (
              <Typography variant="body2" color="text.primary">
                {currentPreviewImage.imageDescription}
              </Typography>
            )}
          </Box>
        </DialogContent>
        {/* Thông tin ảnh — có chiều cao cố định */}
      </Dialog>
    </Paper>
  );
};

export default ImageSlider;
