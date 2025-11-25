/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  useTheme,
} from "@mui/material";
import {
  Home,
  Shield,
  Heart,
  Users,
  Award,
  Globe,
  CheckCircle,
} from "lucide-react";
import { AppBreadcrumbs } from "@/components/breadcrumb";

// Import hình ảnh
import BannerAbout from "@/assets/BannerWebsite.svg"; // hoặc BannerHomePage
import MissionImage from "@/assets/MissionImage.jpg"; // ảnh minh họa sứ mệnh

const AboutPage: React.FC = () => {
  const theme = useTheme();

  const breadcrumbItems = [
    { label: "Trang chủ", path: "/", icon: <Home size={14} /> },
    { label: "Về chúng tôi" },
  ];

  const features = [
    {
      icon: <Shield size={40} />,
      title: "An toàn & Bảo mật",
      description:
        "Hệ thống thanh toán được mã hóa SSL, bảo vệ thông tin khách hàng tuyệt đối.",
      color: "#3b82f6",
    },
    {
      icon: <Heart size={40} />,
      title: "Trải nghiệm tuyệt vời",
      description:
        "Mỗi homestay được chọn lọc kỹ càng để mang đến trải nghiệm độc đáo nhất.",
      color: "#ec4899",
    },
    {
      icon: <Users size={40} />,
      title: "Cộng đồng tin cậy",
      description: "Kết nối hàng nghìn chủ nhà và du khách trên khắp Việt Nam.",
      color: "#8b5cf6",
    },
    {
      icon: <Award size={40} />,
      title: "Chất lượng đảm bảo",
      description:
        "Đánh giá chân thực từ người dùng, cam kết hoàn tiền nếu không hài lòng.",
      color: "#f59e0b",
    },
  ];

  const stats = [
    { value: "10,000+", label: "Homestay", icon: <Home size={24} /> },
    { value: "50,000+", label: "Khách hàng", icon: <Users size={24} /> },
    { value: "63/63", label: "Tỉnh thành", icon: <Globe size={24} /> },
    { value: "4.8/5", label: "Đánh giá", icon: <Award size={24} /> },
  ];

  const values = [
    {
      title: "Trung thực",
      description: "Minh bạch trong mọi giao dịch và thông tin.",
    },
    {
      title: "Tận tâm",
      description: "Đặt trải nghiệm khách hàng lên hàng đầu.",
    },
    { title: "Đổi mới", description: "Không ngừng cải tiến và phát triển." },
    { title: "Kết nối", description: "Xây dựng cộng đồng du lịch bền vững." },
  ];

  return (
    <Box sx={{ bgcolor: "background.default" }}>
      {/* === HERO SECTION WITH BANNER IMAGE === */}
      <Box sx={{ position: "relative", mt: "-5px", overflow: "visible" }}>
        {/* Banner Image */}
        <Box sx={{ width: "100%", overflow: "hidden" }}>
          <img
            src={BannerAbout}
            alt="Về chúng tôi - Homestay Việt Nam"
            style={{
              width: "100%",
              height: "auto",
              objectFit: "cover",
              display: "block",
            }}
          />
        </Box>

        {/* Gradient Overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              linear-gradient(
                to right,
                rgba(0, 0, 0, 0.7) 0%,
                rgba(0, 0, 0, 0.2) 15%,
                transparent 30%,
                transparent 70%,
                rgba(0, 0, 0, 0.2) 85%,
                rgba(0, 0, 0, 0.7) 100%
              )
            `,
            zIndex: 1,
          }}
        />

        {/* Text Content */}
        <Container
          maxWidth="lg"
          sx={{
            position: "absolute",
            zIndex: 2,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              color: "white",
              textShadow: "0 2px 8px rgba(0,0,0,0.6)",
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                mb: 3,
                fontSize: { xs: "2.5rem", md: "4rem" },
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Về Chúng Tôi
            </Typography>
            <Typography
              variant="h5"
              sx={{
                maxWidth: "800px",
                mx: "auto",
                opacity: 0.95,
                fontWeight: 400,
                lineHeight: 1.6,
                fontSize: { xs: "1.1rem", md: "1.5rem" },
                fontFamily: "Roboto, sans-serif",
              }}
            >
              Nền tảng đặt homestay hàng đầu Việt Nam, kết nối du khách với
              những trải nghiệm lưu trú độc đáo và ấm cúng
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ mt: { xs: 6, md: 8 }, mb: 8 }}>
        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid size={{ xs: 6, sm: 6, md: 3 }} key={index}>
              <Card
                elevation={3}
                sx={{
                  textAlign: "center",
                  py: 3,
                  height: "100%",
                  borderRadius: "16px",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                    color: "white",
                    mb: 2,
                  }}
                >
                  {stat.icon}
                </Box>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: "primary.main", mb: 1 }}
                >
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Mission Section */}
      <Box sx={{ bgcolor: "background.paper", py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 6,
              textAlign: "center",
              fontSize: { xs: "1.75rem", md: "2.5rem" },
            }}
          >
            Sứ Mệnh Của Chúng Tôi
          </Typography>
          <Grid container spacing={4} alignItems="center">
            {/* Hình ảnh minh họa */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  height: { xs: "300px", md: "400px" },
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: theme.shadows[10],
                  position: "relative",
                }}
              >
                <img
                  src={MissionImage}
                  alt="Tạo nên những kỷ niệm đáng nhớ"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    bgcolor:
                      "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                    color: "white",
                    p: 3,
                    borderRadius: "0 0 20px 20px",
                  }}
                ></Box>
              </Box>
            </Grid>

            {/* Nội dung */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
                Chúng tôi tin rằng mỗi chuyến đi không chỉ là việc tìm một nơi
                để nghỉ ngơi, mà là cơ hội để trải nghiệm văn hóa địa phương,
                kết nối với con người và tạo nên những kỷ niệm khó quên.
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                Với hơn <strong>10,000 homestay</strong> được tuyển chọn kỹ
                lưỡng trên khắp <strong>63 tỉnh thành</strong>, chúng tôi cam
                kết mang đến cho bạn những trải nghiệm lưu trú độc đáo, chất
                lượng và an toàn nhất.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            mb: 6,
            textAlign: "center",
            fontSize: { xs: "1.75rem", md: "2.5rem" },
          }}
        >
          Tại Sao Chọn Chúng Tôi?
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  p: 3,
                  borderRadius: "16px",
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: feature.color,
                    transform: "translateY(-8px)",
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 80,
                    height: 80,
                    borderRadius: "20px",
                    bgcolor: `${feature.color}15`,
                    color: feature.color,
                    mb: 3,
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  {feature.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.7 }}
                >
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Values Section */}
      <Box sx={{ bgcolor: "background.paper", py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 6,
              textAlign: "center",
              fontSize: { xs: "1.75rem", md: "2.5rem" },
            }}
          >
            Giá Trị Cốt Lõi
          </Typography>
          <Grid container spacing={3}>
            {values.map((value, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <Box
                  sx={{
                    p: 3,
                    height: "100%",
                    borderRadius: "12px",
                    bgcolor: "background.default",
                    border: "2px solid",
                    borderColor: "primary.main",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      bgcolor: "primary.main",
                      color: "white",
                      transform: "scale(1.05)",
                      "& .MuiTypography-root, & .lucide-icon": {
                        color: "white",
                      },
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <CheckCircle size={24} style={{ marginRight: "8px" }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {value.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {value.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 2,
            fontSize: { xs: "1.5rem", md: "2rem" },
          }}
        >
          Bắt đầu hành trình của bạn ngay hôm nay!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Khám phá hàng nghìn homestay độc đáo trên khắp Việt Nam
        </Typography>
      </Container>
    </Box>
  );
};

export default AboutPage;
