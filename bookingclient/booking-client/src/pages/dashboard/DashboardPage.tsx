// pages/admin/Dashboard.tsx
import { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Divider,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Rating,
  IconButton,
  Tooltip,
  ListItemIcon,
  ListItemText,
  Menu,
} from "@mui/material";
import {
  People,
  Home,
  CalendarMonth,
  AttachMoney,
  Star,
  TrendingUp,
} from "@mui/icons-material";
import { StatCard } from "@/components/dashboard/StatCard";
import { LineChartCard } from "@/components/dashboard/charts/LineChartCard";
import { BarChartCard } from "@/components/dashboard/charts/BarChartCard";
import {
  useGetDashboardOverviewQuery,
  useGetUserStatisticsQuery,
  useGetBookingStatisticsQuery,
  useGetRevenueStatisticsQuery,
  useGetReviewStatisticsQuery,
  useLazyExportAdminDashboardQuery,
} from "@/services/endpoints/dashboard.api";
import { PieChartCard } from "@/components/dashboard/charts/PieChartCard ";
import { downloadFile } from "@/utils/downloadFile";
import { useToast } from "@/hooks/useToast";
import {
  CalendarDays,
  CheckCircle2,
  DownloadCloud,
  FileDown,
  FileSpreadsheet,
  FileText,
  Loader2,
  Percent,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { DashboardSkeleton } from "./DashboardSkeleton";

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState(12);
  const toast = useToast();

  // Fetch all dashboard data
  const {
    data: overviewData,
    isLoading: overviewLoading,
    error: overviewError,
    refetch: refetchOverview,
  } = useGetDashboardOverviewQuery({ months: timeRange });

  const {
    data: userStatsData,
    isLoading: userStatsLoading,
    refetch: refetchUserStats,
  } = useGetUserStatisticsQuery({});

  const {
    data: bookingStatsData,
    isLoading: bookingStatsLoading,
    refetch: refetchBookingStats,
  } = useGetBookingStatisticsQuery({ months: timeRange });

  const {
    data: revenueStatsData,
    isLoading: revenueStatsLoading,
    refetch: refetchRevenueStats,
  } = useGetRevenueStatisticsQuery({ months: timeRange });

  const {
    data: reviewStatsData,
    isLoading: reviewStatsLoading,
    refetch: refetchReviewStats,
  } = useGetReviewStatisticsQuery({ months: 6 });

  const overview = overviewData?.data;
  const userStats = userStatsData?.data;
  const bookingStats = bookingStatsData?.data;
  const revenueStats = revenueStatsData?.data;
  const reviewStats = reviewStatsData?.data;

  const isLoading =
    overviewLoading ||
    userStatsLoading ||
    bookingStatsLoading ||
    revenueStatsLoading ||
    reviewStatsLoading;

  const handleRefresh = () => {
    refetchOverview();
    refetchUserStats();
    refetchBookingStats();
    refetchRevenueStats();
    refetchReviewStats();
  };

  const [triggerExport] = useLazyExportAdminDashboardQuery();
  const [isExporting, setIsExporting] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleExportClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleExport = async (format: "excel" | "pdf" | "csv") => {
    handleCloseMenu();
    setIsExporting(true);
    try {
      const blob = await triggerExport({ format, months: timeRange }).unwrap();

      const dateStr = new Date().toISOString().split("T")[0];
      const filenames = {
        excel: `Admin_Dashboard_${dateStr}.xlsx`,
        pdf: `Admin_Dashboard_${dateStr}.pdf`,
        csv: `Admin_Dashboard_${dateStr}.csv`,
      };

      downloadFile(blob, filenames[format]);
      toast.success(
        `Đã xuất dashboard thành công dưới định dạng ${format.toUpperCase()}`
      );
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Xuất dashboard thất bại. Vui lòng thử lại.");
    } finally {
      setIsExporting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  if (overviewError) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error">
          Có lỗi xảy ra khi tải dữ liệu dashboard. Vui lòng thử lại sau.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h2" sx={{ fontWeight: 600 }}>
            Dashboard
          </Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Khoảng thời gian</InputLabel>
              <Select
                value={timeRange}
                label="Khoảng thời gian"
                onChange={(e) => setTimeRange(Number(e.target.value))}
              >
                <MenuItem value={3}>3 tháng</MenuItem>
                <MenuItem value={6}>6 tháng</MenuItem>
                <MenuItem value={12}>12 tháng</MenuItem>
                <MenuItem value={24}>24 tháng</MenuItem>
              </Select>
            </FormControl>
            <Tooltip title="Làm mới">
              <IconButton onClick={handleRefresh} color="primary">
                <RefreshCw size={20} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Xuất dữ liệu">
              <IconButton onClick={handleExportClick} disabled={isExporting}>
                {isExporting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <DownloadCloud size={20} />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Divider />
      </Box>

      {/* Export Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        PaperProps={{
          elevation: 8,
          sx: {
            mt: 1,
            minWidth: 200,
            "& .MuiMenuItem-root": { py: 1.5 },
          },
        }}
      >
        <MenuItem onClick={() => handleExport("excel")} disabled={isExporting}>
          <ListItemIcon>
            <FileSpreadsheet size={18} className="text-green-600" />
          </ListItemIcon>
          <ListItemText primary="Excel (.xlsx)" />
        </MenuItem>

        <MenuItem onClick={() => handleExport("pdf")} disabled={isExporting}>
          <ListItemIcon>
            <FileText size={18} className="text-red-600" />
          </ListItemIcon>
          <ListItemText primary="PDF (.pdf)" />
        </MenuItem>

        <MenuItem onClick={() => handleExport("csv")} disabled={isExporting}>
          <ListItemIcon>
            <FileDown size={18} className="text-blue-600" />
          </ListItemIcon>
          <ListItemText primary="CSV (.csv)" />
        </MenuItem>
      </Menu>

      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <>
          {/* Overview Stats */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title="Tổng số người dùng"
                value={formatNumber(overview?.totalUsers || 0)}
                subtitle={`${
                  overview?.userGrowth.currentMonth || 0
                } người mới tháng này`}
                icon={<People fontSize="large" />}
                trend={{
                  value: overview?.userGrowth.growthPercentage || 0,
                  isPositive: (overview?.userGrowth.growthPercentage || 0) > 0,
                }}
                color="primary"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title="Tổng số Host"
                value={formatNumber(overview?.totalHosts || 0)}
                subtitle={`${
                  overview?.hostGrowth.currentMonth || 0
                } host mới tháng này`}
                icon={<Home fontSize="large" />}
                trend={{
                  value: overview?.hostGrowth.growthPercentage || 0,
                  isPositive: (overview?.hostGrowth.growthPercentage || 0) > 0,
                }}
                color="success"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title="Tổng số Homestay"
                value={formatNumber(overview?.totalHomestays || 0)}
                subtitle={`${overview?.activeHomestays || 0} đang hoạt động`}
                icon={<CalendarMonth fontSize="large" />}
                trend={{
                  value: overview?.homestayGrowth.growthPercentage || 0,
                  isPositive:
                    (overview?.homestayGrowth.growthPercentage || 0) > 0,
                }}
                color="warning"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title="Doanh thu tháng này"
                value={formatCurrency(revenueStats?.monthlyRevenue || 0)}
                subtitle="So với tháng trước"
                icon={<AttachMoney fontSize="large" />}
                color="error"
              />
            </Grid>
          </Grid>

          {/* Growth Trends */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <LineChartCard
                title="Tăng trưởng người dùng"
                labels={
                  overview?.userGrowth.monthlyData.map((d) => d.month) || []
                }
                datasets={[
                  {
                    label: "Người dùng mới",
                    data:
                      overview?.userGrowth.monthlyData.map((d) => d.value) ||
                      [],
                    borderColor: "rgb(75, 192, 192)",
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    fill: true,
                  },
                ]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <LineChartCard
                title="Tăng trưởng Host & Homestay"
                labels={
                  overview?.hostGrowth.monthlyData.map((d) => d.month) || []
                }
                datasets={[
                  {
                    label: "Host mới",
                    data:
                      overview?.hostGrowth.monthlyData.map((d) => d.value) ||
                      [],
                    borderColor: "rgb(255, 99, 132)",
                    backgroundColor: "rgba(255, 99, 132, 0.2)",
                    fill: true,
                  },
                  {
                    label: "Homestay mới",
                    data:
                      overview?.homestayGrowth.monthlyData.map(
                        (d) => d.value
                      ) || [],
                    borderColor: "rgb(54, 162, 235)",
                    backgroundColor: "rgba(54, 162, 235, 0.2)",
                    fill: true,
                  },
                ]}
              />
            </Grid>
          </Grid>

          {/* User Statistics */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, md: 8 }}>
              <BarChartCard
                title="Người dùng theo khu vực"
                labels={userStats?.usersByRegion.map((r) => r.region) || []}
                datasets={[
                  {
                    label: "Tổng người dùng",
                    data:
                      userStats?.usersByRegion.map((r) => r.userCount) || [],
                    backgroundColor: "rgba(54, 162, 235, 0.6)",
                  },
                  {
                    label: "Host",
                    data:
                      userStats?.usersByRegion.map((r) => r.hostCount) || [],
                    backgroundColor: "rgba(255, 99, 132, 0.6)",
                  },
                ]}
                horizontal
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper sx={{ p: 3, height: "100%" }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Thống kê hoạt động
                </Typography>
                <Box sx={{ mt: 3 }}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Người dùng hoạt động hàng ngày
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                      {formatNumber(userStats?.dailyActiveUsers || 0)}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Người dùng hoạt động hàng tháng
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                      {formatNumber(userStats?.monthlyActiveUsers || 0)}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Host đang hoạt động
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                      {formatNumber(userStats?.activeHosts || 0)}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Tỷ lệ chuyển đổi User → Host
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 1,
                      }}
                    >
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        {userStats?.userToHostConversionRate.toFixed(2)}%
                      </Typography>
                      <TrendingUp color="success" />
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Booking Statistics */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <PieChartCard
                title="Trạng thái đặt phòng"
                labels={[
                  "Hoàn thành",
                  "Chờ xác nhận",
                  "Đã xác nhận",
                  "Đã hủy",
                  "Check-in",
                  "Từ chối",
                ]}
                data={[
                  bookingStats?.statusBreakdown?.completed || 0,
                  bookingStats?.statusBreakdown?.pending || 0,
                  bookingStats?.statusBreakdown?.confirmed || 0,
                  bookingStats?.statusBreakdown?.cancelled || 0,
                  bookingStats?.statusBreakdown?.checkedIn || 0,
                  bookingStats?.statusBreakdown?.rejected || 0,
                ]}
                backgroundColor={[
                  "rgba(75, 192, 192, 0.6)",
                  "rgba(255, 206, 86, 0.6)",
                  "rgba(54, 162, 235, 0.6)",
                  "rgba(255, 99, 132, 0.6)",
                  "rgba(153, 102, 255, 0.6)",
                  "rgba(255, 159, 64, 0.6)",
                ]}
                type="doughnut"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <LineChartCard
                title="Xu hướng đặt phòng theo tháng"
                labels={bookingStats?.monthlyBookings.map((b) => b.month) || []}
                datasets={[
                  {
                    label: "Tổng booking",
                    data:
                      bookingStats?.monthlyBookings.map(
                        (b) => b.totalBookings
                      ) || [],
                    borderColor: "rgb(54, 162, 235)",
                    backgroundColor: "rgba(54, 162, 235, 0.2)",
                    fill: true,
                  },
                  {
                    label: "Hoàn thành",
                    data:
                      bookingStats?.monthlyBookings.map((b) => b.completed) ||
                      [],
                    borderColor: "rgb(75, 192, 192)",
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    fill: true,
                  },
                  {
                    label: "Đã hủy",
                    data:
                      bookingStats?.monthlyBookings.map((b) => b.cancelled) ||
                      [],
                    borderColor: "rgb(255, 99, 132)",
                    backgroundColor: "rgba(255, 99, 132, 0.2)",
                    fill: true,
                  },
                ]}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Card 1 - Tổng số booking */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  transition: "all 0.2s",
                  "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
                }}
              >
                <CalendarDays size={40} color="#1976d2" strokeWidth={2} />
                <Typography variant="h4" fontWeight={700} mt={2}>
                  {formatNumber(bookingStats?.totalBookings || 0)}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Tổng số booking
                </Typography>
              </Paper>
            </Grid>

            {/* Card 2 - Tỷ lệ lấp đầy */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  transition: "all 0.2s",
                  "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
                }}
              >
                <Percent size={40} color="#2e7d32" strokeWidth={2} />
                <Typography
                  variant="h4"
                  fontWeight={700}
                  color="success.main"
                  mt={2}
                >
                  {bookingStats?.occupancyRate?.toFixed(1) ?? 0}%
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Tỷ lệ lấp đầy
                </Typography>
              </Paper>
            </Grid>

            {/* Card 3 - Booking hoàn thành */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  transition: "all 0.2s",
                  "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
                }}
              >
                <CheckCircle2 size={40} color="#0288d1" strokeWidth={2} />
                <Typography
                  variant="h4"
                  fontWeight={700}
                  color="info.main"
                  mt={2}
                >
                  {formatNumber(bookingStats?.completedBookings || 0)}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Booking hoàn thành
                </Typography>
              </Paper>
            </Grid>

            {/* Card 4 - Booking đã hủy */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  transition: "all 0.2s",
                  "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
                }}
              >
                <XCircle size={40} color="#d32f2f" strokeWidth={2} />
                <Typography
                  variant="h4"
                  fontWeight={700}
                  color="error.main"
                  mt={2}
                >
                  {formatNumber(bookingStats?.cancelledBookings || 0)}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Booking đã hủy
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Revenue Statistics */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, md: 8 }}>
              <BarChartCard
                title="Doanh thu theo tháng"
                labels={
                  revenueStats?.monthlyRevenueData.map((r) => r.month) || []
                }
                datasets={[
                  {
                    label: "Doanh thu (VNĐ)",
                    data:
                      revenueStats?.monthlyRevenueData.map((r) => r.revenue) ||
                      [],
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                    borderColor: "rgb(75, 192, 192)",
                  },
                ]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper sx={{ p: 3, height: "100%" }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Tổng quan doanh thu
                </Typography>
                <Box sx={{ mt: 3 }}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Tổng doanh thu
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 700, mt: 1, color: "success.main" }}
                    >
                      {formatCurrency(revenueStats?.totalRevenue || 0)}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Doanh thu năm nay
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>
                      {formatCurrency(revenueStats?.yearlyRevenue || 0)}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      TB doanh thu/booking
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>
                      {formatCurrency(
                        revenueStats?.averageRevenuePerBooking || 0
                      )}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Tổng hoàn tiền
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, mt: 1, color: "error.main" }}
                    >
                      {formatCurrency(revenueStats?.refundAmount || 0)}
                    </Typography>
                    <Chip
                      label={`${revenueStats?.refundRate.toFixed(
                        2
                      )}% tỷ lệ hoàn tiền`}
                      size="small"
                      color="error"
                      variant="outlined"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Revenue Breakdown */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <PieChartCard
                title="Phân bổ doanh thu"
                labels={["Giá phòng", "Phí dịch vụ", "Phí dọn dẹp", "Thuế"]}
                data={[
                  revenueStats?.revenueBreakdown.baseAmount || 0,
                  revenueStats?.revenueBreakdown.serviceFee || 0,
                  revenueStats?.revenueBreakdown.cleaningFee || 0,
                  revenueStats?.revenueBreakdown.taxAmount || 0,
                ]}
                backgroundColor={[
                  "rgba(54, 162, 235, 0.6)",
                  "rgba(255, 206, 86, 0.6)",
                  "rgba(75, 192, 192, 0.6)",
                  "rgba(153, 102, 255, 0.6)",
                ]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <PieChartCard
                title="Phương thức thanh toán"
                labels={
                  revenueStats?.paymentMethodStats.map(
                    (p) => p.paymentMethod
                  ) || []
                }
                data={
                  revenueStats?.paymentMethodStats.map((p) => p.totalAmount) ||
                  []
                }
              />
            </Grid>
          </Grid>

          {/* Top Homestays Table */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12 }}>
              <Paper>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Top 10 Homestay phổ biến
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>STT</TableCell>
                          <TableCell>Tên homestay</TableCell>
                          <TableCell>Thành phố</TableCell>
                          <TableCell align="center">Số booking</TableCell>
                          <TableCell align="center">Đánh giá TB</TableCell>
                          <TableCell align="right">Doanh thu</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {bookingStats?.topHomestays.map((homestay, index) => (
                          <TableRow key={homestay.homestayId} hover>
                            <TableCell>
                              <Chip
                                label={index + 1}
                                size="small"
                                color={index < 3 ? "primary" : "default"}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 500 }}
                              >
                                {homestay.homestayTitle}
                              </Typography>
                            </TableCell>
                            <TableCell>{homestay.city}</TableCell>
                            <TableCell align="center">
                              <Chip
                                label={formatNumber(homestay.bookingCount)}
                                size="small"
                                color="info"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: 0.5,
                                }}
                              >
                                <Star
                                  sx={{ fontSize: 18, color: "warning.main" }}
                                />
                                <Typography variant="body2">
                                  {homestay.averageRating.toFixed(1)}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 600, color: "success.main" }}
                              >
                                {formatCurrency(homestay.totalRevenue)}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Review Statistics */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper sx={{ p: 3, textAlign: "center", height: "100%" }}>
                <Star sx={{ fontSize: 50, color: "warning.main", mb: 2 }} />
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {reviewStats?.averageRating.toFixed(1)}
                </Typography>
                <Rating
                  value={reviewStats?.averageRating || 0}
                  readOnly
                  precision={0.1}
                  size="large"
                  sx={{ mb: 2 }}
                />
                <Typography variant="body2" color="text.secondary">
                  Đánh giá trung bình
                </Typography>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  {formatNumber(reviewStats?.totalReviews || 0)} đánh giá
                </Typography>
                <Chip
                  label={`${
                    reviewStats?.newReviewsThisMonth || 0
                  } đánh giá mới tháng này`}
                  size="small"
                  color="primary"
                  sx={{ mt: 1 }}
                />
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <BarChartCard
                title="Phân bố đánh giá"
                labels={["5 sao", "4 sao", "3 sao", "2 sao", "1 sao"]}
                datasets={[
                  {
                    label: "Số lượng",
                    data: [
                      reviewStats?.ratingDistribution.fiveStar || 0,
                      reviewStats?.ratingDistribution.fourStar || 0,
                      reviewStats?.ratingDistribution.threeStar || 0,
                      reviewStats?.ratingDistribution.twoStar || 0,
                      reviewStats?.ratingDistribution.oneStar || 0,
                    ],
                    backgroundColor: [
                      "rgba(75, 192, 192, 0.6)",
                      "rgba(54, 162, 235, 0.6)",
                      "rgba(255, 206, 86, 0.6)",
                      "rgba(255, 159, 64, 0.6)",
                      "rgba(255, 99, 132, 0.6)",
                    ],
                  },
                ]}
                horizontal
              />
            </Grid>
          </Grid>

          {/* Top & Low Rated Homestays */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Top homestay đánh giá cao
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Homestay</TableCell>
                          <TableCell>Host</TableCell>
                          <TableCell align="center">Đánh giá</TableCell>
                          <TableCell align="center">Reviews</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {reviewStats?.topRatedHomestays.map((homestay) => (
                          <TableRow key={homestay.homestayId} hover>
                            <TableCell>
                              <Typography variant="body2" noWrap>
                                {homestay.homestayTitle}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" noWrap>
                                {homestay.hostName}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: 0.5,
                                }}
                              >
                                <Star
                                  sx={{ fontSize: 16, color: "warning.main" }}
                                />
                                <Typography variant="body2">
                                  {homestay.averageRating.toFixed(1)}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              {homestay.reviewCount}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Homestay cần cải thiện
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Homestay</TableCell>
                          <TableCell>Host</TableCell>
                          <TableCell align="center">Đánh giá</TableCell>
                          <TableCell align="center">Reviews</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {reviewStats?.lowRatedHomestays.map((homestay) => (
                          <TableRow key={homestay.homestayId} hover>
                            <TableCell>
                              <Typography variant="body2" noWrap>
                                {homestay.homestayTitle}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" noWrap>
                                {homestay.hostName}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: 0.5,
                                }}
                              >
                                <Star
                                  sx={{ fontSize: 16, color: "error.main" }}
                                />
                                <Typography
                                  variant="body2"
                                  sx={{ color: "error.main" }}
                                >
                                  {homestay.averageRating.toFixed(1)}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              {homestay.reviewCount}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Recent Reviews */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Paper>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Đánh giá gần đây
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Khách</TableCell>
                          <TableCell>Homestay</TableCell>
                          <TableCell align="center">Rating</TableCell>
                          <TableCell>Bình luận</TableCell>
                          <TableCell>Thời gian</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {reviewStats?.recentReviews.map((review) => (
                          <TableRow key={review.reviewId} hover>
                            <TableCell>
                              <Typography variant="body2">
                                {review.guestName}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" noWrap>
                                {review.homestayTitle}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Rating
                                value={review.rating}
                                readOnly
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                sx={{
                                  maxWidth: 300,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {review.comment || "Không có bình luận"}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {new Date(review.createdAt).toLocaleDateString(
                                  "vi-VN"
                                )}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
};

export default Dashboard;
