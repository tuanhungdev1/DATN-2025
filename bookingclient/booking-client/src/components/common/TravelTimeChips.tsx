import { formatTravelTime } from "@/utils/formatDistance";
import { Chip, Stack, Tooltip } from "@mui/material";
import { Bike, Car, Footprints } from "lucide-react";
import type React from "react";

const TravelTimeChips: React.FC<{
  travelTimes?: { walking: number; motorbike: number; car: number };
}> = ({ travelTimes }) => {
  if (!travelTimes) return null;

  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 0.5 }}>
      <Tooltip title="Đi bộ">
        <Chip
          icon={<Footprints size={12} />}
          label={formatTravelTime(travelTimes.walking)}
          size="small"
          variant="outlined"
          sx={{ height: 22, fontSize: "0.7rem" }}
        />
      </Tooltip>
      <Tooltip title="Đi xe máy">
        <Chip
          icon={<Bike size={12} />}
          label={formatTravelTime(travelTimes.motorbike)}
          size="small"
          variant="outlined"
          sx={{
            height: 22,
            fontSize: "0.7rem",
            color: "#FF9800",
            borderColor: "#FF9800",
          }}
        />
      </Tooltip>
      <Tooltip title="Đi ô tô">
        <Chip
          icon={<Car size={12} />}
          label={formatTravelTime(travelTimes.car)}
          size="small"
          variant="outlined"
          sx={{
            height: 22,
            fontSize: "0.7rem",
            color: "#4CAF50",
            borderColor: "#4CAF50",
          }}
        />
      </Tooltip>
    </Stack>
  );
};

export default TravelTimeChips;
