// src/components/skeleton/MyBookingDetailPageSkeleton.tsx
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Skeleton,
  Stack,
  Chip,
  Divider,
  alpha,
  useTheme,
} from "@mui/material";
import { Calendar, Users, Phone, Mail, Clock, Moon } from "lucide-react";

const MyBookingDetailPageSkeleton = () => {
  const theme = useTheme();

  const cardSx = {
    borderRadius: "4px",
    border: `1px solid ${theme.palette.divider}`,
    overflow: "hidden",
    mb: 3,
  };

  return (
    <Box>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ my: 2 }}>
          <Box sx={{ mb: 3 }}>
            <Skeleton variant="text" width={180} height={32} />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box>
              <Skeleton variant="text" width={280} height={56} sx={{ mb: 1 }} />
              <Skeleton variant="text" width={200} height={32} />
            </Box>

            <Stack direction="row" spacing={2}>
              <Skeleton variant="rounded" width={120} height={44} />
              <Skeleton variant="rounded" width={140} height={44} />
            </Stack>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* ==================== CỘT TRÁI (7/12) ==================== */}
          <Grid size={{ xs: 12, lg: 7 }}>
            {/* Status Card */}
            <Card elevation={0} sx={cardSx}>
              <CardContent sx={{ p: 3 }}>
                <Skeleton
                  variant="text"
                  width={200}
                  height={40}
                  sx={{ mb: 2 }}
                />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  <Chip
                    label={<Skeleton width={110} />}
                    sx={{ py: 2.5, px: 2 }}
                  />
                  <Box sx={{ textAlign: "right" }}>
                    <Skeleton variant="text" width={80} />
                    <Skeleton variant="text" width={140} />
                  </Box>
                </Box>

                <Skeleton
                  variant="rectangular"
                  height={80}
                  sx={{ mt: 2, borderRadius: 1 }}
                />
              </CardContent>
            </Card>

            {/* Homestay Info */}
            <Card elevation={0} sx={cardSx}>
              <Skeleton variant="rectangular" height={250} />

              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Box>
                    <Skeleton variant="text" width={100} />
                    <Skeleton
                      variant="rounded"
                      width={120}
                      height={32}
                      sx={{ mt: 1 }}
                    />
                  </Box>

                  <Divider />

                  <Grid container spacing={2}>
                    {[1, 2].map((i) => (
                      <Grid key={i} size={{ xs: 6 }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Clock size={18} color="#999" />
                          <Box>
                            <Skeleton variant="text" width={90} />
                            <Skeleton variant="text" width={60} />
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Stack>
              </CardContent>
            </Card>

            {/* Booking Details */}
            <Card elevation={0} sx={cardSx}>
              <CardContent sx={{ p: 3 }}>
                <Skeleton
                  variant="text"
                  width={220}
                  height={40}
                  sx={{ mb: 3 }}
                />

                <Grid container spacing={3}>
                  {/* Check-in Full Width */}
                  <Grid size={12}>
                    <Box
                      sx={{
                        p: 2.5,
                        bgcolor: alpha(theme.palette.primary.light, 0.05),
                        borderRadius: "4px",
                        border: `1px solid ${alpha(
                          theme.palette.primary.light,
                          0.2
                        )}`,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          mb: 1,
                        }}
                      >
                        <Calendar
                          size={20}
                          color={theme.palette.primary.light}
                        />
                        <Skeleton variant="text" width={120} />
                      </Box>
                      <Skeleton variant="text" width="70%" height={32} />
                    </Box>
                  </Grid>

                  {/* Check-out Full Width */}
                  <Grid size={12}>
                    <Box
                      sx={{
                        p: 2.5,
                        bgcolor: alpha(theme.palette.secondary.main, 0.05),
                        borderRadius: "4px",
                        border: `1px solid ${alpha(
                          theme.palette.secondary.main,
                          0.2
                        )}`,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          mb: 1,
                        }}
                      >
                        <Calendar
                          size={20}
                          color={theme.palette.secondary.main}
                        />
                        <Skeleton variant="text" width={120} />
                      </Box>
                      <Skeleton variant="text" width="70%" height={32} />
                    </Box>
                  </Grid>

                  {/* Nights & Guests */}
                  {[1, 2].map((i) => (
                    <Grid key={i} size={{ xs: 12, sm: 6 }}>
                      <Box
                        sx={{
                          p: 2,
                          bgcolor: alpha(theme.palette.grey[500], 0.08),
                          borderRadius: "4px",
                          border: `1px solid ${theme.palette.divider}`,
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                        }}
                      >
                        {i === 1 ? (
                          <Moon size={20} color="#666" />
                        ) : (
                          <Users size={20} color="#666" />
                        )}
                        <Box>
                          <Skeleton variant="text" width={100} />
                          <Skeleton variant="text" width={140} />
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                <Divider sx={{ my: 2 }} />
                <Box>
                  <Skeleton variant="text" width={140} sx={{ mb: 1 }} />
                  <Skeleton
                    variant="rectangular"
                    height={60}
                    sx={{ borderRadius: 1 }}
                  />
                </Box>
              </CardContent>
            </Card>

            {/* Guest Info */}
            <Card elevation={0} sx={cardSx}>
              <CardContent sx={{ p: 3 }}>
                <Skeleton
                  variant="text"
                  width={160}
                  height={40}
                  sx={{ mb: 2 }}
                />

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Skeleton variant="circular" width={60} height={60} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="70%" height={32} />
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 0.5,
                      }}
                    >
                      <Mail size={16} color="#666" />
                      <Skeleton variant="text" width={200} />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 0.5,
                      }}
                    >
                      <Phone size={16} color="#666" />
                      <Skeleton variant="text" width={160} />
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Host Info */}
            <Card elevation={0} sx={cardSx}>
              <CardContent sx={{ p: 3 }}>
                <Skeleton
                  variant="text"
                  width={180}
                  height={40}
                  sx={{ mb: 2 }}
                />

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Skeleton variant="circular" width={60} height={60} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="70%" height={32} />
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 0.5,
                      }}
                    >
                      <Mail size={16} color="#666" />
                      <Skeleton variant="text" width={200} />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 0.5,
                      }}
                    >
                      <Phone size={16} color="#666" />
                      <Skeleton variant="text" width={160} />
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* ==================== CỘT PHẢI (5/12) ==================== */}
          <Grid size={{ xs: 12, lg: 5 }}>
            {/* Price Breakdown */}
            <Card
              elevation={0}
              sx={{
                mb: 3,
                border: `2px solid ${theme.palette.primary.main}`,
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <Box sx={{ bgcolor: "primary.main", p: 2.5 }}>
                <Skeleton
                  variant="text"
                  width="60%"
                  height={40}
                  sx={{ bgcolor: "rgba(255,255,255,0.2)" }}
                />
              </Box>

              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2}>
                  {[1, 2, 3, 4].map((i) => (
                    <Box
                      key={i}
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Box>
                        <Skeleton variant="text" width={i === 1 ? 120 : 100} />
                        {i === 1 && <Skeleton variant="text" width={140} />}
                      </Box>
                      <Skeleton variant="text" width={100} />
                    </Box>
                  ))}

                  {/* Discount Section */}
                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: alpha(theme.palette.success.main, 0.1),
                      borderRadius: "4px",
                    }}
                  >
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Skeleton variant="text" width={100} />
                      <Skeleton variant="text" width={120} />
                    </Box>
                    <Box sx={{ mt: 1, pl: 1 }}>
                      <Skeleton variant="text" width={140} />
                      <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                        <Chip label={<Skeleton width={80} />} size="small" />
                        <Chip label={<Skeleton width={70} />} size="small" />
                      </Stack>
                    </Box>
                  </Box>

                  <Divider />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      p: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      borderRadius: "4px",
                    }}
                  >
                    <Skeleton variant="text" width={100} />
                    <Skeleton variant="text" width={160} />
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Payment History */}
            <Card elevation={0} sx={cardSx}>
              <CardContent sx={{ p: 3 }}>
                <Skeleton
                  variant="text"
                  width={180}
                  height={40}
                  sx={{ mb: 2 }}
                />

                <Stack spacing={2}>
                  {[1, 2].map((i) => (
                    <Box
                      key={i}
                      sx={{
                        p: 2,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: "4px",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Skeleton variant="text" width={140} />
                        <Chip label={<Skeleton width={90} />} size="small" />
                      </Box>
                      <Skeleton variant="text" width={180} />
                      <Skeleton variant="text" width={140} />
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default MyBookingDetailPageSkeleton;
