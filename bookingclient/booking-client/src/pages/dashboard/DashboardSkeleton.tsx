// src/components/skeletons/DashboardSkeleton.tsx
import {
  Box,
  Grid,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export const DashboardSkeleton = () => {
  return (
    <Box sx={{ px: { xs: 2, md: 3 }, py: 2 }}>
      {/* Header */}
      {/* <Box sx={{ mb: 5 }}>
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
          <Skeleton variant="rounded" width={320} height={48} />
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Skeleton variant="rounded" width={160} height={40} />
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="circular" width={40} height={40} />
          </Box>
        </Box>
        <Skeleton variant="rounded" height={4} sx={{ borderRadius: 2 }} />
      </Box> */}

      {/* Overview Cards – Đều 160px */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {[1, 2, 3, 4].map((i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: 180,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <Skeleton variant="circular" width={48} height={48} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="75%" height={24} />
                  <Skeleton variant="text" width="55%" height={20} />
                </Box>
              </Box>
              <Skeleton variant="text" width="70%" height={44} sx={{ mt: 1 }} />
              <Skeleton
                variant="rounded"
                width="45%"
                height={8}
                sx={{ mt: 2 }}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Growth Trends – 400px */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {[1, 2].map((i) => (
          <Grid key={i} size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: 450,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <Skeleton variant="text" width={240} height={36} sx={{ mb: 3 }} />
              <Skeleton
                variant="rounded"
                height={320}
                sx={{ borderRadius: 2 }}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* User Stats + Bar Chart */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: 500,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <Skeleton variant="text" width={260} height={36} sx={{ mb: 3 }} />
            <Skeleton variant="rounded" height={380} sx={{ borderRadius: 2 }} />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: 500,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <Skeleton variant="text" width={220} height={36} sx={{ mb: 3 }} />
            {[1, 2, 3, 4].map((i) => (
              <Box key={i} sx={{ mb: 3 }}>
                <Skeleton variant="text" width="85%" height={20} />
                <Skeleton
                  variant="text"
                  width="65%"
                  height={44}
                  sx={{ mt: 1.5 }}
                />
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>

      {/* Booking Pie + Line */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: 460,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <Skeleton variant="text" width={200} height={36} sx={{ mb: 3 }} />
            <Skeleton variant="rounded" height={340} sx={{ borderRadius: 2 }} />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: 460,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <Skeleton variant="text" width={280} height={36} sx={{ mb: 3 }} />
            <Skeleton variant="rounded" height={340} sx={{ borderRadius: 2 }} />
          </Paper>
        </Grid>
      </Grid>

      {/* Booking Stats Cards – Đều 140px */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {[1, 2, 3, 4].map((i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: 200,
                textAlign: "center",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <Skeleton
                variant="circular"
                width={56}
                height={56}
                sx={{ mx: "auto", mb: 2 }}
              />
              <Skeleton
                variant="text"
                width="75%"
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

      {/* Revenue Bar + Summary */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: 500,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <Skeleton variant="text" width={240} height={36} sx={{ mb: 3 }} />
            <Skeleton variant="rounded" height={380} sx={{ borderRadius: 2 }} />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: 550,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <Skeleton variant="text" width={220} height={36} sx={{ mb: 3 }} />
            {[1, 2, 3, 4, 5].map((i) => (
              <Box key={i} sx={{ mb: 3 }}>
                <Skeleton variant="text" width="80%" height={20} />
                <Skeleton
                  variant="text"
                  width="90%"
                  height={38}
                  sx={{ mt: 1 }}
                />
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>

      {/* Revenue Breakdown Pies */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {[1, 2].map((i) => (
          <Grid key={i} size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: 440,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <Skeleton variant="text" width={210} height={36} sx={{ mb: 3 }} />
              <Skeleton
                variant="rounded"
                height={320}
                sx={{ borderRadius: 2 }}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Top Homestays Table */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 5,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
        <Skeleton variant="rounded" width={320} height={40} sx={{ mb: 3 }} />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {[
                  "STT",
                  "Tên homestay",
                  "Thành phố",
                  "Booking",
                  "Đánh giá",
                  "Doanh thu",
                ].map((h) => (
                  <TableCell key={h}>
                    <Skeleton variant="text" width={90} height={24} />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton width={40} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={220} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={70} />
                  </TableCell>
                  <TableCell>
                    <Skeleton width={90} />
                  </TableCell>
                  <TableCell align="right">
                    <Skeleton width={130} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Review Summary + Distribution */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              height: 460,
              textAlign: "center",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <Skeleton
              variant="circular"
              width={80}
              height={80}
              sx={{ mx: "auto", mb: 3 }}
            />
            <Skeleton
              variant="text"
              width={120}
              height={64}
              sx={{ mx: "auto" }}
            />
            <Skeleton
              variant="rounded"
              width="85%"
              height={60}
              sx={{ mx: "auto", my: 3 }}
            />
            <Skeleton
              variant="text"
              width={160}
              height={32}
              sx={{ mx: "auto" }}
            />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: 460,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <Skeleton variant="text" width={240} height={36} sx={{ mb: 3 }} />
            <Skeleton variant="rounded" height={340} sx={{ borderRadius: 2 }} />
          </Paper>
        </Grid>
      </Grid>

      {/* Top & Low Rated */}
      <Grid container spacing={3}>
        {[1, 2].map((i) => (
          <Grid key={i} size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <Skeleton
                variant="rounded"
                width={280}
                height={40}
                sx={{ mb: 3 }}
              />
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      {["Homestay", "Host", "Đánh giá", "Reviews"].map((h) => (
                        <TableCell key={h}>
                          <Skeleton width={85} height={24} />
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[1, 2, 3, 4, 5].map((j) => (
                      <TableRow key={j}>
                        <TableCell>
                          <Skeleton width={180} />
                        </TableCell>
                        <TableCell>
                          <Skeleton width={140} />
                        </TableCell>
                        <TableCell align="center">
                          <Skeleton width={80} />
                        </TableCell>
                        <TableCell align="center">
                          <Skeleton width={60} />
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
    </Box>
  );
};
