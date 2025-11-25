import { Box, type SxProps, type Theme } from "@mui/material";
import { useEffect, useState } from "react";
import LoadingPlaceholder from "../loading/LoadingPlaceholder";

interface AppImageProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  sx?: SxProps<Theme>;
  useBlurEffect?: boolean; // Bật hiệu ứng làm mờ khi tải
}

const AppImage: React.FC<AppImageProps> = ({
  src,
  alt,
  fallbackSrc = "https://placehold.net/default.svg",
  sx,
  useBlurEffect = true,
}) => {
  const [imgSrc, setImgSrc] = useState<string>(fallbackSrc);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    setIsLoading(true);
    img.src = src;

    img.onload = () => {
      setImgSrc(src);
      setIsLoading(false);
    };

    img.onerror = () => {
      setImgSrc(fallbackSrc);
      setIsLoading(false);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, fallbackSrc]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        ...sx,
      }}
    >
      {/* Placeholder nằm trên cùng trong khi ảnh load */}
      {isLoading && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
          }}
        >
          <LoadingPlaceholder />
        </Box>
      )}

      <Box
        component="img"
        src={imgSrc}
        alt={alt}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition:
            "opacity 0.6s ease, filter 0.6s ease, transform 0.4s ease",
          opacity: isLoading ? 0.4 : 1,
          filter: isLoading && useBlurEffect ? "blur(8px)" : "none",
          transform: isLoading ? "scale(1.02)" : "scale(1)",
          display: "block",
        }}
      />
    </Box>
  );
};

export default AppImage;
