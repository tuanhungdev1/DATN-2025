/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { Box, TextField, Stack } from "@mui/material";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { AppButton } from "../button";

// Fix marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface LeafletMapPickerProps {
  latitude?: number;
  longitude?: number;
  onLocationSelect: (
    lat: number,
    lng: number,
    address: string,
    locationData?: {
      city?: string;
      province?: string;
      country?: string;
      postalCode?: string;
      fullAddress?: string;
    }
  ) => void;
}

// Component để xử lý click trên map
const LocationMarker: React.FC<{
  position: [number, number] | null;
  onPositionChange: (lat: number, lng: number) => void;
}> = ({ position, onPositionChange }) => {
  useMapEvents({
    click(e) {
      onPositionChange(e.latlng.lat, e.latlng.lng);
    },
  });

  return position ? <Marker position={position} /> : null;
};

const LeafletMapPicker: React.FC<LeafletMapPickerProps> = ({
  latitude,
  longitude,
  onLocationSelect,
}) => {
  const [position, setPosition] = useState<[number, number] | null>(
    latitude && longitude ? [latitude, longitude] : null
  );
  const [center, setCenter] = useState<[number, number]>(
    latitude && longitude ? [latitude, longitude] : [21.0285, 105.8542] // Hanoi default
  );
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const mapRef = useRef<L.Map | null>(null);

  const handlePositionChange = useCallback(
    async (lat: number, lng: number) => {
      setPosition([lat, lng]);

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
          {
            headers: {
              "Accept-Language": "vi",
            },
          }
        );
        const data = await response.json();

        const locationData = {
          city:
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            "",
          province: data.address?.state || data.address?.province || "",
          country: data.address?.country || "Việt Nam",
          postalCode: data.address?.postcode || "",
          fullAddress:
            data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        };

        onLocationSelect(lat, lng, data.display_name, locationData);
      } catch (error) {
        console.error("Reverse geocoding error:", error);
        onLocationSelect(lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      }
    },
    [onLocationSelect]
  );

  const handleSearch = async () => {
    if (!searchValue.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchValue
        )}&limit=1&countrycodes=vn&addressdetails=1`,
        {
          headers: {
            "Accept-Language": "vi",
          },
        }
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon, display_name, address } = data[0];
        const latNum = parseFloat(lat);
        const lngNum = parseFloat(lon);

        const locationData = {
          city: address?.city || address?.town || address?.village || "",
          province: address?.state || address?.province || "",
          country: address?.country || "Việt Nam",
          postalCode: address?.postcode || "",
          fullAddress: display_name,
        };

        setCenter([latNum, lngNum]);
        setPosition([latNum, lngNum]);
        onLocationSelect(latNum, lngNum, display_name, locationData);

        if (mapRef.current) {
          mapRef.current.flyTo([latNum, lngNum], 15);
        }
      } else {
        alert("Không tìm thấy địa điểm. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Search error:", error);
      alert("Có lỗi xảy ra khi tìm kiếm");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Box>
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <TextField
          fullWidth
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Nhập địa chỉ hoặc tên địa điểm..."
          size="small"
          sx={{
            borderRadius: "4px",
          }}
        />
        <AppButton
          variant="contained"
          onClick={handleSearch}
          disabled={isSearching}
          sx={{ minWidth: 150 }}
        >
          {isSearching ? "Đang tìm..." : "Tìm kiếm"}
        </AppButton>
      </Stack>

      <Box
        sx={{
          height: 400,
          width: "100%",
          border: "2px solid #e0e0e0",
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        <MapContainer
          center={center}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker
            position={position}
            onPositionChange={handlePositionChange}
          />
        </MapContainer>
      </Box>

      <Box sx={{ mt: 1, color: "text.secondary", fontSize: "0.875rem" }}>
        💡 <strong>Hướng dẫn:</strong> Click vào bản đồ để chọn vị trí homestay
        hoặc sử dụng tìm kiếm
      </Box>

      {position && (
        <Box
          sx={{ mt: 1, p: 1.5, bgcolor: "success.lighter", borderRadius: 1 }}
        >
          ✓ Đã chọn vị trí:{" "}
          <strong>
            {position[0].toFixed(6)}, {position[1].toFixed(6)}
          </strong>
        </Box>
      )}
    </Box>
  );
};

export default LeafletMapPicker;
