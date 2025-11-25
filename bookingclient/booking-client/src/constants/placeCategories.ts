import type { PlaceCategory } from "@/types/nearbyPlaces.types";
import {
  UtensilsCrossed,
  ShoppingBag,
  Bus,
  Landmark,
  Hospital,
  Film,
} from "lucide-react";

export const PLACE_CATEGORIES: Record<string, PlaceCategory> = {
  restaurant: {
    icon: UtensilsCrossed,
    label: "Nhà hàng & Quán ăn",
    color: "#FF6B6B",
    tags: ["amenity=restaurant", "amenity=cafe", "amenity=fast_food"],
  },
  shopping: {
    icon: ShoppingBag,
    label: "Mua sắm",
    color: "#4ECDC4",
    tags: ["shop=mall", "shop=supermarket", "shop=convenience"],
  },
  transport: {
    icon: Bus,
    label: "Giao thông công cộng",
    color: "#95E1D3",
    tags: [
      "amenity=bus_station",
      "railway=station",
      "public_transport=stop_position",
    ],
  },
  attraction: {
    icon: Landmark,
    label: "Điểm tham quan",
    color: "#F38181",
    tags: [
      "tourism=attraction",
      "tourism=museum",
      "historic=monument",
      "tourism=viewpoint",
    ],
  },
  healthcare: {
    icon: Hospital,
    label: "Y tế & Sức khỏe",
    color: "#AA96DA",
    tags: ["amenity=hospital", "amenity=clinic", "amenity=pharmacy"],
  },
  entertainment: {
    icon: Film,
    label: "Giải trí",
    color: "#FCBAD3",
    tags: [
      "amenity=cinema",
      "leisure=park",
      "amenity=theatre",
      "leisure=sports_centre",
    ],
  },
};

// Tốc độ trung bình (m/phút)
export const TRAVEL_SPEEDS = {
  walking: 80, // 4.8 km/h
  motorbike: 500, // 30 km/h (trong thành phố)
  car: 416, // 25 km/h (trong thành phố, có tắc đường)
};
