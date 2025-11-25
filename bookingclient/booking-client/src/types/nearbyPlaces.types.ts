/* eslint-disable @typescript-eslint/no-explicit-any */

export interface NearbyPlace {
  id: string;
  name: string;
  type: string;
  category: string;
  distance: number;
  latitude: number;
  longitude: number;
  travelTimes?: {
    walking: number;
    motorbike: number;
    car: number;
  };
}

export interface PlaceCategory {
  icon: any;
  label: string;
  color: string;
  tags: string[];
}

export interface RouteInfo {
  coordinates: [number, number][];
  distance: number;
  duration: number;
}

export type TravelMode = "walking" | "motorbike" | "car";
