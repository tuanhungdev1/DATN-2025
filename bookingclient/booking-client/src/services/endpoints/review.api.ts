// src/services/reviewApi.service.ts

/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/services/api.service";
import type { ApiResponse, PagedResult } from "@/types/baseApi.types";
import type {
  CreateReview,
  UpdateReview,
  HostResponse,
  Review,
  ReviewFilter,
  HomestayReviewStatistics,
  UserReviewStatistics,
  HelpfulToggleResult,
} from "@/types/review.types";
import type { EndpointBuilder } from "@reduxjs/toolkit/query";

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder: EndpointBuilder<any, any, any>) => ({
    // CREATE: Tạo review mới
    createReview: builder.mutation<ApiResponse<Review>, CreateReview>({
      query: (data) => ({
        url: "/review",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Review", "ReviewStats", "Homestay"],
    }),

    getHostReviews: builder.query<
      ApiResponse<PagedResult<Review>>,
      ReviewFilter
    >({
      query: (filters) => {
        const params = new URLSearchParams();

        if (filters.searchTerm) params.append("searchTerm", filters.searchTerm);
        if (filters.homestayId)
          params.append("homestayId", String(filters.homestayId));
        if (filters.reviewerId)
          params.append("reviewerId", String(filters.reviewerId));
        if (filters.revieweeId)
          params.append("revieweeId", String(filters.revieweeId));
        if (filters.minOverallRating !== undefined)
          params.append("minOverallRating", String(filters.minOverallRating));
        if (filters.maxOverallRating !== undefined)
          params.append("maxOverallRating", String(filters.maxOverallRating));
        if (filters.isVisible !== undefined)
          params.append("isVisible", String(filters.isVisible));
        if (filters.isRecommended !== undefined)
          params.append("isRecommended", String(filters.isRecommended));
        if (filters.hasHostResponse !== undefined)
          params.append("hasHostResponse", String(filters.hasHostResponse));
        if (filters.createdFrom)
          params.append("createdFrom", filters.createdFrom);
        if (filters.createdTo) params.append("createdTo", filters.createdTo);
        if (filters.sortBy) params.append("sortBy", filters.sortBy);
        if (filters.sortDirection)
          params.append("sortDirection", filters.sortDirection);
        params.append("pageNumber", String(filters.pageNumber || 1));
        params.append("pageSize", String(filters.pageSize || 10));

        return {
          url: `/review/host?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Review"],
    }),

    // READ: Lấy review theo ID
    getReviewById: builder.query<ApiResponse<Review>, number>({
      query: (id) => `/review/${id}`,
      providesTags: (result, error, id) => [{ type: "Review", id }],
    }),

    // READ: Lấy tất cả reviews (Admin)
    getAllReviews: builder.query<
      ApiResponse<PagedResult<Review>>,
      ReviewFilter
    >({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters.searchTerm) params.append("searchTerm", filters.searchTerm);
        if (filters.homestayId)
          params.append("homestayId", String(filters.homestayId));
        if (filters.reviewerId)
          params.append("reviewerId", String(filters.reviewerId));
        if (filters.revieweeId)
          params.append("revieweeId", String(filters.revieweeId));
        if (filters.bookingId)
          params.append("bookingId", String(filters.bookingId));
        if (filters.minOverallRating !== undefined)
          params.append("minOverallRating", String(filters.minOverallRating));
        if (filters.maxOverallRating !== undefined)
          params.append("maxOverallRating", String(filters.maxOverallRating));
        if (filters.isVisible !== undefined)
          params.append("isVisible", String(filters.isVisible));
        if (filters.isRecommended !== undefined)
          params.append("isRecommended", String(filters.isRecommended));
        if (filters.hasHostResponse !== undefined)
          params.append("hasHostResponse", String(filters.hasHostResponse));
        if (filters.createdFrom)
          params.append("createdFrom", filters.createdFrom);
        if (filters.createdTo) params.append("createdTo", filters.createdTo);
        if (filters.sortBy) params.append("sortBy", filters.sortBy);
        if (filters.sortDirection)
          params.append("sortDirection", filters.sortDirection);
        params.append("pageNumber", String(filters.pageNumber || 1));
        params.append("pageSize", String(filters.pageSize || 10));

        return `/review/all?${params.toString()}`;
      },
      providesTags: ["Review"],
    }),

    // READ: Reviews của homestay
    getHomestayReviews: builder.query<
      ApiResponse<PagedResult<Review>>,
      { homestayId: number; filter: ReviewFilter }
    >({
      query: ({ homestayId, filter }) => {
        const params = new URLSearchParams();
        if (filter.searchTerm) params.append("searchTerm", filter.searchTerm);
        if (filter.minOverallRating !== undefined)
          params.append("minOverallRating", String(filter.minOverallRating));
        if (filter.maxOverallRating !== undefined)
          params.append("maxOverallRating", String(filter.maxOverallRating));
        if (filter.isRecommended !== undefined)
          params.append("isRecommended", String(filter.isRecommended));
        if (filter.sortBy) params.append("sortBy", filter.sortBy);
        if (filter.sortDirection)
          params.append("sortDirection", filter.sortDirection);
        params.append("pageNumber", String(filter.pageNumber || 1));
        params.append("pageSize", String(filter.pageSize || 10));

        return `/review/homestay/${homestayId}?${params.toString()}`;
      },
      providesTags: (result, error, { homestayId }) => [
        { type: "Review", id: `HOMESTAY-${homestayId}` },
      ],
    }),

    // READ: Reviews của user
    getUserReviews: builder.query<
      ApiResponse<PagedResult<Review>>,
      { userId: number; filter: ReviewFilter }
    >({
      query: ({ userId, filter }) => {
        const params = new URLSearchParams();
        if (filter.pageNumber)
          params.append("pageNumber", String(filter.pageNumber));
        if (filter.pageSize) params.append("pageSize", String(filter.pageSize));
        if (filter.sortBy) params.append("sortBy", filter.sortBy);
        if (filter.sortDirection)
          params.append("sortDirection", filter.sortDirection);

        return `/review/user/${userId}?${params.toString()}`;
      },
      providesTags: (result, error, { userId }) => [
        { type: "Review", id: `USER-${userId}` },
      ],
    }),

    // READ: Reviews của user hiện tại
    getMyReviews: builder.query<ApiResponse<PagedResult<Review>>, ReviewFilter>(
      {
        query: (filter) => {
          const params = new URLSearchParams();
          if (filter.pageNumber)
            params.append("pageNumber", String(filter.pageNumber));
          if (filter.pageSize)
            params.append("pageSize", String(filter.pageSize));
          if (filter.sortBy) params.append("sortBy", filter.sortBy);
          if (filter.sortDirection)
            params.append("sortDirection", filter.sortDirection);

          return `/review/my-reviews?${params.toString()}`;
        },
        providesTags: ["Review"],
      }
    ),

    // UPDATE: Cập nhật review
    updateReview: builder.mutation<
      ApiResponse<Review>,
      { id: number; data: UpdateReview }
    >({
      query: ({ id, data }) => ({
        url: `/review/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Review", id },
        "Review",
        "ReviewStats", // ✅ Invalidate tất cả stats
        "Homestay",
      ],
    }),

    // DELETE: Xóa review
    deleteReview: builder.mutation<ApiResponse<object>, number>({
      query: (id) => ({
        url: `/review/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Review", id },
        "Review",
        "ReviewStats", // ✅ Invalidate tất cả stats
        "Homestay",
      ],
    }),

    // HOST RESPONSE
    addHostResponse: builder.mutation<
      ApiResponse<object>,
      { id: number; data: HostResponse }
    >({
      query: ({ id, data }) => ({
        url: `/review/${id}/host-response`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Review", id },
        "Review", // ✅ Invalidate list để reload
        "PendingResponse", // ✅ Invalidate pending responses
      ],
    }),

    updateHostResponse: builder.mutation<
      ApiResponse<object>,
      { id: number; data: HostResponse }
    >({
      query: ({ id, data }) => ({
        url: `/review/${id}/host-response`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Review", id },
        "Review",
      ],
    }),

    deleteHostResponse: builder.mutation<ApiResponse<object>, number>({
      query: (id) => ({
        url: `/review/${id}/host-response`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Review", id },
        "Review",
        "PendingResponse",
      ],
    }),

    // HELPFUL
    markReviewHelpful: builder.mutation<ApiResponse<object>, number>({
      query: (id) => ({
        url: `/review/${id}/helpful`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Review", id },
        "Review", // ✅ Invalidate để reload danh sách
      ],
    }),

    // TOGGLE VISIBILITY (Admin)
    toggleReviewVisibility: builder.mutation<ApiResponse<object>, number>({
      query: (id) => ({
        url: `/review/${id}/toggle-visibility`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Review", id },
        "Review",
        "ReviewStats", // ✅ Có thể ảnh hưởng đến stats nếu ẩn review
        "Homestay",
      ],
    }),

    // STATISTICS
    getHomestayReviewStats: builder.query<
      ApiResponse<HomestayReviewStatistics>,
      number
    >({
      query: (homestayId) => `/review/homestay/${homestayId}/statistics`,
      providesTags: (result, error, homestayId) => [
        { type: "ReviewStats", id: homestayId },
      ],
    }),

    getUserReviewStats: builder.query<
      ApiResponse<UserReviewStatistics>,
      number
    >({
      query: (userId) => `/review/user/${userId}/statistics`,
      providesTags: (result, error, userId) => [
        { type: "ReviewStats", id: `USER-${userId}` },
      ],
    }),

    // PENDING RESPONSES (Host)
    getPendingHostResponses: builder.query<ApiResponse<Review[]>, void>({
      query: () => `/review/pending-responses`,
      providesTags: ["PendingResponse"],
    }),

    toggleHelpful: builder.mutation<ApiResponse<HelpfulToggleResult>, number>({
      query: (reviewId) => ({
        url: `/review/${reviewId}/helpful`,
        method: "POST",
      }),
      invalidatesTags: (result, error, reviewId) => [
        { type: "Review", id: reviewId },
        "Review",
      ],
    }),

    exportReviewsToExcel: builder.query<Blob, ReviewFilter>({
      query: (filter) => ({
        url: "/review/export/excel",
        method: "GET",
        params: filter,
        responseHandler: (response: { blob: () => any }) => response.blob(),
      }),
    }),
    exportReviewsToPdf: builder.query<Blob, ReviewFilter>({
      query: (filter) => ({
        url: "/review/export/pdf",
        method: "GET",
        params: filter,
        responseHandler: (response: { blob: () => any }) => response.blob(),
      }),
    }),
    exportReviewsToCSV: builder.query<Blob, ReviewFilter>({
      query: (filter) => ({
        url: "/review/export/csv",
        method: "GET",
        params: filter,
        responseHandler: (response: { blob: () => any }) => response.blob(),
      }),
    }),
  }),
});

// Export hooks
export const {
  useCreateReviewMutation,
  useGetReviewByIdQuery,
  useGetAllReviewsQuery,
  useGetHomestayReviewsQuery,
  useGetUserReviewsQuery,
  useGetMyReviewsQuery,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useAddHostResponseMutation,
  useUpdateHostResponseMutation,
  useDeleteHostResponseMutation,
  useMarkReviewHelpfulMutation,
  useToggleReviewVisibilityMutation,
  useGetHomestayReviewStatsQuery,
  useGetUserReviewStatsQuery,
  useGetPendingHostResponsesQuery,
  useGetHostReviewsQuery,
  useToggleHelpfulMutation,
  useLazyExportReviewsToExcelQuery,
  useLazyExportReviewsToPdfQuery,
  useLazyExportReviewsToCSVQuery,
} = reviewApi;
