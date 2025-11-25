/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Box,
  Container,
  Paper,
  Grid,
  Divider,
  Card,
  CardContent,
  Skeleton,
  Chip,
  Alert,
} from "@mui/material";
import { Tag, Clock } from "lucide-react";

const colors = {
  primary: "#006ce4",
};

const PaymentPageSkeleton = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Tiêu đề */}
      <Skeleton variant="text" width={300} height={60} sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        {/* Cột trái: Thông tin đặt phòng + Phương thức */}
        <Grid size={{ xs: 12, md: 8 }}>
          {/* Thông tin đặt phòng */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: "4px" }}>
            <Skeleton variant="text" width={200} height={40} sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              {/* Homestay */}
              <Grid size={12}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Box flex={1}>
                    <Skeleton variant="text" width="60%" height={24} />
                    <Skeleton variant="text" width="80%" height={20} />
                    <Skeleton variant="text" width="70%" height={20} />
                  </Box>
                </Box>
              </Grid>

              <Grid size={12}>
                <Divider />
              </Grid>

              {/* Các dòng thông tin */}
              {[1, 2, 3, 4, 5].map((i) => (
                <Grid size={{ xs: 12, sm: 6 }} key={i}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Skeleton variant="circular" width={36} height={36} />
                    <Box flex={1}>
                      <Skeleton variant="text" width="50%" height={20} />
                      <Skeleton variant="text" width="70%" height={28} />
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* Phương thức thanh toán */}
          <Paper sx={{ p: 3, borderRadius: "4px" }}>
            <Skeleton variant="text" width={220} height={40} sx={{ mb: 3 }} />

            {/* 3 phương thức */}
            {[1, 2, 3].map((i) => (
              <Card
                key={i}
                sx={{ mb: 2, p: 2, border: "2px solid transparent" }}
              >
                <CardContent sx={{ py: 1.5 }}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Skeleton variant="rectangular" width={24} height={24} />
                    <Skeleton variant="circular" width={40} height={40} />
                    <Box flex={1}>
                      <Skeleton variant="text" width="40%" height={28} />
                      <Skeleton variant="text" width="80%" height={20} />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}

            {/* Ghi chú */}
            <Box sx={{ mt: 3 }}>
              <Skeleton variant="text" width="100%" height={100} />
            </Box>

            {/* Alert VNPay */}
            <Box sx={{ mt: 3 }}>
              <Alert severity="info" sx={{ borderRadius: "4px" }}>
                <Skeleton variant="text" width="100%" height={20} />
                <Skeleton variant="text" width="90%" height={20} />
                <Skeleton variant="text" width="95%" height={20} />
              </Alert>
            </Box>

            {/* Nút */}
            <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
              <Skeleton variant="rectangular" width="50%" height={48} />
              <Skeleton variant="rectangular" width="50%" height={48} />
            </Box>
          </Paper>
        </Grid>

        {/* Cột phải: Tóm tắt thanh toán */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            sx={{
              p: 3,
              position: "sticky",
              top: 20,
              borderRadius: "4px",
              backgroundColor: "#fafafa",
            }}
          >
            {/* Mã giảm giá */}
            <Box sx={{ mb: 3, pb: 3, borderBottom: "1px solid #e0e0e0" }}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Skeleton variant="text" width={100} height={32} />
              </Box>

              <Box display="flex" gap={1} mb={2}>
                <Skeleton variant="rectangular" width="70%" height={40} />
                <Skeleton variant="rectangular" width="30%" height={40} />
              </Box>

              {/* Đã áp dụng */}
              <Box>
                <Skeleton
                  variant="text"
                  width={120}
                  height={20}
                  sx={{ mb: 1 }}
                />
                {[1, 2].map((i) => (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: "#e8f5e9",
                      borderRadius: "4px",
                      px: 1.5,
                      py: 1,
                      mb: 1,
                    }}
                  >
                    <Box flex={1}>
                      <Skeleton variant="text" width="50%" height={24} />
                      <Skeleton variant="text" width="60%" height={18} />
                    </Box>
                    <Skeleton variant="text" width={80} height={24} />
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Chi tiết thanh toán */}
            <Skeleton variant="text" width={160} height={40} sx={{ mb: 3 }} />

            <Box sx={{ mb: 3 }}>
              {[1, 2, 3, 4].map((i) => (
                <Box
                  key={i}
                  display="flex"
                  justifyContent="space-between"
                  sx={{ mb: 1.5 }}
                >
                  <Skeleton variant="text" width="60%" height={20} />
                  <Skeleton variant="text" width="30%" height={24} />
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />

              <Box display="flex" justifyContent="space-between" sx={{ mb: 2 }}>
                <Skeleton variant="text" width="40%" height={32} />
                <Skeleton variant="text" width="50%" height={48} />
              </Box>

              {/* Đã thanh toán */}
              <Box display="flex" justifyContent="space-between" sx={{ mb: 2 }}>
                <Skeleton variant="text" width="50%" height={20} />
                <Skeleton variant="text" width="40%" height={24} />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box display="flex" justifyContent="space-between">
                <Skeleton variant="text" width="40%" height={32} />
                <Skeleton variant="text" width="50%" height={48} />
              </Box>
            </Box>

            {/* Alert thời gian */}
            <Alert
              severity="warning"
              icon={<Clock size={16} />}
              sx={{ borderRadius: "4px" }}
            >
              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton variant="text" width="80%" height={20} />
            </Alert>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PaymentPageSkeleton;
