// src/components/skeletons/HostDashboardSkeleton.tsx
import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
  Divider,
} from "@mui/material";

export const HostDashboardSkeleton = () => {
  return (
    <Box sx={{ px: 2 }}>
      {/* Header */}
      {/* <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Skeleton variant="text" width={320} height={64} />
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Skeleton
              variant="rectangular"
              width={160}
              height={40}
              sx={{ borderRadius: 2 }}
            />
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="circular" width={40} height={40} />
          </Box>
        </Box>
        <Skeleton variant="rectangular" height={4} sx={{ borderRadius: 2 }} />
      </Box> */}

      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[1, 2, 3, 4].map((i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 3, height: 160 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <Skeleton variant="circular" width={48} height={48} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="75%" height={28} />
                  <Skeleton variant="text" width="60%" height={20} />
                </Box>
              </Box>
              <Skeleton variant="text" width="70%" height={48} sx={{ mt: 2 }} />
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Revenue Chart + Summary */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3, height: 460 }}>
            <Skeleton variant="text" width={240} height={36} sx={{ mb: 3 }} />
            <Skeleton
              variant="rectangular"
              height={340}
              sx={{ borderRadius: 2 }}
            />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, height: 460 }}>
            <Skeleton variant="text" width={200} height={36} sx={{ mb: 3 }} />
            {[1, 2, 3].map((i) => (
              <Box key={i} sx={{ mb: 3 }}>
                <Skeleton variant="text" width="80%" height={20} />
                <Skeleton
                  variant="text"
                  width="70%"
                  height={40}
                  sx={{ mt: 1 }}
                />
                {i < 3 && <Divider sx={{ my: 2 }} />}
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>

      {/* Pie + Line Chart */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[1, 2].map((i) => (
          <Grid key={i} size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3, height: 440 }}>
              <Skeleton variant="text" width={220} height={36} sx={{ mb: 3 }} />
              <Skeleton
                variant="rectangular"
                height={320}
                sx={{ borderRadius: 2 }}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Booking Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[1, 2, 3, 4].map((i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 3, textAlign: "center", height: 190 }}>
              <Skeleton
                variant="circular"
                width={48}
                height={48}
                sx={{ mx: "auto", mb: 2 }}
              />
              <Skeleton
                variant="text"
                width="70%"
                height={48}
                sx={{ mx: "auto" }}
              />
              <Skeleton
                variant="text"
                width="60%"
                height={20}
                sx={{ mx: "auto", mt: 1 }}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Booking Status Breakdown */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3, height: 420 }}>
            <Skeleton variant="text" width={200} height={36} sx={{ mb: 3 }} />
            <Skeleton
              variant="rectangular"
              height={300}
              sx={{ borderRadius: 2 }}
            />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 3, height: 420 }}>
            <Skeleton variant="text" width={240} height={36} sx={{ mb: 3 }} />
            {[1, 2, 3, 4].map((i) => (
              <Box key={i} sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Skeleton variant="text" width={100} />
                  <Skeleton variant="text" width={60} />
                </Box>
                <Skeleton
                  variant="rectangular"
                  height={8}
                  sx={{ borderRadius: 1 }}
                />
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>

      {/* Review Summary + Criteria */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, textAlign: "center", height: 440 }}>
            <Skeleton
              variant="circular"
              width={80}
              height={80}
              sx={{ mx: "auto", mb: 2 }}
            />
            <Skeleton
              variant="text"
              width={100}
              height={64}
              sx={{ mx: "auto" }}
            />
            <Skeleton
              variant="rectangular"
              height={60}
              width="80%"
              sx={{ mx: "auto", my: 3, borderRadius: 2 }}
            />
            <Skeleton
              variant="text"
              width={140}
              height={32}
              sx={{ mx: "auto" }}
            />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3, height: 440 }}>
            <Skeleton variant="text" width={260} height={36} sx={{ mb: 3 }} />
            {[1, 2, 3, 4, 5].map((i) => (
              <Box key={i} sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Skeleton variant="text" width={120} />
                  <Skeleton variant="text" width={80} />
                </Box>
                <Skeleton
                  variant="rectangular"
                  height={8}
                  sx={{ borderRadius: 1 }}
                />
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>

      {/* Rating Distribution */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 3, height: 420 }}>
            <Skeleton variant="text" width={220} height={36} sx={{ mb: 3 }} />
            <Skeleton
              variant="rectangular"
              height={300}
              sx={{ borderRadius: 2 }}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Homestay Performance Table */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Skeleton variant="text" width={280} height={40} sx={{ mb: 3 }} />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {[
                  "Homestay",
                  "Lượt xem",
                  "Booking",
                  "Đánh giá",
                  "Lấp đầy",
                  "Doanh thu",
                ].map((h) => (
                  <TableCell key={h}>
                    <Skeleton variant="text" width={90} />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {[1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton variant="text" width={180} />
                  </TableCell>
                  <TableCell align="center">
                    <Skeleton variant="text" width={70} />
                  </TableCell>
                  <TableCell align="center">
                    <Skeleton variant="text" width={70} />
                  </TableCell>
                  <TableCell align="center">
                    <Skeleton variant="text" width={100} />
                  </TableCell>
                  <TableCell align="center">
                    <Skeleton variant="text" width={80} />
                  </TableCell>
                  <TableCell align="right">
                    <Skeleton variant="text" width={120} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Top Guests + Upcoming Bookings */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[1, 2].map((i) => (
          <Grid key={i} size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3 }}>
              <Skeleton variant="text" width={240} height={40} sx={{ mb: 3 }} />
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      {[1, 2, 3].map((j) => (
                        <TableCell key={j}>
                          <Skeleton variant="text" width={80} />
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[1, 2, 3, 4].map((k) => (
                      <TableRow key={k}>
                        <TableCell>
                          <Skeleton variant="text" width={140} />
                        </TableCell>
                        <TableCell align="center">
                          <Skeleton variant="text" width={60} />
                        </TableCell>
                        <TableCell align="right">
                          <Skeleton variant="text" width={100} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Recent Reviews */}
      <Paper sx={{ p: 3 }}>
        <Skeleton variant="text" width={260} height={40} sx={{ mb: 3 }} />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {["Khách", "Homestay", "Rating", "Bình luận", "Thời gian"].map(
                  (h) => (
                    <TableCell key={h}>
                      <Skeleton variant="text" width={90} />
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {[1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton variant="text" width={120} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={160} />
                  </TableCell>
                  <TableCell align="center">
                    <Skeleton variant="rectangular" width={100} height={24} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={200} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={80} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};
