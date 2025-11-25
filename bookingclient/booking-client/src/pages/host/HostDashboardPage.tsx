/* eslint-disable @typescript-eslint/no-unused-vars */
// pages/host/Dashboard.tsx
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
  LinearProgress,
  Menu,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Home,
  CalendarMonth,
  AttachMoney,
  Star,
  Refresh,
  Visibility,
  CheckCircle,
  Cancel,
  People,
} from "@mui/icons-material";
import { StatCard } from "@/components/dashboard/StatCard";
import { LineChartCard } from "@/components/dashboard/charts/LineChartCard";
import { BarChartCard } from "@/components/dashboard/charts/BarChartCard";
import {
  useGetHostDashboardOverviewQuery,
  useGetHostRevenueStatisticsQuery,
  useGetHostBookingStatisticsQuery,
  useGetHostReviewStatisticsQuery,
  useGetHostPerformanceQuery,
  useLazyExportHostDashboardQuery,
} from "@/services/endpoints/host-dashboard.api";
import { PieChartCard } from "@/components/dashboard/charts/PieChartCard ";
import { downloadFile } from "@/utils/downloadFile";
import { useToast } from "@/hooks/useToast";
import {
  Bed,
  CheckCircle2,
  Clock,
  DownloadCloud,
  FileDown,
  FileSpreadsheet,
  FileText,
  Loader2,
  XCircle,
} from "lucide-react";
import { HostDashboardSkeleton } from "./HostDashboardSkeleton";

