/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  TextField,
  useTheme,
  Alert,
  Snackbar,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  ChevronDown,
} from "lucide-react";

import { AppButton } from "@/components/button";
import { Formik, Form } from "formik";
import * as Yup from "yup";

// Banner image
import BannerContact from "@/assets/BannerWebsite.svg"; // hoặc BannerHomePage

interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const contactSchema = Yup.object().shape({
  name: Yup.string()
    .required("Vui lòng nhập họ tên")
    .min(2, "Họ tên phải có ít nhất 2 ký tự"),
  email: Yup.string()
    .required("Vui lòng nhập email")
    .email("Email không hợp lệ"),
  phone: Yup.string()
    .required("Vui lòng nhập số điện thoại")
    .matches(/^[0-9]{10}$/, "Số điện thoại phải có 10 chữ số"),
  subject: Yup.string()
    .required("Vui lòng nhập chủ đề")
    .min(5, "Chủ đề phải có ít nhất 5 ký tự"),
  message: Yup.string()
    .required("Vui lòng nhập nội dung")
    .min(20, "Nội dung phải có ít nhất 20 ký tự"),
});

const ContactPage: React.FC = () => {
  const theme = useTheme();
  const [showSuccess, setShowSuccess] = useState(false);

  const contactInfo = [
    {
      icon: <Mail size={24} />,
      title: "Email",
      content: "support@homestay.com",
      subContent: "info@homestay.com",
      color: "#3b82f6",
    },
    {
      icon: <Phone size={24} />,
      title: "Điện thoại",
      content: "1900 1234",
      subContent: "(+84) 28 1234 5678",
      color: "#10b981",
    },
    {
      icon: <MapPin size={24} />,
      title: "Địa chỉ",
      content: "123 Nguyễn Huệ, Quận 1",
      subContent: "TP. Hồ Chí Minh, Việt Nam",
      color: "#f59e0b",
    },
    {
      icon: <Clock size={24} />,
      title: "Giờ làm việc",
      content: "Thứ 2 - Thứ 6: 8:00 - 18:00",
      subContent: "Thứ 7 - CN: 9:00 - 17:00",
      color: "#8b5cf6",
    },
  ];

  const faqs = [
    {
      question: "Làm sao để đặt phòng?",
      answer:
        "Bạn có thể tìm kiếm homestay phù hợp theo địa điểm, ngày nhận/trả phòng, số lượng khách, sau đó chọn phòng và thanh toán trực tuyến qua cổng thanh toán an toàn.",
    },
    {
      question: "Chính sách hủy phòng như thế nào?",
      answer:
        "Miễn phí hủy trong 24 giờ đầu tiên sau khi đặt. Sau đó, phí hủy phụ thuộc vào chính sách của từng homestay (thường từ 50% - 100% giá trị đặt phòng).",
    },
    {
      question: "Làm thế nào để liên hệ chủ nhà?",
      answer:
        "Sau khi đặt phòng thành công, thông tin liên hệ của chủ nhà (số điện thoại, email, Zalo) sẽ được gửi qua email xác nhận và hiển thị trong mục 'Đặt phòng của tôi'.",
    },
    {
      question: "Có hỗ trợ đặt phòng cho người nước ngoài không?",
      answer:
        "Có! Hệ thống hỗ trợ đa ngôn ngữ và thanh toán quốc tế. Bạn chỉ cần chọn ngôn ngữ phù hợp và sử dụng thẻ Visa/MasterCard hoặc ví điện tử.",
    },
    {
      question: "Có hóa đơn VAT không?",
      answer:
        "Có. Sau khi thanh toán thành công, bạn có thể yêu cầu xuất hóa đơn VAT trong vòng 7 ngày. Vui lòng liên hệ support@homestay.com để được hỗ trợ.",
    },
  ];

  const initialValues: ContactFormValues = {
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  };

  const handleSubmit = async (
    values: ContactFormValues,
    { setSubmitting, resetForm }: any
  ) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Form values:", values);
      setShowSuccess(true);
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ bgcolor: "background.default" }}>
      {/* === HERO SECTION WITH BANNER IMAGE === */}
      <Box sx={{ position: "relative", mt: "-5px", overflow: "visible" }}>
        <Box sx={{ width: "100%", overflow: "hidden" }}>
          <img
            src={BannerContact}
            alt="Liên hệ với chúng tôi"
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
                mb: 2,
                fontSize: { xs: "2.5rem", md: "4rem" },
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Liên Hệ Với Chúng Tôi
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
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn 24/7
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Contact Info Cards */}
      <Container maxWidth="lg" sx={{ mt: { xs: 6, md: 8 }, mb: 8 }}>
        <Grid container spacing={3}>
          {contactInfo.map((info, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card
                elevation={3}
                sx={{
                  p: 3,
                  height: "100%",
                  borderRadius: "16px",
                  transition: "all 0.3s ease",
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
                    width: 56,
                    height: 56,
                    borderRadius: "12px",
                    bgcolor: `${info.color}15`,
                    color: info.color,
                    mb: 2,
                  }}
                >
                  {info.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {info.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.primary"
                  sx={{ mb: 0.5, fontWeight: 500 }}
                >
                  {info.content}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {info.subContent}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Form + Accordion FAQ */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {/* Left: Form */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Card
              elevation={3}
              sx={{ p: { xs: 3, md: 4 }, borderRadius: "20px" }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 48,
                    height: 48,
                    borderRadius: "12px",
                    bgcolor: "primary.main",
                    color: "white",
                    mr: 2,
                  }}
                >
                  <MessageSquare size={24} />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Gửi tin nhắn cho chúng tôi
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Chúng tôi sẽ phản hồi trong vòng 24 giờ
                  </Typography>
                </Box>
              </Box>

              <Formik
                initialValues={initialValues}
                validationSchema={contactSchema}
                onSubmit={handleSubmit}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  isSubmitting,
                }) => (
                  <Form>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          name="name"
                          label="Họ và tên *"
                          value={values.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.name && Boolean(errors.name)}
                          helperText={touched.name && errors.name}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          name="email"
                          label="Email *"
                          type="email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.email && Boolean(errors.email)}
                          helperText={touched.email && errors.email}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          name="phone"
                          label="Số điện thoại *"
                          value={values.phone}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.phone && Boolean(errors.phone)}
                          helperText={touched.phone && errors.phone}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          name="subject"
                          label="Chủ đề *"
                          value={values.subject}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.subject && Boolean(errors.subject)}
                          helperText={touched.subject && errors.subject}
                        />
                      </Grid>
                      <Grid size={12}>
                        <TextField
                          fullWidth
                          name="message"
                          label="Nội dung *"
                          multiline
                          rows={6}
                          value={values.message}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.message && Boolean(errors.message)}
                          helperText={touched.message && errors.message}
                        />
                      </Grid>
                      <Grid size={12}>
                        <AppButton
                          type="submit"
                          fullWidth
                          size="large"
                          startIcon={<Send size={20} />}
                          isLoading={isSubmitting}
                          sx={{ py: 1.5, fontSize: "1rem", fontWeight: 600 }}
                        >
                          Gửi tin nhắn
                        </AppButton>
                      </Grid>
                    </Grid>
                  </Form>
                )}
              </Formik>
            </Card>
          </Grid>

          {/* Right: FAQ Accordion */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ position: "sticky", top: 100 }}>
              <Card
                elevation={3}
                sx={{ p: { xs: 2, md: 3 }, borderRadius: "20px" }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  Câu hỏi thường gặp
                </Typography>

                <Box sx={{ "& .MuiAccordion-root": { mb: 1.5 } }}>
                  {faqs.map((faq, index) => (
                    <Accordion
                      key={index}
                      elevation={0}
                      sx={{
                        bgcolor: "grey.50",
                        borderRadius: "12px !important",
                        "&:before": { display: "none" },
                        overflow: "hidden",
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ChevronDown size={20} />}
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.95rem",
                          color: "primary.main",
                          py: 1.5,
                          px: 2,
                          minHeight: "auto",
                          "& .MuiAccordionSummary-content": {
                            margin: 0,
                          },
                        }}
                      >
                        {faq.question}
                      </AccordionSummary>
                      <AccordionDetails
                        sx={{
                          px: 2,
                          pb: 2,
                          pt: 0.5,
                          color: "text.secondary",
                          fontSize: "0.9rem",
                          lineHeight: 1.6,
                        }}
                      >
                        {faq.answer}
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Gửi tin nhắn thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactPage;
