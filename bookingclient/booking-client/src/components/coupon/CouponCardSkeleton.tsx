// src/components/coupon/CouponCardSkeleton.tsx
import { Card, CardContent, Box, Skeleton } from "@mui/material";

const CouponCardSkeleton = () => {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <CardContent sx={{ p: 3, pb: 2, flexGrow: 1 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Skeleton variant="rounded" width={48} height={48} />
          <Skeleton variant="circular" width={32} height={32} />
        </Box>

        {/* Discount text */}
        <Skeleton variant="text" width="70%" height={32} sx={{ mb: 1 }} />

        {/* Condition text */}
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="text" width="80%" height={20} sx={{ mb: 2 }} />

        {/* Badges */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Skeleton variant="rounded" width={80} height={24} />
        </Box>
      </CardContent>

      {/* Footer */}
      <Box
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
          p: 2,
          bgcolor: "grey.50",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
          <Skeleton variant="circular" width={18} height={18} />
          <Skeleton variant="text" width="60%" height={24} />
        </Box>
        <Skeleton variant="rounded" width={70} height={36} />
      </Box>
    </Card>
  );
};

export default CouponCardSkeleton;
