/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/services/api.service";
import type { ApiResponse, PagedResult } from "@/types/baseApi.types";
import type {
  WishlistItem,
  AddToWishlistDto,
  UpdateWishlistItemDto,
  WishlistFilter,
} from "@/types/wishlist.types";
import type { EndpointBuilder } from "@reduxjs/toolkit/query";

export const wishlistApi = baseApi.injectEndpoints({
  endpoints: (builder: EndpointBuilder<any, any, any>) => ({
    // Add to wishlist
    addToWishlist: builder.mutation<
      ApiResponse<WishlistItem>,
      AddToWishlistDto
    >({
      query: (data) => ({
        url: "/WishlistItem",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Wishlist"],
    }),

    // Remove from wishlist by wishlist item ID
    removeFromWishlist: builder.mutation<ApiResponse<object>, number>({
      query: (wishlistItemId) => ({
        url: `/WishlistItem/${wishlistItemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),

    // Remove from wishlist by homestay ID
    removeByHomestay: builder.mutation<ApiResponse<object>, number>({
      query: (homestayId) => ({
        url: `/WishlistItem/by-homestay/${homestayId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),

    // Update wishlist item
    updateWishlistItem: builder.mutation<
      ApiResponse<WishlistItem>,
      { wishlistItemId: number; data: UpdateWishlistItemDto }
    >({
      query: ({ wishlistItemId, data }) => ({
        url: `/WishlistItem/${wishlistItemId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Wishlist"],
    }),

    // Get wishlist item by ID
    getWishlistItemById: builder.query<ApiResponse<WishlistItem>, number>({
      query: (wishlistItemId) => ({
        url: `/WishlistItem/${wishlistItemId}`,
        method: "GET",
      }),
      providesTags: ["Wishlist"],
    }),

    // Get user wishlist with filters
    getUserWishlist: builder.query<
      ApiResponse<PagedResult<WishlistItem>>,
      WishlistFilter
    >({
      query: (filters) => {
        const params = new URLSearchParams();

        if (filters.search) params.append("search", filters.search);
        if (filters.sortBy) params.append("sortBy", filters.sortBy);
        if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);
        params.append("pageNumber", String(filters.pageNumber || 1));
        params.append("pageSize", String(filters.pageSize || 12));

        return `/WishlistItem?${params.toString()}`;
      },
      providesTags: ["Wishlist"],
    }),

    // Check if homestay is in wishlist
    isInWishlist: builder.query<ApiResponse<boolean>, number>({
      query: (homestayId) => ({
        url: `/WishlistItem/exists/${homestayId}`,
        method: "GET",
      }),
      providesTags: ["Wishlist"],
    }),

    // Get wishlist count
    getWishlistCount: builder.query<ApiResponse<number>, void>({
      query: () => ({
        url: "/WishlistItem/count",
        method: "GET",
      }),
      providesTags: ["Wishlist"],
    }),

    // Clear all wishlist
    clearWishlist: builder.mutation<ApiResponse<object>, void>({
      query: () => ({
        url: "/WishlistItem/clear",
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),
  }),
});

export const {
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useRemoveByHomestayMutation,
  useUpdateWishlistItemMutation,
  useGetWishlistItemByIdQuery,
  useGetUserWishlistQuery,
  useIsInWishlistQuery,
  useGetWishlistCountQuery,
  useClearWishlistMutation,
} = wishlistApi;
