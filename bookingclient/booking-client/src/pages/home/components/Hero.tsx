import {
  Box,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { SearchComponent } from "@/components/searchBox";

import Hero1 from "@/assets/hero1.jpg";
import Hero2 from "@/assets/hero2.jpg";
import Hero5 from "@/assets/hero5.jpg";
import Hero6 from "@/assets/hero6.jpg";
import Hero7 from "@/assets/hero7.jpg";
import Hero8 from "@/assets/hero8.jpg";
import Hero9 from "@/assets/hero9.jpg";

const heroImages = [Hero1, Hero2, Hero5, Hero6, Hero7, Hero8, Hero9];

const typingSentences = [
  "Tìm homestay lý tưởng cho kỳ nghỉ",
  "Trải nghiệm sống như người bản địa",
  "Chạm vào thiên nhiên, nghỉ dưỡng an yên",
  "Homestay ấm cúng, view đẹp mê ly",
  "Đặt nhanh – Giá tốt – Ưu đãi lớn!",
];

const Hero = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // === CHUYỂN ẢNH NỀN ===
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // === TYPING EFFECT ===
  const [displayedText, setDisplayedText] = useState("");
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const typingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const currentSentence = typingSentences[sentenceIndex];

    typingRef.current = setTimeout(
      () => {
        if (!isDeleting && displayedText !== currentSentence) {
          setDisplayedText(
            currentSentence.substring(0, displayedText.length + 1)
          );
        } else if (isDeleting && displayedText !== "") {
          setDisplayedText(
            currentSentence.substring(0, displayedText.length - 1)
          );
        } else if (displayedText === currentSentence) {
          setTimeout(() => setIsDeleting(true), 4000);
        } else if (displayedText === "" && isDeleting) {
          setIsDeleting(false);
          setSentenceIndex((prev) => (prev + 1) % typingSentences.length);
        }
      },
      isDeleting ? 50 : 80
    );

    return () => {
      if (typingRef.current) clearTimeout(typingRef.current);
    };
  }, [displayedText, isDeleting, sentenceIndex]);

  return (
    <>
      {/* ==================== HERO CONTAINER – QUAN TRỌNG: overflow visible + chiều cao linh hoạt ==================== */}
      <Box
        sx={{
          position: "relative",
          mt: "-5px",
          overflow: "visible",
          height: { xs: "75vh", md: "50vh" },
          minHeight: { xs: "65vh", md: "56vh" },
          maxHeight: { xs: "90vh", md: "56vh" },
        }}
      >
        <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
          {heroImages.map((img, index) => (
            <Box
              key={index}
              sx={{
                position: index === currentImageIndex ? "relative" : "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                opacity: currentImageIndex === index ? 1 : 0,
                transition: "opacity 1.8s ease-in-out",
                pointerEvents: "none",
              }}
            >
              <img
                src={img}
                alt={`Hero ${index + 1}`}
                style={{
                  width: "100%",
                  height: "100%", // giữ nguyên
                  objectFit: "cover",
                  objectPosition: "center top", // quan trọng: ưu tiên hiện phần trên của ảnh
                  display: "block",
                }}
              />
            </Box>
          ))}
        </Box>

        {/* ==================== GRADIENT OVERLAY ==================== */}
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
                rgba(0, 0, 0, 0.75) 0%,
                rgba(0, 0, 0, 0.25) 15%,
                transparent 30%,
                transparent 70%,
                rgba(0, 0, 0, 0.25) 85%,
                rgba(0, 0, 0, 0.75) 100%
              ),
              linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 80%)
            `,
            zIndex: 1,
          }}
        />

        {/* ==================== TEXT CONTENT ==================== */}
        <Container
          maxWidth="lg"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 2,
            width: "100%",
            textAlign: { xs: "center", md: "left" },
          }}
        >
          <Box
            sx={{
              color: "white",
              textShadow: "0 4px 12px rgba(0,0,0,1)",
              pl: { xs: 2, md: 0 },
              pr: { xs: 2, md: 0 },
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                fontFamily: "Montserrat, sans-serif",
                fontSize: {
                  xs: "2rem",
                  sm: "2rem",
                  md: "2.5rem",
                  lg: "3rem",
                },
                lineHeight: 1.15,
                mb: 2,
              }}
            >
              <Box
                component="span"
                sx={{ borderRight: "4px solid white", pr: 1 }}
              >
                {displayedText}
              </Box>
              <span className="blink-cursor">|</span>
            </Typography>

            {/* ==================== CÂU PHỤ – HIỆU ỨNG TRƯỢT XUỐNG / LÊN SIÊU MƯỢT ==================== */}
            <Box
              sx={{
                position: "relative",
                height: { xs: "28px", md: "36px" }, // cố định chiều cao để không bị nhảy layout
                overflow: "hidden",
                mt: 2,
              }}
            >
              {[
                "Khám phá hơn 10.000 homestay độc đáo trên khắp Việt Nam",
                "Giá tiết kiệm nhất – So sánh thông minh, đặt phòng thông thái",
                "Hoàn tất đặt phòng chỉ trong vài thao tác – chưa đầy 30 giây",
                "Ưu đãi độc quyền, cập nhật liên tục mỗi ngày – Đừng bỏ lỡ!",
                "Thức dậy ở một nơi hoàn toàn mới – Bạn đã sẵn sàng?",
                "Mỗi hành trình là một câu chuyện, mỗi homestay là một trải nghiệm",
                "Hàng ngàn homestay đẹp như mơ đang chờ bạn khám phá",
                "Đi để trải nghiệm – ở để tận hưởng",
              ].map((text, idx) => (
                <Typography
                  key={idx}
                  variant="h6"
                  sx={{
                    fontFamily: "Roboto, sans-serif",
                    fontSize: { xs: "1.05rem", md: "1.28rem" },
                    fontWeight: 400,
                    color: "white",
                    textAlign: { xs: "center", md: "left" },
                    maxWidth: { xs: "90%", md: "80%" },
                    mx: { xs: "auto", md: 0 },

                    // Hiệu ứng chính: trượt lên/xuống
                    position: "absolute",
                    width: "100%",
                    top: 0,
                    left: 0,
                    textShadow: "0 4px 12px rgba(0,0,0,1)",
                    transform:
                      currentImageIndex === idx
                        ? "translateY(0)"
                        : currentImageIndex > idx
                        ? "translateY(-100%)" // đã qua → trượt lên trên (ẩn)
                        : "translateY(100%)", // chưa tới → trượt từ dưới lên

                    opacity: currentImageIndex === idx ? 1 : 0,
                    transition: "all 2s cubic-bezier(0.4, 0, 0.2, 1)",
                    pointerEvents: "none",
                  }}
                >
                  {text}
                </Typography>
              ))}
            </Box>
          </Box>
        </Container>

        {/* ==================== SEARCH BOX – TRỒI RA ĐẸP (chỉ desktop) ==================== */}
        {!isMobile && (
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              transform: "translateY(50%)", // Trồi lên 50%
              zIndex: 10,
              pointerEvents: "auto",
            }}
          >
            <Container maxWidth="lg">
              <SearchComponent variant="hero" />
            </Container>
          </Box>
        )}
      </Box>

      {/* ==================== SEARCH BOX MOBILE – nằm dưới hero ==================== */}
      {isMobile && (
        <Box sx={{ px: 2, mt: { xs: 4, sm: 6 }, mb: 4 }}>
          <Container maxWidth="lg" sx={{ px: 0 }}>
            <SearchComponent variant="hero" />
          </Container>
        </Box>
      )}

      {/* CSS nhấp nháy con trỏ typing */}
      <style>{`
        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
        .blink-cursor {
          animation: blink 0.8s infinite;
          opacity: 0.8;
          margin-left: 4px;
        }
      `}</style>
    </>
  );
};

export default Hero;
