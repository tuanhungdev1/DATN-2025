// src/pages/homestay/HomestayDetailSkeleton.tsx
import {
  Box,
  Container,
  Grid,
  Paper,
  Skeleton,
  Chip,
  Divider,
  Card,
  Stack,
  IconButton,
} from "@mui/material";
import { Home, Building2 } from "lucide-react";
import AppBreadcrumbs, {
  type BreadcrumbItem,
} from "@/components/breadcrumb/AppBreadcrumbs";

const HomestayDetailSkeleton = () => {
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Trang chủ", path: "/", icon: <Home size={14} /> },
    {
      label: "Danh sách Homestay",
      path: "/homestay-list",
      icon: <Building2 size={14} />,
    },
    { label: "Đang tải..." },
  ];

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <AppBreadcrumbs items={breadcrumbItems} />

        {/* Header Skeleton */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 2,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="70%" height={48} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="50%" height={24} />
              <Skeleton variant="text" width="40%" height={24} sx={{ mt: 1 }} />
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                disabled
                sx={{ border: "1px solid", borderColor: "divider" }}
              >
                <Skeleton variant="circular" width={40} height={40} />
              </IconButton>
              <IconButton
                disabled
                sx={{ border: "1px solid", borderColor: "divider" }}
              >
                <Skeleton variant="circular" width={40} height={40} />
              </IconButton>
            </Box>
          </Box>

          {/* Badges */}
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Chip label={<Skeleton width={60} />} size="small" />
            <Chip label={<Skeleton width={70} />} size="small" />
            <Chip label={<Skeleton width={80} />} size="small" />
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid size={{ xs: 12, md: 8 }}>
            {/* Image Slider Skeleton */}
            <Box sx={{ mb: 3 }}>
              <Skeleton
                variant="rectangular"
                height={400}
                sx={{ borderRadius: 2 }}
              />
              <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                {[...Array(5)].map((_, i) => (
                  <Skeleton
                    key={i}
                    variant="rectangular"
                    width={80}
                    height={60}
                    sx={{ borderRadius: 1 }}
                  />
                ))}
              </Box>
            </Box>

            {/* HomestayInfo */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                {[...Array(6)].map((_, i) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={i}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        py: 1,
                      }}
                    >
                      <Skeleton variant="circular" width={20} height={20} />
                      <Skeleton variant="text" width="80%" />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* Description */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Skeleton variant="text" width="20%" height={32} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="90%" />
            </Paper>

            {/* Property Features */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Skeleton variant="text" width="35%" height={32} sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                {[...Array(3)].map((_, i) => (
                  <Grid size={{ xs: 12, sm: 4 }} key={i}>
                    <Skeleton
                      variant="rectangular"
                      height={80}
                      sx={{ borderRadius: 2 }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* Amenities */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Skeleton variant="text" width="25%" height={32} sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                {[...Array(12)].map((_, i) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={i}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        p: 1.5,
                      }}
                    >
                      <Skeleton variant="circular" width={24} height={24} />
                      <Skeleton variant="text" width="70%" />
                    </Box>
                  </Grid>
                ))}
              </Grid>
              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Skeleton
                  variant="rectangular"
                  width={200}
                  height={36}
                  sx={{ mx: "auto", borderRadius: 2 }}
                />
              </Box>
            </Paper>

            {/* Rules */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Skeleton variant="text" width="25%" height={32} sx={{ mb: 2 }} />
              {[...Array(3)].map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    mb: 2,
                    p: 1.5,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                  }}
                >
                  <Box sx={{ display: "flex", gap: 1.5 }}>
                    <Skeleton variant="circular" width={24} height={24} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant="text" width="60%" />
                      <Skeleton variant="text" width="40%" />
                    </Box>
                  </Box>
                </Box>
              ))}
            </Paper>

            {/* Availability Section */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Skeleton variant="rectangular" width={120} height={32} />
                <Skeleton variant="rectangular" width={80} height={32} />
              </Box>
              <Skeleton
                variant="rectangular"
                height={300}
                sx={{ mb: 3, borderRadius: 2 }}
              />
              <Divider sx={{ my: 3 }} />
              <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                {[...Array(4)].map((_, i) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={i}>
                    <Card sx={{ p: 2 }}>
                      <Skeleton variant="text" width="80%" height={28} />
                      <Divider sx={{ my: 1 }} />
                      <Skeleton variant="text" width="60%" />
                      <Skeleton variant="text" width="50%" />
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* Host Info */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
              <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                <Skeleton variant="circular" width={64} height={64} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                </Box>
              </Box>
              <Stack spacing={1.5}>
                <Skeleton variant="text" width="70%" />
                <Skeleton variant="text" width="65%" />
              </Stack>
            </Paper>

            {/* Location Info */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Skeleton
                variant="rectangular"
                height={200}
                sx={{ borderRadius: 2 }}
              />
            </Paper>

            {/* Reviews Skeleton */}
            <Paper sx={{ p: 3 }}>
              <Skeleton variant="text" width="25%" height={32} sx={{ mb: 2 }} />
              <Skeleton
                variant="rectangular"
                height={120}
                sx={{ borderRadius: 2, mb: 2 }}
              />
              <Skeleton
                variant="rectangular"
                height={100}
                sx={{ borderRadius: 2 }}
              />
            </Paper>
          </Grid>

          {/* Right Column - Booking Card */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ position: { md: "sticky" }, top: { md: 20 } }}>
              <Card sx={{ p: 3 }}>
                <Skeleton
                  variant="text"
                  width="60%"
                  height={48}
                  sx={{ mb: 1 }}
                />
                <Skeleton variant="text" width="40%" height={24} />
                <Divider sx={{ my: 2 }} />
                <Stack spacing={2}>
                  {[...Array(6)].map((_, i) => (
                    <Box
                      key={i}
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Skeleton variant="text" width="50%" />
                      <Skeleton variant="text" width="30%" />
                    </Box>
                  ))}
                </Stack>
                <Skeleton
                  variant="rectangular"
                  height={48}
                  sx={{ mt: 3, borderRadius: 2 }}
                />
                <Box sx={{ textAlign: "center", mt: 2 }}>
                  <Skeleton
                    variant="rectangular"
                    width={180}
                    height={28}
                    sx={{ mx: "auto", borderRadius: 2 }}
                  />
                </Box>
                <Skeleton
                  variant="text"
                  width="80%"
                  sx={{ mt: 2, textAlign: "center" }}
                />
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HomestayDetailSkeleton;