const HostDashboard = () => {
  const [timeRange, setTimeRange] = useState(12);
  const toast = useToast();
  // Fetch all dashboard data
  const {
    data: overviewData,
    isLoading: overviewLoading,
    error: overviewError,
    refetch: refetchOverview,
  } = useGetHostDashboardOverviewQuery();

  const {
    data: revenueData,
    isLoading: revenueLoading,
    refetch: refetchRevenue,
  } = useGetHostRevenueStatisticsQuery({ months: timeRange });

  const {
    data: bookingData,
    isLoading: bookingLoading,
    refetch: refetchBooking,
  } = useGetHostBookingStatisticsQuery({ months: timeRange });

  const {
    data: reviewData,
    isLoading: reviewLoading,
    refetch: refetchReview,
  } = useGetHostReviewStatisticsQuery();

  const {
    data: performanceData,
    isLoading: performanceLoading,
    refetch: refetchPerformance,
  } = useGetHostPerformanceQuery({ months: timeRange });

  const [triggerExport, { isFetching: isExporting }] =
    useLazyExportHostDashboardQuery();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleExportClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => setAnchorEl(null);

  const handleExport = async (format: "excel" | "pdf" | "csv") => {
    handleCloseMenu();
    try {
      const blob = await triggerExport({ format, months: timeRange }).unwrap();
      const dateStr = new Date().toISOString().split("T")[0];
      const filenames = {
        excel: `Host_Dashboard_${dateStr}.xlsx`,
        pdf: `Host_Dashboard_${dateStr}.pdf`,
        csv: `Host_Dashboard_${dateStr}.csv`,
      };
      downloadFile(blob, filenames[format]);
      toast.success(`Đã xuất báo cáo thành công (${format.toUpperCase()})`);
    } catch (err) {
      toast.error("Xuất báo cáo thất bại. Vui lòng thử lại.");
    }
  };

  const overview = overviewData?.data;
  const revenue = revenueData?.data;
  const booking = bookingData?.data;
  const review = reviewData?.data;
  const performance = performanceData?.data;

  const isLoading =
    overviewLoading ||
    revenueLoading ||
    bookingLoading ||
    reviewLoading ||
    performanceLoading;

  const handleRefresh = () => {
    refetchOverview();
    refetchRevenue();
    refetchBooking();
    refetchReview();
    refetchPerformance();
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
            Dashboard Host
          </Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Khoảng thời gian</InputLabel>
              <Select
                labelId="time-range-label"
                value={timeRange}
                label="Khoảng thời gian"
                onChange={(e) => setTimeRange(Number(e.target.value))}
                sx={{
                  borderRadius: "4px", // Chính xác 4px
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(0, 0, 0, 0.23)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(0, 0, 0, 0.87)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.main",
                    borderWidth: 2,
                  },
                  "& .MuiSelect-select": {
                    py: 1.1, // Tinh chỉnh chiều cao cho đẹp hơn
                  },
                }}
              >
                <MenuItem value={3}>3 tháng</MenuItem>
                <MenuItem value={6}>6 tháng</MenuItem>
                <MenuItem value={12}>12 tháng</MenuItem>
                <MenuItem value={24}>24 tháng</MenuItem>
              </Select>
            </FormControl>
            <Tooltip title="Làm mới">
              <IconButton onClick={handleRefresh} color="primary">
                <Refresh />
              </IconButton>
            </Tooltip>

            <Tooltip title="Xuất báo cáo">
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
      <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
        <MenuItem onClick={() => handleExport("excel")} disabled={isExporting}>
          <ListItemIcon>
            <FileSpreadsheet size={18} className="text-green-600" />
          </ListItemIcon>
          <ListItemText>Excel (.xlsx)</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleExport("pdf")} disabled={isExporting}>
          <ListItemIcon>
            <FileText size={18} className="text-red-600" />
          </ListItemIcon>
          <ListItemText>PDF (.pdf)</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleExport("csv")} disabled={isExporting}>
          <ListItemIcon>
            <FileDown size={18} className="text-blue-600" />
          </ListItemIcon>
          <ListItemText>CSV (.csv)</ListItemText>
        </MenuItem>
      </Menu>

      {isLoading ? (
        <HostDashboardSkeleton />
      ) : (
        <>
          {/* Overview Stats */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title="Tổng số Homestay"
                value={formatNumber(overview?.totalHomestays || 0)}
                subtitle={`${overview?.activeHomestays || 0} đang hoạt động`}
                icon={<Home fontSize="large" />}
                color="primary"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title="Tổng số booking"
                value={formatNumber(overview?.totalBookings || 0)}
                subtitle="Tất cả thời gian"
                icon={<CalendarMonth fontSize="large" />}
                color="success"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title="Tổng doanh thu"
                value={formatCurrency(overview?.totalRevenue || 0)}
                subtitle={`${formatCurrency(
                  overview?.monthlyRevenue || 0
                )} tháng này`}
                icon={<AttachMoney fontSize="large" />}
                trend={{
                  value: overview?.revenueGrowth || 0,
                  isPositive: (overview?.revenueGrowth || 0) > 0,
                }}
                color="warning"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                title="Đánh giá trung bình"
                value={overview?.averageRating.toFixed(1) || "0.0"}
                subtitle={`${overview?.totalReviews || 0} đánh giá`}
                icon={<Star fontSize="large" />}
                color="error"
              />
            </Grid>
          </Grid>
          {/* Revenue Trends */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, md: 8 }}>
              <LineChartCard
                title="Doanh thu theo tháng"
                labels={revenue?.monthlyRevenueData.map((d) => d.month) || []}
                datasets={[
                  {
                    label: "Doanh thu (VNĐ)",
                    data:
                      revenue?.monthlyRevenueData.map((d) => d.revenue) || [],
                    borderColor: "rgb(75, 192, 192)",
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    fill: true,
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
                      Doanh thu năm nay
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 700, mt: 1, color: "success.main" }}
                    >
                      {formatCurrency(revenue?.yearlyRevenue || 0)}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Doanh thu tháng này
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>
                      {formatCurrency(revenue?.monthlyRevenue || 0)}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Giá trị TB/booking
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>
                      {formatCurrency(revenue?.averageBookingValue || 0)}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
          {/* Revenue Breakdown & Booking Trends */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <PieChartCard
                title="Phân bổ doanh thu"
                labels={["Giá phòng", "Phí dọn dẹp", "Phí dịch vụ", "Thuế"]}
                data={[
                  revenue?.revenueBreakdown.baseRevenue || 0,
                  revenue?.revenueBreakdown.cleaningFees || 0,
                  revenue?.revenueBreakdown.serviceFees || 0,
                  revenue?.revenueBreakdown.taxAmount || 0,
                ]}
                backgroundColor={[
                  "rgba(54, 162, 235, 0.6)",
                  "rgba(75, 192, 192, 0.6)",
                  "rgba(255, 206, 86, 0.6)",
                  "rgba(153, 102, 255, 0.6)",
                ]}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <LineChartCard
                title="Xu hướng đặt phòng"
                labels={booking?.monthlyTrends.map((b) => b.month) || []}
                datasets={[
                  {
                    label: "Tổng booking",
                    data:
                      booking?.monthlyTrends.map((b) => b.totalBookings) || [],
                    borderColor: "rgb(54, 162, 235)",
                    backgroundColor: "rgba(54, 162, 235, 0.2)",
                    fill: true,
                  },
                  {
                    label: "Hoàn thành",
                    data: booking?.monthlyTrends.map((b) => b.completed) || [],
                    borderColor: "rgb(75, 192, 192)",
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    fill: true,
                  },
                ]}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[
              {
                icon: <CheckCircle2 size={40} />,
                value: formatNumber(booking?.completedBookings || 0),
                label: "Booking hoàn thành",
                color: "success.main",
              },
              {
                icon: <Clock size={40} />,
                value: formatNumber(booking?.pendingBookings || 0),
                label: "Chờ xác nhận",
                color: "warning.main",
              },
              {
                icon: <Bed size={40} />,
                value: `${booking?.occupancyRate.toFixed(1)}%`,
                label: "Tỷ lệ lấp đầy",
                color: "info.main",
              },
              {
                icon: <XCircle size={40} />,
                value: `${booking?.cancellationRate.toFixed(1)}%`,
                label: "Tỷ lệ hủy",
                color: "error.main",
              },
            ].map((item, index) => (
              <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1.5,
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  {/* Icon với màu động */}
                  <Box
                    sx={{
                      color: item.color,
                      mb: 0.5,
                    }}
                  >
                    {item.icon}
                  </Box>

                  {/* Giá trị lớn */}
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{
                      fontWeight: 700,
                      color: item.color,
                      lineHeight: 1.2,
                    }}
                  >
                    {item.value}
                  </Typography>

                  {/* Nhãn */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    {item.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
          {/* Booking Status Breakdown */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, md: 5 }}>
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
                  booking?.statusBreakdown.completed || 0,
                  booking?.statusBreakdown.pending || 0,
                  booking?.statusBreakdown.confirmed || 0,
                  booking?.statusBreakdown.cancelled || 0,
                  booking?.statusBreakdown.checkedIn || 0,
                  booking?.statusBreakdown.rejected || 0,
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
            <Grid size={{ xs: 12, md: 7 }}>
              <Paper sx={{ p: 3, height: "100%" }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Thống kê booking chi tiết
                </Typography>
                <Box sx={{ mt: 3 }}>
                  <Box sx={{ mb: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2">Hoàn thành</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {booking?.statusBreakdown.completed || 0}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={
                        ((booking?.statusBreakdown.completed || 0) /
                          (booking?.totalBookings || 1)) *
                        100
                      }
                      color="success"
                      sx={{ height: 8, borderRadius: 1 }}
                    />
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2">Đã xác nhận</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {booking?.statusBreakdown.confirmed || 0}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={
                        ((booking?.statusBreakdown.confirmed || 0) /
                          (booking?.totalBookings || 1)) *
                        100
                      }
                      color="info"
                      sx={{ height: 8, borderRadius: 1 }}
                    />
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2">Chờ xác nhận</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {booking?.statusBreakdown.pending || 0}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={
                        ((booking?.statusBreakdown.pending || 0) /
                          (booking?.totalBookings || 1)) *
                        100
                      }
                      color="warning"
                      sx={{ height: 8, borderRadius: 1 }}
                    />
                  </Box>

                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2">Đã hủy</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {booking?.statusBreakdown.cancelled || 0}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={
                        ((booking?.statusBreakdown.cancelled || 0) /
                          (booking?.totalBookings || 1)) *
                        100
                      }
                      color="error"
                      sx={{ height: 8, borderRadius: 1 }}
                    />
                  </Box>
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
                  {review?.averageRating.toFixed(1)}
                </Typography>
                <Rating
                  value={review?.averageRating || 0}
                  readOnly
                  precision={0.1}
                  size="large"
                  sx={{ mb: 2 }}
                />
                <Typography variant="body2" color="text.secondary">
                  Đánh giá trung bình
                </Typography>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  {formatNumber(review?.totalReviews || 0)} đánh giá
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <Paper sx={{ p: 3, height: "100%" }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Chi tiết đánh giá theo tiêu chí
                </Typography>
                <Box sx={{ mt: 3 }}>
                  <Box sx={{ mb: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2">Độ sạch sẽ</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {review?.averageCleanlinessRating.toFixed(1)}/5
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={
                        ((review?.averageCleanlinessRating || 0) / 5) * 100
                      }
                      sx={{ height: 8, borderRadius: 1 }}
                    />
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2">Độ chính xác</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {review?.averageAccuracyRating.toFixed(1)}/5
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={((review?.averageAccuracyRating || 0) / 5) * 100}
                      sx={{ height: 8, borderRadius: 1 }}
                    />
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2">Giao tiếp</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {review?.averageCommunicationRating.toFixed(1)}/5
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={
                        ((review?.averageCommunicationRating || 0) / 5) * 100
                      }
                      sx={{ height: 8, borderRadius: 1 }}
                    />
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2">Vị trí</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {review?.averageLocationRating.toFixed(1)}/5
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={((review?.averageLocationRating || 0) / 5) * 100}
                      sx={{ height: 8, borderRadius: 1 }}
                    />
                  </Box>

                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2">Giá trị</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {review?.averageValueRating.toFixed(1)}/5
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={((review?.averageValueRating || 0) / 5) * 100}
                      sx={{ height: 8, borderRadius: 1 }}
                    />
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
          {/* Rating Distribution */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12 }}>
              <BarChartCard
                title="Phân bố đánh giá"
                labels={["5 sao", "4 sao", "3 sao", "2 sao", "1 sao"]}
                datasets={[
                  {
                    label: "Số lượng",
                    data: [
                      review?.ratingDistribution.fiveStar || 0,
                      review?.ratingDistribution.fourStar || 0,
                      review?.ratingDistribution.threeStar || 0,
                      review?.ratingDistribution.twoStar || 0,
                      review?.ratingDistribution.oneStar || 0,
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
          {/* Homestay Performance Table */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12 }}>
              <Paper>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Hiệu suất các Homestay
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Tên homestay</TableCell>
                          <TableCell align="center">
                            <Visibility fontSize="small" /> Lượt xem
                          </TableCell>
                          <TableCell align="center">Booking</TableCell>
                          <TableCell align="center">Đánh giá</TableCell>
                          <TableCell align="center">Tỷ lệ lấp đầy</TableCell>
                          <TableCell align="right">Doanh thu</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {performance?.homestayPerformance.map((homestay) => (
                          <TableRow key={homestay.homestayId} hover>
                            <TableCell>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 500 }}
                              >
                                {homestay.homestayTitle}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={formatNumber(homestay.viewCount)}
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>
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
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  ({homestay.reviewCount})
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={`${homestay.occupancyRate.toFixed(1)}%`}
                                size="small"
                                color={
                                  homestay.occupancyRate >= 70
                                    ? "success"
                                    : homestay.occupancyRate >= 50
                                    ? "warning"
                                    : "error"
                                }
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 600, color: "success.main" }}
                              >
                                {formatCurrency(homestay.revenue)}
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
          {/* Top Guests & Upcoming Bookings */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    <People fontSize="small" sx={{ mr: 1, mb: -0.5 }} />
                    Khách hàng thân thiết
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Khách hàng</TableCell>
                          <TableCell align="center">Booking</TableCell>
                          <TableCell align="right">Tổng chi tiêu</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {performance?.topGuests.map((guest) => (
                          <TableRow key={guest.guestId} hover>
                            <TableCell>
                              <Typography variant="body2" noWrap>
                                {guest.guestName}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {guest.email}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={guest.totalBookings}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 600, color: "success.main" }}
                              >
                                {formatCurrency(guest.totalSpent)}
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

            <Grid size={{ xs: 12, md: 6 }}>
              <Paper>
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    <CalendarMonth fontSize="small" sx={{ mr: 1, mb: -0.5 }} />
                    Booking sắp tới
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Homestay</TableCell>
                          <TableCell>Khách</TableCell>
                          <TableCell align="center">Check-in</TableCell>
                          <TableCell align="center">Trạng thái</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {performance?.upcomingBookings
                          .slice(0, 5)
                          .map((booking) => (
                            <TableRow key={booking.bookingId} hover>
                              <TableCell>
                                <Typography variant="body2" noWrap>
                                  {booking.homestayTitle}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" noWrap>
                                  {booking.guestName}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {new Date(
                                    booking.checkInDate
                                  ).toLocaleDateString("vi-VN")}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Chip
                                  label={booking.status}
                                  size="small"
                                  color={
                                    booking.status === "Confirmed"
                                      ? "success"
                                      : "warning"
                                  }
                                />
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
                        {review?.recentReviews.map((reviewItem) => (
                          <TableRow key={reviewItem.reviewId} hover>
                            <TableCell>
                              <Typography variant="body2">
                                {reviewItem.guestName}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" noWrap>
                                {reviewItem.homestayTitle}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Rating
                                value={reviewItem.rating}
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
                                {reviewItem.comment || "Không có bình luận"}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {new Date(
                                  reviewItem.createdAt
                                ).toLocaleDateString("vi-VN")}
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

export default HostDashboard;
