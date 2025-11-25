/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Box,
  Chip,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
  IconButton,
  CircularProgress,
  Skeleton,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Bike,
  Car,
  ChevronDown,
  Footprints,
  MapPin,
  Route,
  X,
} from "lucide-react";

import type { Homestay } from "@/types/homestay.types";
import { nearbyPlacesService } from "@/services/nearbyPlaces.service";
import type {
  NearbyPlace,
  RouteInfo,
  TravelMode,
} from "@/types/nearbyPlaces.types";
import { routingService } from "@/services/RoutingService";
import { formatTravelTime, formatDistance } from "@/utils/formatDistance";
import L from "leaflet";
import {
  Circle,
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";
import MapBoundsController from "./MapBoundsController";
import { createHomestayIcon, createNearbyPlaceIcon } from "@/utils/mapIcons";
import TravelTimeChips from "./TravelTimeChips";
import { PLACE_CATEGORIES } from "@/constants/placeCategories";
import { AppButton } from "../button";
import HomestayLocationMapDialog from "../googleMap/HomestayLocationMapDialog";

const LocationInfo = ({ homestay }: { homestay: Homestay }) => {
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
  const [showLocationDialog, setShowLocationDialog] = useState(false);

  useEffect(() => {
    loadNearbyPlaces();
  }, [homestay.id]);

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
      // Map travel mode to OSRM profile
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
    <Paper sx={{ p: 3, mb: 3 }}>
      {/* Header */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: "flex" }}>
        <MapPin size={20} style={{ verticalAlign: "middle", marginRight: 8 }} />
        Vị trí & Xung quanh
      </Typography>

      <AppButton
        variant="outlined"
        startIcon={<MapPin size={16} />}
        onClick={() => setShowLocationDialog(true)}
        sx={{ mb: 2 }}
      >
        Xem vị trí & địa điểm xung quanh
      </AppButton>

      {/* Dialog */}
      <HomestayLocationMapDialog
        open={showLocationDialog}
        onClose={() => setShowLocationDialog(false)}
        homestay={homestay}
      />

      {/* Address Info */}
      <Stack spacing={1.5} sx={{ mb: 3 }}>
        <Typography variant="body1" fontWeight={500}>
          {homestay.fullAddress}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {homestay.city}, {homestay.province}, {homestay.country}
        </Typography>
        {homestay.postalCode && (
          <Typography variant="caption" color="text.secondary">
            Mã bưu điện: {homestay.postalCode}
          </Typography>
        )}
      </Stack>

      {/* Travel Mode Selector - Show when place is selected */}
      {selectedPlace && (
        <Box sx={{ mb: 2, p: 2, bgcolor: "primary.lighter", borderRadius: 1 }}>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                <Route
                  size={16}
                  style={{ verticalAlign: "middle", marginRight: 4 }}
                />
                Đường đi đến: {selectedPlace.name}
              </Typography>
              {route && (
                <Typography variant="caption" color="text.secondary">
                  Khoảng cách: {formatDistance(route.distance)} • Thời gian:{" "}
                  {formatTravelTime(Math.ceil(route.duration / 60))}
                </Typography>
              )}
            </Box>

            <Stack direction="row" spacing={1} alignItems="center">
              <ToggleButtonGroup
                value={travelMode}
                exclusive
                onChange={(_, newMode) => {
                  if (newMode) {
                    setTravelMode(newMode);
                    handlePlaceClick(selectedPlace); // Reload route with new mode
                  }
                }}
                size="small"
              >
                <ToggleButton value="walking">
                  <Tooltip title="Đi bộ">
                    <Footprints size={18} />
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="motorbike">
                  <Tooltip title="Xe máy">
                    <Bike size={18} />
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="car">
                  <Tooltip title="Ô tô">
                    <Car size={18} />
                  </Tooltip>
                </ToggleButton>
              </ToggleButtonGroup>

              <IconButton size="small" onClick={handleClearRoute} color="error">
                <X size={18} />
              </IconButton>
            </Stack>
          </Stack>
        </Box>
      )}

      {/* Map */}
      <Box
        sx={{
          height: 400,
          width: "100%",
          borderRadius: 2,
          overflow: "hidden",
          mb: 3,
          border: "1px solid",
          borderColor: "divider",
          position: "relative",
        }}
      >
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
          scrollWheelZoom={false}
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
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  {homestay.homestayTitle}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {homestay.fullAddress}
                </Typography>
              </Box>
            </Popup>
          </Marker>

          {/* 2km Radius Circle */}
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
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
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

      {/* Nearby Places List */}
      <Box>
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
                                        sx={{ height: 20, fontSize: "0.65rem" }}
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
    </Paper>
  );
};

export default LocationInfo;
