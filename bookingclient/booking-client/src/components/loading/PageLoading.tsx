// components/common/PageLoading.tsx
import { Box, LinearProgress, Typography } from "@mui/material";
import { keyframes } from "@mui/system";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// const pulse = keyframes`
//   0%, 100% {
//     transform: scale(1);
//     opacity: 1;
//   }
//   50% {
//     transform: scale(1.05);
//     opacity: 0.8;
//   }
// `;

// Hiệu ứng nhảy lên xuống (bounce) cho icon vị trí
const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-12px);
  }
`;

const PageLoading = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "background.default",
        zIndex: 9999,
        animation: `${fadeIn} 0.3s ease-in`,
      }}
    >
      {/* Linear Progress ở top */}
      <LinearProgress
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
        }}
      />

      {/* Logo hoặc Brand name */}
      <Box
        sx={{
          mb: 3,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            fontSize: "38px",
            background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          NextStay
        </Typography>
      </Box>

      {/* Icon vị trí nhảy lên xuống */}
      <Box
        sx={{
          animation: `${bounce} 1.6s ease-in-out infinite`,
          color: "primary.light",
          fontSize: 50,
        }}
      >
        <LocationOnIcon sx={{ fontSize: "inherit" }} />
      </Box>

      {/* Loading text */}
      <Typography
        variant="body2"
        sx={{
          mt: 2,
          color: "text.secondary",
          animation: `${fadeIn} 0.5s ease-in`,
        }}
      >
        Đang tải...
      </Typography>
    </Box>
  );
};

export default PageLoading;
