import React, { useState, useEffect } from "react";
import {
  Dialog,
  Box,
  IconButton,
  Typography,
  Paper,
  Stack,
  Chip,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
  Skeleton,
} from "@mui/material";
import {
  MapPin,
  Route,
  X,
  ChevronDown,
  Footprints,
  Bike,
  Car,
} from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Homestay } from "@/types/homestay.types";
import type {
  NearbyPlace,
  RouteInfo,
  TravelMode,
} from "@/types/nearbyPlaces.types";
import { nearbyPlacesService } from "@/services/nearbyPlaces.service";
import { routingService } from "@/services/RoutingService";
import { formatTravelTime, formatDistance } from "@/utils/formatDistance";
import { createHomestayIcon, createNearbyPlaceIcon } from "@/utils/mapIcons";
import TravelTimeChips from "@/components/common/TravelTimeChips";
import MapBoundsController from "@/components/common/MapBoundsController";
import { PLACE_CATEGORIES } from "@/constants/placeCategories";
import { Close } from "@mui/icons-material";

interface HomestayLocationMapDialogProps {
  open: boolean;
  onClose: () => void;
  homestay: Homestay;
}

const HomestayLocationMapDialog: React.FC<HomestayLocationMapDialogProps> = ({
  open,
  onClose,
  homestay,
}) => {
  const [nearbyPlaces, setNearbyPlaces] = useState<
    Record<string, NearbyPlace[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | false>("restaurant");
  const [selectedPlace, setSelectedPlace] = useState<NearbyPlace | null>(null);
  const [route, setRoute] = useState<RouteInfo | null>(null);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [travelMode, setTravelMode] = useState<TravelMode>("motorbike");

  // Load nearby places khi dialog mở
  useEffect(() => {
    if (open) {
      loadNearbyPlaces();
    }
  }, [open, homestay.id]);

  const loadNearbyPlaces = async () => {
    setLoading(true);
    setError(null);
    try {
      const places = await nearbyPlacesService.getAllNearbyPlaces(
        homestay.latitude,
        homestay.longitude
      );
      setNearbyPlaces(places);
    } catch (err) {
      console.error("Error loading nearby places:", err);
      setError("Không thể tải thông tin địa điểm xung quanh");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceClick = async (place: NearbyPlace) => {
    setSelectedPlace(place);
    setLoadingRoute(true);

    try {
      const osrmMode =
        travelMode === "walking"
          ? "walking"
          : travelMode === "motorbike"
          ? "driving"
          : "driving";

      const routeInfo = await routingService.getRoute(
        homestay.latitude,
        homestay.longitude,
        place.latitude,
        place.longitude,
        osrmMode
      );

      setRoute(routeInfo);
    } catch (error) {
      console.error("Error loading route:", error);
    } finally {
      setLoadingRoute(false);
    }
  };

  const handleClearRoute = () => {
    setSelectedPlace(null);
    setRoute(null);
  };

  const handleTravelModeChange = (newMode: TravelMode) => {
    setTravelMode(newMode);
    if (selectedPlace) {
      handlePlaceClick(selectedPlace);
    }
  };

  const allNearbyPlaces = Object.values(nearbyPlaces).flat();
  const hasNearbyPlaces = allNearbyPlaces.length > 0;

  // Calculate bounds for map when route is shown
  const mapBounds = route
    ? L.latLngBounds([
        [homestay.latitude, homestay.longitude],
        ...(route.coordinates || []),
      ])
    : null;

  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Paper
          elevation={2}
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 1200,
          }}
        >
          <Box>
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{
                display: "flex",
              }}
            >
              <MapPin
                size={20}
                style={{ verticalAlign: "middle", marginRight: 8 }}
              />
              Vị trí & Địa điểm xung quanh
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {homestay.homestayTitle}
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Paper>

        {/* Main Content */}
        <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* Left Side - Places List */}
          <Box
            sx={{
              flex: "0 0 420px",
              overflowY: "auto",
              backgroundColor: "background.paper",
              borderRight: "1px solid",
              borderColor: "divider",
              p: 2,
            }}
          >
            {/* Address Info */}
            <Paper sx={{ p: 2, mb: 2, bgcolor: "grey.50" }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Địa chỉ
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                {homestay.fullAddress}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {homestay.city}, {homestay.province}, {homestay.country}
              </Typography>
              {homestay.postalCode && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  sx={{ mt: 0.5 }}
                >
                  Mã bưu điện: {homestay.postalCode}
                </Typography>
              )}
            </Paper>

            {/* Selected Place & Travel Mode */}
            {selectedPlace && (
              <Paper sx={{ p: 2, mb: 2, bgcolor: "primary.lighter" }}>
                <Stack spacing={1.5}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        <Route
                          size={16}
                          style={{ verticalAlign: "middle", marginRight: 4 }}
                        />
                        Đường đi đến: {selectedPlace.name}
                      </Typography>
                      {route && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mt: 0.5, display: "block" }}
                        >
                          Khoảng cách: {formatDistance(route.distance)} • Thời
                          gian:{" "}
                          {formatTravelTime(Math.ceil(route.duration / 60))}
                        </Typography>
                      )}
                    </Box>
                    <IconButton
                      size="small"
                      onClick={handleClearRoute}
                      color="error"
                    >
                      <X size={18} />
                    </IconButton>
                  </Box>

                  {/* Travel Mode Selector */}
                  <ToggleButtonGroup
                    value={travelMode}
                    exclusive
                    onChange={(_, newMode) => {
                      if (newMode) handleTravelModeChange(newMode);
                    }}
                    size="small"
                    fullWidth
                  >
                    <ToggleButton value="walking">
                      <Tooltip title="Đi bộ">
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Footprints size={18} />
                          <Typography variant="caption">Đi bộ</Typography>
                        </Box>
                      </Tooltip>
                    </ToggleButton>
                    <ToggleButton value="motorbike">
                      <Tooltip title="Xe máy">
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Bike size={18} />
                          <Typography variant="caption">Xe máy</Typography>
                        </Box>
                      </Tooltip>
                    </ToggleButton>
                    <ToggleButton value="car">
                      <Tooltip title="Ô tô">
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Car size={18} />
                          <Typography variant="caption">Ô tô</Typography>
                        </Box>
                      </Tooltip>
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Stack>
              </Paper>
            )}

            {/* Places List Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="subtitle1" fontWeight={600}>
                Địa điểm xung quanh (trong bán kính 5km)
              </Typography>
              {hasNearbyPlaces && (
                <Chip
                  label={`${allNearbyPlaces.length} địa điểm`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>

            {/* Loading State */}
            {loading ? (
              <Stack spacing={2}>
                {[1, 2, 3].map((i) => (
                  <Skeleton
                    key={i}
                    variant="rectangular"
                    height={80}
                    sx={{ borderRadius: 1 }}
                  />
                ))}
              </Stack>
            ) : error ? (
              <Alert severity="warning">{error}</Alert>
            ) : !hasNearbyPlaces ? (
              <Alert severity="info">
                Chưa có thông tin về các địa điểm xung quanh
              </Alert>
            ) : (
              /* Places Accordion List */
              <Stack spacing={1}>
                {Object.entries(PLACE_CATEGORIES).map(
                  ([categoryKey, categoryConfig]) => {
                    const places = nearbyPlaces[categoryKey] || [];

                    if (places.length === 0) return null;

                    const Icon = categoryConfig.icon;

                    return (
                      <Accordion
                        key={categoryKey}
                        expanded={expanded === categoryKey}
                        onChange={(_, isExpanded) =>
                          setExpanded(isExpanded ? categoryKey : false)
                        }
                        sx={{
                          "&:before": { display: "none" },
                          boxShadow: "none",
                          border: "1px solid",
                          borderColor: "divider",
                          "&.Mui-expanded": {
                            margin: 0,
                            mb: 1,
                          },
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<ChevronDown size={20} />}
                          sx={{
                            "&.Mui-expanded": {
                              minHeight: 48,
                            },
                            "& .MuiAccordionSummary-content.Mui-expanded": {
                              margin: "12px 0",
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                              width: "100%",
                            }}
                          >
                            <Box
                              sx={{
                                width: 36,
                                height: 36,
                                borderRadius: "50%",
                                bgcolor: `${categoryConfig.color}20`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Icon size={18} color={categoryConfig.color} />
                            </Box>
                            <Typography fontWeight={600} sx={{ flex: 1 }}>
                              {categoryConfig.label}
                            </Typography>
                            <Chip
                              label={places.length}
                              size="small"
                              sx={{
                                height: 24,
                                fontSize: "0.75rem",
                                fontWeight: 600,
                                bgcolor: `${categoryConfig.color}20`,
                                color: categoryConfig.color,
                                border: "none",
                              }}
                            />
                          </Box>
                        </AccordionSummary>

                        <AccordionDetails sx={{ pt: 0 }}>
                          <List disablePadding>
                            {places.map((place, index) => (
                              <React.Fragment key={place.id}>
                                {index > 0 && <Divider />}
                                <ListItem
                                  sx={{
                                    py: 1.5,
                                    px: 2,
                                    cursor: "pointer",
                                    bgcolor:
                                      selectedPlace?.id === place.id
                                        ? "action.selected"
                                        : "transparent",
                                    "&:hover": {
                                      bgcolor: "action.hover",
                                    },
                                  }}
                                  onClick={() => handlePlaceClick(place)}
                                >
                                  <ListItemIcon sx={{ minWidth: 40 }}>
                                    <Box
                                      sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: "50%",
                                        bgcolor: categoryConfig.color,
                                      }}
                                    />
                                  </ListItemIcon>

                                  <ListItemText
                                    primary={
                                      <Stack
                                        direction="row"
                                        spacing={1}
                                        alignItems="center"
                                      >
                                        <Typography
                                          fontWeight={500}
                                          variant="body2"
                                        >
                                          {place.name}
                                        </Typography>
                                        {selectedPlace?.id === place.id && (
                                          <Chip
                                            label="Đang xem"
                                            size="small"
                                            color="primary"
                                            sx={{
                                              height: 20,
                                              fontSize: "0.65rem",
                                            }}
                                          />
                                        )}
                                      </Stack>
                                    }
                                    secondary={
                                      <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                                        <Chip
                                          label={formatDistance(place.distance)}
                                          size="small"
                                          sx={{
                                            height: 20,
                                            fontSize: "0.7rem",
                                            fontWeight: 600,
                                            bgcolor: "primary.lighter",
                                            color: "primary.main",
                                            width: "fit-content",
                                          }}
                                        />
                                        <TravelTimeChips
                                          travelTimes={place.travelTimes}
                                        />
                                      </Stack>
                                    }
                                  />

                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handlePlaceClick(place);
                                    }}
                                  >
                                    <Route size={18} />
                                  </IconButton>
                                </ListItem>
                              </React.Fragment>
                            ))}
                          </List>
                        </AccordionDetails>
                      </Accordion>
                    );
                  }
                )}
              </Stack>
            )}
          </Box>

          {/* Right Side - Map */}
          <Box sx={{ flex: 1, position: "relative" }}>
            {loadingRoute && (
              <Box
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  zIndex: 1000,
                  bgcolor: "white",
                  p: 1.5,
                  borderRadius: 1,
                  boxShadow: 2,
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <CircularProgress size={20} />
                  <Typography variant="caption">
                    Đang tính toán đường đi...
                  </Typography>
                </Stack>
              </Box>
            )}

            <MapContainer
              center={[homestay.latitude, homestay.longitude]}
              zoom={15}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <MapBoundsController bounds={mapBounds} />

              {/* Homestay Marker */}
              <Marker
                position={[homestay.latitude, homestay.longitude]}
                icon={createHomestayIcon()}
              >
                <Popup>
                  <Box sx={{ p: 1, minWidth: 200 }}>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      gutterBottom
                    >
                      {homestay.homestayTitle}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {homestay.fullAddress}
                    </Typography>
                  </Box>
                </Popup>
              </Marker>

              {/* 5km Radius Circle */}
              {!selectedPlace && (
                <Circle
                  center={[homestay.latitude, homestay.longitude]}
                  radius={5000}
                  pathOptions={{
                    color: "#1976d2",
                    fillColor: "#1976d2",
                    fillOpacity: 0.1,
                    weight: 1,
                    dashArray: "5, 5",
                  }}
                />
              )}

              {/* Route Polyline */}
              {route && route.coordinates && (
                <Polyline
                  positions={route.coordinates}
                  pathOptions={{
                    color:
                      travelMode === "walking"
                        ? "#2196F3"
                        : travelMode === "motorbike"
                        ? "#FF9800"
                        : "#4CAF50",
                    weight: 4,
                    opacity: 0.8,
                  }}
                />
              )}

              {/* Nearby Places Markers */}
              {allNearbyPlaces.map((place) => (
                <Marker
                  key={place.id}
                  position={[place.latitude, place.longitude]}
                  icon={createNearbyPlaceIcon(place.category)}
                  eventHandlers={{
                    click: () => handlePlaceClick(place),
                  }}
                >
                  <Popup>
                    <Box sx={{ p: 1, minWidth: 220 }}>
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        gutterBottom
                      >
                        {place.name}
                      </Typography>
                      <Stack spacing={1}>
                        <Chip
                          label={formatDistance(place.distance)}
                          size="small"
                          sx={{ width: "fit-content" }}
                          color="primary"
                        />
                        <TravelTimeChips travelTimes={place.travelTimes} />
                      </Stack>
                    </Box>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </Box>
        </Box>
      </Box>

      {/* CSS for custom markers */}
      <style>{`
        .custom-homestay-marker,
        .nearby-place-marker {
          background: transparent !important;
          border: none !important;
        }
        
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 3px 14px rgba(0,0,0,0.4);
        }
        
        .leaflet-popup-content {
          margin: 0;
          padding: 0;
        }
      `}</style>
    </Dialog>
  );
};

export default HomestayLocationMapDialog;
