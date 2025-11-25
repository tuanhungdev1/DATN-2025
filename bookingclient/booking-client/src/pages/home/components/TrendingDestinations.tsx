import { Box, Typography, Grid } from "@mui/material";
import { AppImage } from "@/components/images";
import VietNamFlag from "@/assets/Vietnam.png";
import { useNavigate } from "react-router-dom";

interface Destination {
  id: number;
  name: string;
  imageUrl: string;
}

const destinations: Destination[] = [
  {
    id: 1,
    name: "Thành phố Hồ Chí Minh",
    imageUrl:
      "https://cf.bstatic.com/xdata/images/city/600x600/688893.jpg?k=d32ef7ff94e5d02b90908214fb2476185b62339549a1bd7544612bdac51fda31&o=",
  },
  {
    id: 2,
    name: "Đà Nẵng",
    imageUrl:
      "https://cf.bstatic.com/xdata/images/city/600x600/688844.jpg?k=02892d4252c5e4272ca29db5faf12104004f81d13ff9db724371de0c526e1e15&o=",
  },
  {
    id: 3,
    name: "Hà Nội",
    imageUrl:
      "https://cf.bstatic.com/xdata/images/city/600x600/981517.jpg?k=2268f51ad34ab94115ea9e42155bc593aa8d48ffaa6fc58432a8760467dc4ea6&o=",
  },
  {
    id: 4,
    name: "Vũng Tàu",
    imageUrl:
      "https://cf.bstatic.com/xdata/images/city/600x600/688956.jpg?k=fc88c6ab5434042ebe73d94991e011866b18ee486476e475a9ac596c79dce818&o=",
  },
  {
    id: 5,
    name: "Đà Lạt",
    imageUrl:
      "https://cf.bstatic.com/xdata/images/city/600x600/688831.jpg?k=7b999c7babe3487598fc4dd89365db2c4778827eac8cb2a47d48505c97959a78&o=",
  },
];

const TrendingDestinations = () => {
  const navigate = useNavigate();

  const handleDestinationClick = (cityName: string) => {
    const params = new URLSearchParams();
    params.set("city", cityName);
    params.set("pageNumber", "1");
    navigate(`/homestay-list?${params.toString()}`);
  };
  return (
    <Box sx={{ py: 6 }}>
      {/* Tiêu đề */}
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
        Điểm đến nổi bật
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Những lựa chọn phổ biến nhất cho khách du lịch từ Việt Nam
      </Typography>

      {/* Lưới danh sách */}
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {destinations.map((dest) => (
          <Grid
            key={dest.id}
            size={{
              xs: 12, // Mobile: full width
              sm: 6, // Tablet nhỏ: 2 cột
              md: dest.id <= 2 ? 6 : 4, // Desktop: 2 cái đầu chiếm 50%, 3 cái sau chiếm 33%
              lg: dest.id <= 2 ? 6 : 4,
            }}
            sx={{ display: "flex" }}
          >
            <Box
              onClick={() => handleDestinationClick(dest.name)}
              sx={{
                position: "relative",
                borderRadius: "12px",
                overflow: "hidden",
                width: "100%",
                height: { xs: "200px", sm: "240px", md: "280px", lg: "300px" }, // Tăng dần theo màn hình
                boxShadow: 3,
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                  "& img": { transform: "scale(1.08)" },
                },
                "& img": {
                  transition: "transform 0.5s ease",
                },
              }}
            >
              <AppImage
                src={dest.imageUrl}
                alt={dest.name}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />

              {/* Overlay gradient + text */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  p: { xs: 2, md: 3 },
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: { xs: 0.8, md: 1.2 },
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: "white",
                      fontWeight: 700,
                      fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.4rem" },
                      textShadow: "0 2px 8px rgba(0,0,0,0.6)",
                      lineHeight: 1.2,
                    }}
                  >
                    {dest.name}
                  </Typography>

                  <Box
                    sx={{
                      width: { xs: "22px", sm: "26px", md: "28px" },
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={VietNamFlag}
                      alt="Việt Nam"
                      style={{
                        width: "100%",
                        height: "auto",
                        borderRadius: "4px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TrendingDestinations;
