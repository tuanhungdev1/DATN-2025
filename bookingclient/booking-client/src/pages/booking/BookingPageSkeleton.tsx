// src/components/skeleton/BookingPageSkeleton.tsx
import { Box, Container, Grid, Paper, Skeleton, Stack } from "@mui/material";

const BookingPageSkeleton = () => {
  return (
    <Box sx={{ py: 2 }}>
      <Container maxWidth="lg">
        {/* Breadcrumb */}
        <Box sx={{ py: 2 }}>
          <Skeleton variant="text" width={300} height={32} />
        </Box>

        {/* Tiêu đề trang */}
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="text" width="60%" height={56} />
          <Skeleton variant="text" width="40%" height={32} sx={{ mt: 1 }} />
        </Box>

        <Grid container spacing={4}>
          {/* ==================== CỘT TRÁI (7/12) ==================== */}
          <Grid size={{ xs: 12, lg: 7 }}>
            {/* Card thông tin homestay */}
            <Paper
              elevation={0}
              sx={{
                mb: 3,
                border: (t) => `1px solid ${t.palette.divider}`,
                borderRadius: 1,
                overflow: "hidden",
              }}
            >
              {/* Ảnh chính */}
              <Skeleton variant="rectangular" height={300} />

              <Box sx={{ p: 3 }}>
                <Stack spacing={2}>
                  {/* Tiêu đề + địa chỉ */}
                  <Skeleton variant="text" width="80%" height={40} />
                  <Skeleton variant="text" width="60%" height={28} />

                  {/* Chips */}
                  <Stack direction="row" spacing={2}>
                    <Skeleton variant="rounded" width={100} height={32} />
                    <Skeleton variant="rounded" width={120} height={32} />
                  </Stack>

                  <Skeleton variant="text" width="100%" height={8} />

                  {/* Thông số nhanh */}
                  <Grid container spacing={2}>
                    {[1, 2, 3, 4].map((i) => (
                      <Grid size={{ xs: 6, sm: 3 }} key={i}>
                        <Box sx={{ textAlign: "center" }}>
                          <Skeleton
                            variant="circular"
                            width={56}
                            height={56}
                            sx={{ mx: "auto", mb: 1 }}
                          />
                          <Skeleton
                            variant="text"
                            width="70%"
                            sx={{ mx: "auto" }}
                          />
                          <Skeleton
                            variant="text"
                            width="50%"
                            sx={{ mx: "auto" }}
                          />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>

                  <Skeleton variant="text" width="100%" height={8} />

                  {/* Các tiện ích phụ */}
                  <Grid container spacing={2}>
                    {[1, 2, 3, 4].map((i) => (
                      <Grid size={{ xs: 12, sm: 6 }} key={i}>
                        <Skeleton variant="text" width="90%" height={32} />
                      </Grid>
                    ))}
                  </Grid>
                </Stack>
              </Box>
            </Paper>

            {/* Lịch khả dụng */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }} key={i}>
                    <Skeleton
                      variant="rectangular"
                      height={140}
                      sx={{ borderRadius: 1 }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* Form đặt phòng */}
            <Paper sx={{ p: 3 }}>
              {/* Calendar */}
              <Box sx={{ mb: 4 }}>
                <Skeleton
                  variant="text"
                  width={300}
                  height={40}
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={380}
                    sx={{ borderRadius: 2 }}
                  />
                </Box>
                <Skeleton
                  variant="rectangular"
                  height={100}
                  sx={{ mt: 3, borderRadius: 2 }}
                />
              </Box>

              {/* Số lượng khách */}
              <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
              <Grid container spacing={3}>
                {[1, 2, 3].map((i) => (
                  <Grid size={{ xs: 12, sm: 4 }} key={i}>
                    <Skeleton variant="rectangular" height={56} />
                  </Grid>
                ))}
              </Grid>

              {/* Thông tin khách */}
              <Skeleton variant="text" width={280} height={40} sx={{ my: 3 }} />
              <Grid container spacing={3}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Grid size={{ xs: 12, sm: i <= 2 ? 6 : 12 }} key={i}>
                    <Skeleton variant="rectangular" height={56} />
                  </Grid>
                ))}
              </Grid>

              {/* Yêu cầu đặc biệt */}
              <Skeleton variant="rectangular" height={120} sx={{ mt: 3 }} />

              {/* Nút hành động */}
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ mt: 4 }}
              >
                <Skeleton variant="rounded" width={120} height={48} />
                <Skeleton variant="rounded" width={200} height={48} />
              </Stack>
            </Paper>
          </Grid>

          {/* ==================== CỘT PHẢI (5/12) ==================== */}
          <Grid size={{ xs: 12, lg: 5 }}>
            <Box sx={{ position: "sticky", top: 20 }}>
              {/* Alert trạng thái */}
              <Skeleton
                variant="rectangular"
                height={80}
                sx={{ mb: 3, borderRadius: 1 }}
              />

              {/* Chi tiết giá */}
              <Paper
                sx={{
                  border: (t) => `2px solid ${t.palette.primary.main}`,
                  borderRadius: 1,
                  overflow: "hidden",
                  mb: 3,
                }}
              >
                <Skeleton variant="rectangular" height={60} />
                <Box sx={{ p: 3 }}>
                  <Stack spacing={2.5}>
                    {[1, 2, 3, 4].map((i) => (
                      <Box
                        key={i}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Skeleton variant="text" width="60%" />
                        <Skeleton variant="text" width="30%" />
                      </Box>
                    ))}
                    <Skeleton variant="text" width="100%" height={8} />
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Skeleton variant="text" width="40%" />
                      <Skeleton variant="text" width="50%" />
                    </Box>
                  </Stack>
                </Box>
              </Paper>

              {/* Chính sách */}
              <Paper sx={{ borderRadius: 1, overflow: "hidden", mb: 3 }}>
                <Skeleton variant="rectangular" height={60} />
                <Box sx={{ p: 2 }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton
                      key={i}
                      variant="text"
                      height={40}
                      sx={{ mb: 1 }}
                    />
                  ))}
                </Box>
              </Paper>

              {/* Thông tin chủ nhà */}
              <Paper sx={{ borderRadius: 1 }}>
                <Box sx={{ p: 2.5 }}>
                  <Skeleton
                    variant="text"
                    width={180}
                    height={32}
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Skeleton variant="circular" width={50} height={50} />
                    <Stack sx={{ flex: 1 }}>
                      <Skeleton variant="text" width="70%" />
                      <Skeleton variant="text" width="90%" />
                    </Stack>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default BookingPageSkeleton;
