import {
  Box,
  Container,
  Grid,
  Typography,
  Link as MuiLink,
} from "@mui/material";

import { Link } from "react-router-dom";

const footerSections = [
  {
    title: "Hỗ trợ",
    links: [
      "Quản lý chuyến đi",
      "Liên hệ Dịch vụ Khách hàng",
      "Trung tâm An toàn",
    ],
  },
  {
    title: "Khám phá",
    links: [
      "Chương trình Thành viên Genius",
      "Ưu đãi theo mùa và lễ hội",
      "Bài viết Du lịch",
      "Tìm chuyến bay",
      "Thuê xe",
      "Đặt bàn nhà hàng",
      "Booking.com cho Doanh nghiệp",
    ],
  },
  {
    title: "Điều khoản và Cài đặt",
    links: [
      "Quyền riêng tư & Cookie",
      "Điều khoản Dịch vụ",
      "Tuyên bố Khả năng Truy cập",
      "Tuyên bố Quyền Con người",
    ],
  },
  {
    title: "Đối tác",
    links: [
      "Đăng nhập Extranet",
      "Hỗ trợ Đối tác",
      "Đăng ký tài sản",
      "Trở thành Đối tác Liên kết",
    ],
  },
  {
    title: "Về chúng tôi",
    links: [
      "Về Booking.com",
      "Cách Chúng tôi Hoạt động",
      "Bền vững",
      "Trung tâm Báo chí",
      "Tuyển dụng",
      "Quan hệ Nhà đầu tư",
      "Liên hệ Doanh nghiệp",
      "Nguyên tắc và Báo cáo Nội dung",
    ],
  },
];

const partnerBrands = [
  "Booking.com",
  "priceline",
  "KAYAK",
  "agoda",
  "Opentable",
];

const MainFooter = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#f5f5f5",
        color: "#333",
        py: 6,
        mt: "auto",
        fontSize: 12,
      }}
    >
      <Container maxWidth="lg">
        {/* Footer Top Links */}
        <Grid container spacing={4}>
          {footerSections.map((section) => (
            <Grid
              key={section.title}
              size={{
                xs: 12,
                sm: 6,
                md: 2.4,
              }}
            >
              <Typography
                variant="subtitle1"
                fontSize={14}
                sx={{ fontWeight: 700, mb: 1 }}
              >
                {section.title}
              </Typography>
              {section.links.map((link) => (
                <Typography
                  key={link}
                  variant="body2"
                  fontSize={13}
                  sx={{
                    mb: 0.6,
                    "& a": {
                      color: "inherit",
                      textDecoration: "none",
                      "&:hover": { textDecoration: "underline" },
                    },
                  }}
                >
                  <Link to="#">{link}</Link>
                </Typography>
              ))}
            </Grid>
          ))}
        </Grid>

        {/* Bottom Section */}
        <Box
          sx={{
            mt: 6,
            borderTop: "1px solid #ddd",
            pt: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {/* Copyright */}
          <Typography
            variant="body2"
            sx={{ color: "#666", textAlign: "center" }}
          >
            © {new Date().getFullYear()} NextStay.com™. Bản quyền thuộc về toàn
            bộ hoặc một phần.
          </Typography>

          {/* Partner brands */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {partnerBrands.map((brand) => (
              <MuiLink
                key={brand}
                href="#"
                underline="hover"
                color="inherit"
                sx={{ fontSize: 14, fontWeight: 500 }}
              >
                {brand}
              </MuiLink>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default MainFooter;
