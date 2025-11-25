import type React from "react";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

const MapBoundsController: React.FC<{
  bounds: L.LatLngBounds | null;
}> = ({ bounds }) => {
  const map = useMap();

  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);

  return null;
};

export default MapBoundsController;
