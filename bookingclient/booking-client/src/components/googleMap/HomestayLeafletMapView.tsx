import React, { useState, useCallback, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {
  Box,
  Drawer,
  IconButton,
  Typography,
  Card,
  CardMedia,
  CardContent,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Close as CloseIcon, Star } from "@mui/icons-material";
import L from "leaflet";
import type { Homestay } from "@/types/homestay.types";

// Custom icon cho marker hiển thị giá
const createPriceIcon = (price: number, isSelected: boolean = false) => {
  return L.divIcon({
    className: "custom-price-marker",
    html: `
      <div style="
        background: ${isSelected ? "#1976d2" : "white"};
        color: ${isSelected ? "white" : "#000"};
        padding: 6px 14px;
        border-radius: 20px;
        border: 2px solid ${isSelected ? "#1565c0" : "#1976d2"};
        font-weight: 700;
        font-size: 13px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.25);
        cursor: pointer;
        transition: all 0.3s ease;
        white-space: nowrap;
        font-family: 'Roboto', sans-serif;
      ">
        ${(price / 1000).toFixed(0)}K
      </div>
    `,
    iconSize: [60, 30],
    iconAnchor: [30, 15],
  });
};

interface HomestayLeafletMapViewProps {
  homestays: Homestay[];
  onClose: () => void;
  selectedHomestayId?: number;
  onHomestaySelect: (id: number) => void;
}

const HomestayLeafletMapView: React.FC<HomestayLeafletMapViewProps> = ({
  homestays,
  onClose,
  selectedHomestayId,
  onHomestaySelect,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [selectedMarkerId, setSelectedMarkerId] = useState<number | null>(
    selectedHomestayId || null
  );

  // Calculate center
  const center = useMemo(() => {
    if (homestays.length === 0) {
      return { lat: 21.0285, lng: 105.8542 };
    }

    const avgLat =
      homestays.reduce((sum, h) => sum + h.latitude, 0) / homestays.length;
    const avgLng =
      homestays.reduce((sum, h) => sum + h.longitude, 0) / homestays.length;

    return { lat: avgLat, lng: avgLng };
  }, [homestays]);

  const handleMarkerClick = useCallback(
    (homestayId: number) => {
      setSelectedMarkerId(homestayId);
      onHomestaySelect(homestayId);
    },
    [onHomestaySelect]
  );

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        zIndex: 1300,
      }}
    >
      {/* Drawer bên trái */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={true}
        sx={{
          width: isMobile ? "100%" : 400,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isMobile ? "100%" : 400,
            boxSizing: "border-box",
            height: "100vh",
            overflowY: "auto",
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              {homestays.length} homestay
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ p: 2 }}>
          {homestays.map((homestay) => (
            <Card
              key={homestay.id}
              sx={{
                mb: 2,
                cursor: "pointer",
                border: "2px solid",
                borderColor:
                  selectedMarkerId === homestay.id
                    ? "primary.main"
                    : "transparent",
                transition: "all 0.3s",
                "&:hover": {
                  borderColor: "primary.main",
                  boxShadow: 3,
                },
              }}
              onClick={() => handleMarkerClick(homestay.id)}
            >
              <CardMedia
                component="img"
                height="200"
                image={homestay.mainImageUrl || "/placeholder.jpg"}
                alt={homestay.homestayTitle}
              />
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom noWrap>
                  {homestay.homestayTitle}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {homestay.city}, {homestay.province}
                </Typography>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <Star sx={{ fontSize: 16, color: "warning.main" }} />
                  <Typography variant="body2" fontWeight={600}>
                    {homestay.ratingAverage.toFixed(1)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ({homestay.totalReviews} đánh giá)
                  </Typography>
                </Box>
                <Typography variant="h6" color="primary" fontWeight={700}>
                  {homestay.baseNightlyPrice.toLocaleString("vi-VN")} ₫
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.secondary"
                  >
                    /đêm
                  </Typography>
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Drawer>

      {/* Map */}
      <Box
        sx={{
          marginLeft: isMobile ? 0 : "400px",
          width: isMobile ? "100%" : "calc(100% - 400px)",
          height: "100vh",
        }}
      >
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {homestays.map((homestay) => (
            <Marker
              key={homestay.id}
              position={[homestay.latitude, homestay.longitude]}
              icon={createPriceIcon(
                homestay.baseNightlyPrice,
                selectedMarkerId === homestay.id
              )}
              eventHandlers={{
                click: () => handleMarkerClick(homestay.id),
              }}
            >
              <Popup>
                <Card sx={{ minWidth: 200 }}>
                  <CardMedia
                    component="img"
                    height="120"
                    image={
                      homestay.mainImageUrl ||
                      "https://placehold.net/default.svg"
                    }
                    alt={homestay.homestayTitle}
                  />
                  <CardContent sx={{ p: 1.5 }}>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      gutterBottom
                    >
                      {homestay.homestayTitle}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        mb: 0.5,
                      }}
                    >
                      <Star sx={{ fontSize: 14, color: "warning.main" }} />
                      <Typography variant="caption" fontWeight={600}>
                        {homestay.ratingAverage.toFixed(1)}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      color="primary"
                      fontWeight={700}
                    >
                      {homestay.baseNightlyPrice.toLocaleString("vi-VN")} ₫/đêm
                    </Typography>
                  </CardContent>
                </Card>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Box>
    </Box>
  );
};

export default HomestayLeafletMapView;
