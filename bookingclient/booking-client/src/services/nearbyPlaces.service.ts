/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PLACE_CATEGORIES, TRAVEL_SPEEDS } from "@/constants/placeCategories";
import type { NearbyPlace } from "@/types/nearbyPlaces.types";

class NearbyPlacesService {
  private readonly OVERPASS_API = "https://overpass-api.de/api/interpreter";
  private readonly RADIUS = 2000;

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degree: number): number {
    return (degree * Math.PI) / 180;
  }

  private calculateTravelTimes(distanceMeters: number) {
    return {
      walking: Math.ceil(distanceMeters / TRAVEL_SPEEDS.walking),
      motorbike: Math.ceil(distanceMeters / TRAVEL_SPEEDS.motorbike),
      car: Math.ceil(distanceMeters / TRAVEL_SPEEDS.car),
    };
  }

  async getNearbyPlaces(
    latitude: number,
    longitude: number,
    category: keyof typeof PLACE_CATEGORIES
  ): Promise<NearbyPlace[]> {
    const categoryConfig = PLACE_CATEGORIES[category];

    const nodeQueries = categoryConfig.tags
      .map((tag) => {
        const [key, value] = tag.split("=");
        return `node["${key}"="${value}"](around:${this.RADIUS},${latitude},${longitude});`;
      })
      .join("\n");

    const query = `
      [out:json][timeout:25];
      (
        ${nodeQueries}
      );
      out body;
    `;

    try {
      const response = await fetch(this.OVERPASS_API, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `data=${encodeURIComponent(query)}`,
      });

      const data = await response.json();

      const places: NearbyPlace[] = data.elements
        .filter((element: any) => element.tags?.name)
        .map((element: any) => {
          const distance = this.calculateDistance(
            latitude,
            longitude,
            element.lat,
            element.lon
          );
          const distanceMeters = Math.round(distance * 1000);

          return {
            id: element.id.toString(),
            name: element.tags.name,
            type:
              element.tags.amenity ||
              element.tags.shop ||
              element.tags.tourism ||
              category,
            category,
            distance: distanceMeters,
            latitude: element.lat,
            longitude: element.lon,
            travelTimes: this.calculateTravelTimes(distanceMeters),
          };
        })
        .sort((a: NearbyPlace, b: NearbyPlace) => a.distance - b.distance)
        .slice(0, 5);

      return places;
    } catch (error) {
      console.error("Error fetching nearby places:", error);
      return [];
    }
  }

  async getAllNearbyPlaces(
    latitude: number,
    longitude: number
  ): Promise<Record<string, NearbyPlace[]>> {
    const categories = Object.keys(PLACE_CATEGORIES);
    const results: Record<string, NearbyPlace[]> = {};

    await Promise.all(
      categories.map(async (category) => {
        try {
          results[category] = await this.getNearbyPlaces(
            latitude,
            longitude,
            category as keyof typeof PLACE_CATEGORIES
          );
        } catch (error) {
          results[category] = [];
        }
      })
    );

    return results;
  }
}

export const nearbyPlacesService = new NearbyPlacesService();
