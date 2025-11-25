// src/components/homestayCard/HomestayCardSkeleton.tsx
import React from "react";
import { Card, CardContent, Box, Skeleton, styled } from "@mui/material";

const StyledCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== "viewMode",
})<{ viewMode: "grid" | "list" }>(({ viewMode }) => ({
  display: "flex",
  flexDirection: viewMode === "list" ? "row" : "column",
  height: viewMode === "list" ? "auto" : "100%",
  minHeight: viewMode === "list" ? 250 : "auto",
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

interface HomestayCardSkeletonProps {
  viewMode: "grid" | "list";
}

const HomestayCardSkeleton: React.FC<HomestayCardSkeletonProps> = ({
  viewMode,
}) => {
  return (
    <StyledCard viewMode={viewMode}>
      {/* Image Skeleton */}
      <ImageWrapper viewMode={viewMode}>
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          animation="wave"
        />
      </ImageWrapper>

      {/* Content Skeleton */}
      <CardContent
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          p: 2,
        }}
      >
        {/* Chips */}
        <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
          <Skeleton variant="rounded" width={80} height={24} />
          <Skeleton variant="rounded" width={100} height={24} />
        </Box>

        {/* Title */}
        <Skeleton variant="text" width="90%" height={28} sx={{ mb: 0.5 }} />

        {/* Location */}
        <Skeleton variant="text" width="70%" height={20} sx={{ mb: 1 }} />

        {/* Amenities */}
        <Box sx={{ display: "flex", gap: 1.5, mb: 1, flexWrap: "wrap" }}>
          <Skeleton variant="text" width={60} height={20} />
          <Skeleton variant="text" width={80} height={20} />
          <Skeleton variant="text" width={70} height={20} />
          <Skeleton variant="text" width={90} height={20} />
        </Box>

        {/* Benefits */}
        <Box sx={{ mb: 1 }}>
          <Skeleton variant="text" width="80%" height={20} sx={{ mb: 0.5 }} />
          <Skeleton variant="text" width="75%" height={20} />
        </Box>

        {/* Rating */}
        <Skeleton variant="text" width={150} height={24} sx={{ mb: 1 }} />

        {/* Price */}
        <Box
          sx={{ display: "flex", alignItems: "baseline", gap: 0.5, mt: "auto" }}
        >
          <Skeleton variant="text" width={120} height={32} />
        </Box>

        {/* Room availability */}
        <Skeleton variant="text" width="85%" height={20} sx={{ mt: 1 }} />
      </CardContent>
    </StyledCard>
  );
};

export default HomestayCardSkeleton;
