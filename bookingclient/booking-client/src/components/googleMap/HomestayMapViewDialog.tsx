/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  Tooltip as LeafletTooltip,
} from "react-leaflet";
import {
  Box,
  Dialog,
  IconButton,
  Typography,
  Paper,
  Drawer,
  Stack,
  Badge,
  Rating,
} from "@mui/material";
import { Close as CloseIcon, FilterList } from "@mui/icons-material";
import L from "leaflet";
import { Formik, Form } from "formik";
import type { Homestay, HomestayFilter } from "@/types/homestay.types";
import HomestayCard from "@/components/homestayCard/HomestayCard";
import { AppButton } from "@/components/button";
import "leaflet/dist/leaflet.css";
import HomestayFilterComponent from "@/pages/dashboard/homestay/components/HomestayFilter";
import { AppImage } from "../images";
import { Heart, MapPin, Sofa, Users } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";

const HomestayTooltipCard: React.FC<{
  homestay: Homestay;
  onFavoriteToggle?: (id: number) => void;
  isFavorite?: boolean;
  onClick?: () => void;
}> = ({ homestay, onFavoriteToggle, isFavorite, onClick }) => {
  const { toggleWishlist, isLoading } = useWishlist(homestay.id);

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(homestay.id);
    onFavoriteToggle?.(homestay.id);
  };

  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "background.paper",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: 3,
        width: 320,
        cursor: "pointer",
        transition: "transform 0.2s",
        "&:hover": { transform: "translateY(-2px)" },
      }}
      onClick={onClick}
    >
      {/* Image */}
      <Box
        sx={{ flexShrink: 0, width: 120, height: 120, position: "relative" }}
      >
        <AppImage
          src={homestay.mainImageUrl || homestay.images[0]?.imageUrl}
          alt={homestay.homestayTitle}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          useBlurEffect={true}
        />
        {/* Favorite Button */}
        <IconButton
          size="small"
          onClick={handleFavorite}
          disabled={isLoading}
          sx={{
            position: "absolute",
            top: 6,
            right: 6,
            bgcolor: "rgba(255,255,255,0.9)",
            "&:hover": { bgcolor: "white" },
            width: 28,
            height: 28,
          }}
        >
          <Heart
            size={14}
            fill={isFavorite ? "#e7000b" : "none"}
            color={isFavorite ? "#e7000b" : "#666"}
          />
        </IconButton>
      </Box>

      {/* Content */}
      <Box sx={{ p: 1.5, flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Title */}
        <Typography
          variant="subtitle2"
          fontWeight={600}
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            mb: 0.5,
          }}
        >
          {homestay.homestayTitle}
        </Typography>

        {/* Location */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
          <MapPin size={12} color="#666" />
          <Typography variant="caption" color="text.secondary">
            {homestay.city}
          </Typography>
        </Box>

        {/* Amenities */}
        <Box sx={{ display: "flex", gap: 1, mb: 0.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.3 }}>
            <Users size={12} color="#666" />
            <Typography variant="caption" color="text.secondary">
              {homestay.maximumGuests}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.3 }}>
            <Sofa size={12} color="#666" />
            <Typography variant="caption" color="text.secondary">
              {homestay.numberOfBedrooms}
            </Typography>
          </Box>
        </Box>

        {/* Rating */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
          <Rating value={homestay.ratingAverage} size="small" readOnly />
          <Typography variant="caption" color="text.secondary">
            {homestay.ratingAverage.toFixed(1)}
          </Typography>
        </Box>

        {/* Price */}
        <Box sx={{ mt: "auto", display: "flex", alignItems: "baseline" }}>
          <Typography variant="subtitle1" fontWeight={700} color="primary.main">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            })
              .format(homestay.baseNightlyPrice)
              .replace("₫", "VND")}
          </Typography>
          <Typography variant="caption" color="text.secondary" ml={0.5}>
            / đêm
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

// Fix Leaflet icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface HomestayMapViewDialogProps {
  open: boolean;
  homestays: Homestay[];
  onClose: () => void;
  onHomestayClick: (id: number) => void;
  onFavoriteToggle?: (id: number) => void;
  favoriteIds?: number[];
  initialFilters?: HomestayFilter;
  onFilterChange?: (filters: HomestayFilter) => void;
}

