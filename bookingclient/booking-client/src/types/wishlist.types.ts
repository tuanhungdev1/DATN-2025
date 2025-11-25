import type { Homestay } from "./homestay.types";

export interface WishlistItem {
  id: number;
  userId: number;
  homestayId: number;
  createdAt: string;
  updatedAt: string;
  homestay: Homestay;
}

export interface AddToWishlistDto {
  homestayId: number;
}

export interface UpdateWishlistItemDto {
  personalNote?: string;
}

export interface WishlistFilter {
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  pageNumber?: number;
  pageSize?: number;
}
