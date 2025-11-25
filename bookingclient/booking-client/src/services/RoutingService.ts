import type { RouteInfo } from "@/types/nearbyPlaces.types";

class RoutingService {
  // Sử dụng OSRM (Open Source Routing Machine) - miễn phí
  private readonly OSRM_API = "https://router.project-osrm.org/route/v1";

  async getRoute(
    fromLat: number,
    fromLng: number,
    toLat: number,
    toLng: number,
    mode: "driving" | "walking" | "cycling" = "driving"
  ): Promise<RouteInfo | null> {
    try {
      const url = `${this.OSRM_API}/${mode}/${fromLng},${fromLat};${toLng},${toLat}?overview=full&geometries=geojson`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.code === "Ok" && data.routes && data.routes.length > 0) {
        const route = data.routes[0];

        return {
          coordinates: route.geometry.coordinates.map((coord: number[]) => [
            coord[1],
            coord[0],
          ]),
          distance: route.distance, // meters
          duration: route.duration, // seconds
        };
      }

      return null;
    } catch (error) {
      console.error("Error fetching route:", error);
      return null;
    }
  }
}

export const routingService = new RoutingService();