// Custom price marker
const createPriceIcon = (price: number, isHighlighted: boolean = false) => {
  return L.divIcon({
    className: "custom-price-marker",
    html: `
      <div
        class="price-label"
        style="
        background: #003b95;
        color: white;
        padding: 2px 6px;
        border-radius: 2px;
        width: fit-content;
        font-size: 13px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.25);
        cursor: pointer;
        transition: all 0.3s ease;
        white-space: nowrap;
        font-family: 'Roboto', sans-serif;
        transform: translateY(-6px);
      ">
        VND ${price.toLocaleString()}
      </div>
    `,
    iconSize: [80, 30], // Tăng width một chút để phù hợp với format tiền mới
    iconAnchor: [40, 15],
  });
};

// Component to auto-fly to selected homestay
const MapController: React.FC<{
  selectedId: number | null;
  homestays: Homestay[];
}> = ({ selectedId, homestays }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedId) {
      const homestay = homestays.find((h) => h.id === selectedId);
      if (homestay) {
        map.flyTo([homestay.latitude, homestay.longitude], 15, {
          duration: 0.5,
        });
      }
    }
  }, [selectedId, homestays, map]);

  return null;
};

const HomestayMapViewDialog: React.FC<HomestayMapViewDialogProps> = ({
  open,
  homestays,
  onClose,
  onFavoriteToggle,
  favoriteIds = [],
  initialFilters = {},
  onFilterChange,
}) => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<HomestayFilter>(initialFilters);
  const listRef = useRef<HTMLDivElement>(null);

  // Calculate map center
  const center = useMemo((): [number, number] => {
    if (homestays.length === 0) {
      return [21.0285, 105.8542];
    }
    const avgLat =
      homestays.reduce((sum, h) => sum + h.latitude, 0) / homestays.length;
    const avgLng =
      homestays.reduce((sum, h) => sum + h.longitude, 0) / homestays.length;
    return [avgLat, avgLng];
  }, [homestays]);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.minPrice && filters.minPrice > 0) count++;
    if (filters.maxPrice && filters.maxPrice < 10000000) count++;
    if (filters.minRating) count++;
    if (filters.propertyTypeIds && filters.propertyTypeIds.length > 0) count++;
    if (filters.amenityIds && filters.amenityIds.length > 0) count++;
    if (filters.minGuests) count++;
    if (filters.minBedrooms) count++;
    if (filters.minBathrooms) count++;
    if (filters.isInstantBook) count++;
    if (filters.isFeatured) count++;
    if (filters.hasParking) count++;
    if (filters.isPetFriendly) count++;
    if (filters.hasPrivatePool) count++;
    return count;
  }, [filters]);

  const handleMarkerClick = useCallback((homestayId: number) => {
    setSelectedId(homestayId);
    const cardElement = document.getElementById(`homestay-card-${homestayId}`);
    if (cardElement && listRef.current) {
      cardElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  const handleCardClick = useCallback((homestayId: number) => {
    setSelectedId(homestayId);
  }, []);

  const handleFilterSubmit = useCallback(
    (values: HomestayFilter) => {
      setFilters(values);
      onFilterChange?.(values);
      setShowFilter(false);
    },
    [onFilterChange]
  );

  const handleResetFilters = useCallback(() => {
    const resetFilters: HomestayFilter = {
      minPrice: 0,
      maxPrice: 10000000,
      pageNumber: 1,
      pageSize: 100,
    };
    setFilters(resetFilters);
    onFilterChange?.(resetFilters);
  }, [onFilterChange]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      PaperProps={{
        sx: { backgroundColor: "#f5f5f5" },
      }}
    >
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="h6" fontWeight={600}>
              {homestays.length} homestay được tìm thấy
            </Typography>

            {/* Filter Button */}
            <Badge badgeContent={activeFiltersCount} color="primary">
              <AppButton
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => setShowFilter(true)}
                size="small"
              >
                Bộ lọc
              </AppButton>
            </Badge>

            {/* View Mode Toggle */}
            {/* <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_, newMode) => newMode && setViewMode(newMode)}
              size="small"
            >
              <ToggleButton value="grid">
                <GridView fontSize="small" />
              </ToggleButton>
              <ToggleButton value="list">
                <ViewList fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup> */}
          </Box>

          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Paper>

        {/* Main Content */}
        <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* Map Section - Left/Center */}
          <Box sx={{ flex: "0 0 70%", position: "relative" }}>
            <MapContainer
              center={center}
              zoom={12}
              style={{ height: "100%", width: "100%" }}
              zoomControl={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <MapController selectedId={selectedId} homestays={homestays} />

              {homestays.map((homestay) => (
                <Marker
                  key={homestay.id}
                  position={[homestay.latitude, homestay.longitude]}
                  icon={createPriceIcon(
                    homestay.baseNightlyPrice,
                    hoveredId === homestay.id || selectedId === homestay.id
                  )}
                  eventHandlers={{
                    click: () => handleMarkerClick(homestay.id),
                    mouseover: () => setHoveredId(homestay.id),
                    mouseout: () => setHoveredId(null),
                  }}
                >
                  {/* Tooltip on hover */}
                  <LeafletTooltip
                    direction="auto" // Sử dụng 'auto' để Leaflet tự chọn vị trí phù hợp, tránh vượt bounds
                    offset={[0, 0]}
                    opacity={1}
                    permanent={false} // Chỉ hiển thị khi hover, không permanent
                    className="homestay-tooltip"
                  >
                    <Box
                      sx={{
                        width: "min-content",
                        p: 0,
                        "& .MuiCard-root": {
                          boxShadow: "none",
                          border: "none",
                        },
                      }}
                    >
                      <HomestayCard
                        homestay={homestay}
                        viewMode="grid"
                        onFavoriteToggle={onFavoriteToggle}
                        isFavorite={favoriteIds.includes(homestay.id)}
                      />
                    </Box>
                  </LeafletTooltip>
                </Marker>
              ))}
            </MapContainer>
          </Box>

          {/* List Section - Right Side */}
          <Box
            ref={listRef}
            sx={{
              flex: "0 0 30%",
              overflowY: "auto",
              backgroundColor: "white",
              p: 2,
            }}
          >
            <Stack
              spacing={2}
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: 2,
              }}
            >
              {homestays.map((homestay) => (
                <Box
                  key={homestay.id}
                  id={`homestay-card-${homestay.id}`}
                  onClick={() => handleCardClick(homestay.id)}
                  onMouseEnter={() => setHoveredId(homestay.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  sx={{
                    border: "2px solid",
                    borderColor:
                      selectedId === homestay.id ? "#1976d2" : "transparent",
                    borderRadius: "10px",
                    transition: "all 0.3s",
                    "&:hover": {
                      borderColor: "#1976d2",
                      boxShadow: 3,
                    },
                  }}
                >
                  <HomestayCard
                    homestay={homestay}
                    viewMode={"grid"}
                    onFavoriteToggle={onFavoriteToggle}
                    isFavorite={favoriteIds.includes(homestay.id)}
                  />
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>
      </Box>

      {/* Filter Drawer */}
      <Drawer
        anchor="right"
        open={showFilter}
        onClose={() => setShowFilter(false)}
        PaperProps={{
          sx: { width: { xs: "100%", sm: 400 }, zIndex: 1400 }, // Tăng zIndex để đảm bảo Drawer overlay lên Dialog fullScreen
        }}
        ModalProps={{
          container: document.body,
          style: { zIndex: 1400 },
        }}
        style={{ zIndex: 1400 }}
      >
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          {/* Drawer Header */}
          <Box
            sx={{
              p: 2,
              borderBottom: "1px solid",
              borderColor: "divider",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              Bộ lọc tìm kiếm
            </Typography>
            <IconButton onClick={() => setShowFilter(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Filter Content */}
          <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
            <Formik
              initialValues={filters}
              onSubmit={handleFilterSubmit}
              enableReinitialize
            >
              {({ submitForm }) => (
                <Form>
                  <HomestayFilterComponent onReset={handleResetFilters} />

                  {/* Apply Button */}
                  <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                    <AppButton
                      fullWidth
                      onClick={submitForm}
                      variant="contained"
                    >
                      Áp dụng bộ lọc
                    </AppButton>
                  </Box>
                </Form>
              )}
            </Formik>
          </Box>
        </Box>
      </Drawer>

      {/* Custom CSS for Leaflet Tooltip */}
      <style>{`
        .leaflet-tooltip {
          background: transparent;
          border: none;
          box-shadow: none;
          padding: 0;
        }
        
        .leaflet-tooltip:before {
          border-color: transparent;
        }

        .custom-price-marker::after {
            content: "";
            position: absolute;
            bottom: 2px; /* khoảng cách dưới nhãn */
            left: 50%;
            border-width: 6px;
            border-style: solid;
            border-color: #003b95 transparent transparent transparent;
        }
        
        .custom-price-marker {
          background: transparent !important;
          border: none !important;
        }

        
      `}</style>
    </Dialog>
  );
};

export default HomestayMapViewDialog;
