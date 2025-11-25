import { Box, Chip, Stack, Typography } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { Navigation } from "lucide-react";
import { formatDistance, getWalkingTime } from "@/utils/formatDistance";
import { createHomestayIcon, createNearbyPlaceIcon } from "@/utils/mapIcons";
import type { Homestay } from "@/types/homestay.types";
import "@/styles/mapStyles.css";
import type { NearbyPlace } from "@/types/nearbyPlaces.types";

interface NearbyPlacesMapProps {
  homestay: Homestay;
  nearbyPlaces: NearbyPlace[];
  showNearbyOnMap: boolean;
}

export const NearbyPlacesMap = ({
  homestay,
  nearbyPlaces,
  showNearbyOnMap,
}: NearbyPlacesMapProps) => {
  return (
    <Box
      sx={{
        height: 400,
        width: "100%",
        borderRadius: 2,
        overflow: "hidden",
        mb: 3,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
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

        <Circle
          center={[homestay.latitude, homestay.longitude]}
          radius={2000}
          pathOptions={{
            color: "#1976d2",
            fillColor: "#1976d2",
            fillOpacity: 0.1,
            weight: 1,
            dashArray: "5, 5",
          }}
        />

        {showNearbyOnMap &&
          nearbyPlaces.map((place) => (
            <Marker
              key={place.id}
              position={[place.latitude, place.longitude]}
              icon={createNearbyPlaceIcon(place.category)}
            >
              <Popup>
                <Box sx={{ p: 1 }}>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    {place.name}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                      label={formatDistance(place.distance)}
                      size="small"
                      sx={{ height: 20, fontSize: "0.7rem" }}
                      color="primary"
                    />
                    <Typography variant="caption" color="text.secondary">
                      <Navigation
                        size={12}
                        style={{ verticalAlign: "middle" }}
                      />{" "}
                      {getWalkingTime(place.distance)}
                    </Typography>
                  </Stack>
                </Box>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </Box>
  );
};
