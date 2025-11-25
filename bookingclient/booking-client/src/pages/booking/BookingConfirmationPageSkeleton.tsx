// src/components/skeleton/BookingConfirmationPageSkeleton.tsx
import {
  Box,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  Skeleton,
  Stack,
  Chip,
  Divider,
  alpha,
} from "@mui/material";
import {
  CheckCircle,
  MapPin,
  Moon,
  Users,
  User,
  Mail,
  Phone,
} from "lucide-react";

const BookingConfirmationPageSkeleton = () => {
  return (
    <Box sx={{ py: 4, bgcolor: "grey.50", minHeight: "100vh" }}>
      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="text" width={320} height={32} />
        </Box>

        {/* Success Header */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 3,
            textAlign: "center",
            border: (t) => `1px solid ${t.palette.divider}`,
            borderRadius: "4px",
          }}
        >
          <CheckCircle size={80} color="#e0e0e0" style={{ marginBottom: 16 }} />
          <Skeleton
            variant="text"
            width="70%"
            height={56}
            sx={{ mx: "auto", mb: 1 }}
          />
          <Skeleton
            variant="text"
            width="60%"
            height={36}
            sx={{ mx: "auto", mb: 3 }}
          />

          <Stack direction="row" spacing={2} justifyContent="center">
            <Chip label={<Skeleton width={120} />} sx={{ py: 2.5 }} />
            <Chip label={<Skeleton width={100} />} sx={{ py: 2.5 }} />
          </Stack>
        </Paper>

        <Grid container spacing={3}>
          {/* ==================== CỘT TRÁI (8/12) ==================== */}
          <Grid size={{ xs: 12, md: 8 }}>
            {/* Homestay Info Card */}
            <Card
              elevation={0}
              sx={{
                mb: 3,
                border: (t) => `1px solid ${t.palette.divider}`,
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              {/* Ảnh homestay */}
              <Skeleton variant="rectangular" height={250} />

              <CardContent sx={{ p: 3 }}>
                <Skeleton
                  variant="text"
                  width={200}
                  height={40}
                  sx={{ mb: 2 }}
                />

                {/* Check-in / Check-out */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    p: 2,
                    bgcolor: (t) => alpha(t.palette.info.main, 0.05),
                    borderRadius: "4px",
                    mb: 3,
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="70%" height={32} />
                    <Skeleton variant="text" width="50%" height={40} />
                    <Skeleton variant="text" width="60%" height={28} />
                  </Box>
                  <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
                  <Box sx={{ flex: 1, textAlign: "right" }}>
                    <Skeleton variant="text" width="70%" height={32} />
                    <Skeleton variant="text" width="50%" height={40} />
                    <Skeleton variant="text" width="60%" height={28} />
                  </Box>
                </Box>

                {/* Nights & Guests */}
                <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                  <Box
                    sx={{
                      flex: 1,
                      p: 2,
                      bgcolor: (t) => alpha(t.palette.success.main, 0.05),
                      borderRadius: "4px",
                      textAlign: "center",
                    }}
                  >
                    <Moon
                      size={28}
                      color="#e0e0e0"
                      style={{ marginBottom: 8 }}
                    />
                    <Skeleton
                      variant="text"
                      width="60%"
                      sx={{ mx: "auto" }}
                      height={40}
                    />
                    <Skeleton variant="text" width="80%" sx={{ mx: "auto" }} />
                  </Box>
                  <Box
                    sx={{
                      flex: 1,
                      p: 2,
                      bgcolor: (t) => alpha(t.palette.primary.main, 0.05),
                      borderRadius: "4px",
                      textAlign: "center",
                    }}
                  >
                    <Users
                      size={28}
                      color="#e0e0e0"
                      style={{ marginBottom: 8 }}
                    />
                    <Skeleton
                      variant="text"
                      width="60%"
                      sx={{ mx: "auto" }}
                      height={40}
                    />
                    <Skeleton variant="text" width="90%" sx={{ mx: "auto" }} />
                  </Box>
                </Box>

                {/* Special Requests (optional) */}
                <Box sx={{ mb: 2 }}>
                  <Skeleton variant="text" width="40%" height={32} />
                  <Skeleton
                    variant="rectangular"
                    height={80}
                    sx={{ borderRadius: 1 }}
                  />
                </Box>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card
              elevation={0}
              sx={{
                mb: 3,
                border: (t) => `1px solid ${t.palette.divider}`,
                borderRadius: "4px",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Skeleton
                  variant="text"
                  width={220}
                  height={40}
                  sx={{ mb: 3 }}
                />

                {/* Người đặt phòng */}
                <Box sx={{ mb: 4 }}>
                  <Skeleton
                    variant="text"
                    width={160}
                    height={36}
                    sx={{ mb: 2 }}
                  />
                  {[1, 2, 3, 4].map((i) => (
                    <Box
                      key={i}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1.5,
                      }}
                    >
                      {i === 1 && <User size={18} color="#666" />}
                      {i === 2 && <Mail size={18} color="#666" />}
                      {i === 3 && <Phone size={18} color="#666" />}
                      {i === 4 && <MapPin size={18} color="#666" />}
                      <Skeleton variant="text" width="70%" />
                    </Box>
                  ))}
                </Box>

                {/* Người ở thực tế (có thể có hoặc không) */}
                <Box>
                  <Skeleton
                    variant="rectangular"
                    height={48}
                    sx={{ mb: 2, borderRadius: 1 }}
                  />
                  <Skeleton
                    variant="text"
                    width={200}
                    height={36}
                    sx={{ mb: 2 }}
                  />
                  {[1, 2, 3].map((i) => (
                    <Box
                      key={i}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1.5,
                      }}
                    >
                      <Skeleton variant="text" width="70%" />
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* Host Information */}
            <Card
              elevation={0}
              sx={{
                border: (t) => `1px solid ${t.palette.divider}`,
                borderRadius: "4px",
              }}
            >
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
                    <Skeleton variant="text" width="80%" />
                    <Skeleton variant="text" width="60%" />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* ==================== CỘT PHẢI (4/12) – Sticky ==================== */}
          <Grid
            size={{ xs: 12, md: 4 }}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              position: "sticky",
              top: 20,
              alignSelf: "start",
            }}
          >
            {/* Price Summary */}
            <Card
              elevation={0}
              sx={{
                border: (t) => `2px solid ${t.palette.primary.main}`,
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
                        {i === 1 && <Skeleton variant="text" width={160} />}
                      </Box>
                      <Skeleton variant="text" width={100} />
                    </Box>
                  ))}

                  {Math.random() > 0.5 && (
                    <Box
                      sx={{
                        p: 1.5,
                        bgcolor: (t) => alpha(t.palette.success.main, 0.1),
                        borderRadius: "4px",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Skeleton variant="text" width={100} />
                        <Skeleton variant="text" width={120} />
                      </Box>
                    </Box>
                  )}

                  <Divider />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      p: 2,
                      bgcolor: (t) => alpha(t.palette.primary.main, 0.08),
                      borderRadius: "4px",
                    }}
                  >
                    <Skeleton variant="text" width={100} />
                    <Skeleton variant="text" width={140} />
                  </Box>

                  <Skeleton
                    variant="rounded"
                    height={56}
                    sx={{ borderRadius: 2 }}
                  />
                  <Skeleton
                    variant="rounded"
                    height={48}
                    sx={{ borderRadius: 2 }}
                  />

                  <Skeleton
                    variant="rectangular"
                    height={80}
                    sx={{ borderRadius: 1 }}
                  />
                </Stack>
              </CardContent>
            </Card>

            {/* Booking Info Card */}
            <Card
              elevation={0}
              sx={{
                border: (t) => `1px solid ${t.palette.divider}`,
                borderRadius: "4px",
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Skeleton
                  variant="text"
                  width={160}
                  height={36}
                  sx={{ mb: 2 }}
                />
                <Stack spacing={1.5}>
                  {[1, 2, 3].map((i) => (
                    <Box
                      key={i}
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Skeleton variant="text" width={80} />
                      {i === 3 ? (
                        <Chip label={<Skeleton width={90} />} />
                      ) : (
                        <Skeleton variant="text" width={120} />
                      )}
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

export default BookingConfirmationPageSkeleton;
