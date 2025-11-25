import { Skeleton, Box } from "@mui/material";

const LoadingPlaceholder = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Skeleton
        variant="rectangular"
        width="100%"
        height="100%"
        animation="pulse"
      />
    </Box>
  );
};

export default LoadingPlaceholder;
