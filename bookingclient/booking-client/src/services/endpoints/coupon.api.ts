/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/services/api.service";
import type { ApiResponse, PagedResult } from "@/types/baseApi.types";
import type {
  Coupon,
  CouponFilter,
  CreateCoupon,
  UpdateCoupon,
  ValidateCoupon,
  CouponValidationResult,
  CouponUsage,
  CouponStatistics,
} from "@/types/coupon.types";
import type { EndpointBuilder } from "@reduxjs/toolkit/query";

export const couponApi = baseApi.injectEndpoints({
  endpoints: (builder: EndpointBuilder<any, any, any>) => ({
    // CREATE
    createCoupon: builder.mutation<ApiResponse<Coupon>, CreateCoupon>({
      query: (data) => ({
        url: "/coupon",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Coupon"],
    }),

    // READ
    getCouponById: builder.query<ApiResponse<Coupon>, number>({
      query: (id) => `/coupon/${id}`,
      providesTags: (result, error, id) => [{ type: "Coupon", id }],
    }),

    getCouponByCode: builder.query<ApiResponse<Coupon>, string>({
      query: (couponCode) => `/coupon/code/${couponCode}`,
      providesTags: (result, error, couponCode) => [
        { type: "Coupon", id: couponCode },
      ],
    }),

    getAllCoupons: builder.query<
      ApiResponse<PagedResult<Coupon>>,
      CouponFilter
    >({
      query: (filter) => {
        const params = new URLSearchParams();
        Object.entries(filter).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
        return `/coupon/all?${params.toString()}`;
      },
      providesTags: ["Coupon"],
    }),

    getMyCoupons: builder.query<ApiResponse<PagedResult<Coupon>>, CouponFilter>(
      {
        query: (filter) => {
          const params = new URLSearchParams();
          Object.entries(filter).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              params.append(key, String(value));
            }
          });
          return `/coupon/my-coupons?${params.toString()}`;
        },
        providesTags: ["Coupon"],
      }
    ),

    getPublicCoupons: builder.query<
      ApiResponse<PagedResult<Coupon>>,
      CouponFilter
    >({
      query: (filter) => {
        const params = new URLSearchParams();
        Object.entries(filter).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value));
          }
        });
        return `/coupon/public?${params.toString()}`;
      },
      providesTags: [],
    }),

    // UPDATE
    updateCoupon: builder.mutation<
      ApiResponse<Coupon>,
      { id: number; data: UpdateCoupon }
    >({
      query: ({ id, data }) => ({
        url: `/coupon/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Coupon", id },
        "Coupon",
      ],
    }),

    // DELETE
    deleteCoupon: builder.mutation<ApiResponse<object>, number>({
      query: (id) => ({
        url: `/coupon/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Coupon", id },
        "Coupon",
      ],
    }),

    // VALIDATION & CALCULATION
    validateCoupon: builder.mutation<
      ApiResponse<CouponValidationResult>,
      ValidateCoupon
    >({
      query: (data) => ({
        url: "/coupon/validate",
        method: "POST",
        body: data,
      }),
    }),

    calculateDiscount: builder.query<
      ApiResponse<number>,
      { couponCode: string; bookingAmount: number; nights: number }
    >({
      query: ({ couponCode, bookingAmount, nights }) => ({
        url: "/coupon/calculate-discount",
        params: { couponCode, bookingAmount, nights },
      }),
    }),

    getAvailableCoupons: builder.query<
      ApiResponse<Coupon[]>,
      { homestayId: number; bookingAmount: number; nights: number }
    >({
      query: ({ homestayId, bookingAmount, nights }) => ({
        url: "/coupon/available",
        params: { homestayId, bookingAmount, nights },
      }),
      providesTags: [],
    }),

    // USAGE
    applyCouponToBooking: builder.mutation<
      ApiResponse<CouponUsage>,
      { bookingId: number; couponCode: string }
    >({
      query: ({ bookingId, couponCode }) => ({
        url: "/coupon/apply",
        method: "POST",
        params: { bookingId, couponCode },
      }),
      invalidatesTags: ["Coupon", "Booking"],
    }),

    // === SỬA removeCouponFromBooking (thêm body) ===
    removeCouponFromBooking: builder.mutation<
      ApiResponse<object>,
      { bookingId: number; couponCode: string }
    >({
      query: ({ bookingId, couponCode }) => {
        // Tự build URL + query string
        const url = `/coupon/remove?bookingId=${encodeURIComponent(bookingId)}`;

        return {
          url,
          method: "DELETE",
          body: { CouponCode: couponCode }, // body JSON
        };
      },
      invalidatesTags: ["Coupon", "Booking"],
    }),

    getCouponUsageByBooking: builder.query<ApiResponse<CouponUsage>, number>({
      query: (bookingId) => `/coupon/booking/${bookingId}/usage`,
      providesTags: (result, error, bookingId) => [
        { type: "CouponUsage", id: bookingId },
      ],
    }),

    getMyCouponUsageHistory: builder.query<ApiResponse<CouponUsage[]>, void>({
      query: () => "/coupon/usage/my-history",
      providesTags: ["CouponUsage"],
    }),

    getCouponUsageHistory: builder.query<ApiResponse<CouponUsage[]>, number>({
      query: (couponId) => `/coupon/${couponId}/usage-history`,
      providesTags: (result, error, couponId) => [
        { type: "CouponUsage", id: couponId },
      ],
    }),

    // STATUS
    activateCoupon: builder.mutation<ApiResponse<object>, number>({
      query: (id) => ({
        url: `/coupon/${id}/activate`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Coupon", id },
        "Coupon",
      ],
    }),

    deactivateCoupon: builder.mutation<ApiResponse<object>, number>({
      query: (id) => ({
        url: `/coupon/${id}/deactivate`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Coupon", id },
        "Coupon",
      ],
    }),

    toggleCouponStatus: builder.mutation<ApiResponse<object>, number>({
      query: (id) => ({
        url: `/coupon/${id}/toggle-status`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Coupon", id },
        "Coupon",
      ],
    }),

    extendCouponExpiry: builder.mutation<
      ApiResponse<object>,
      { id: number; newEndDate: string }
    >({
      query: ({ id, newEndDate }) => ({
        url: `/coupon/${id}/extend`,
        method: "PUT",
        body: newEndDate,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Coupon", id },
        "Coupon",
      ],
    }),

    // STATISTICS
    getCouponStatistics: builder.query<ApiResponse<CouponStatistics>, void>({
      query: () => "/coupon/statistics",
      providesTags: ["CouponStatistics"],
    }),

    processExpiredCoupons: builder.mutation<ApiResponse<object>, void>({
      query: () => ({
        url: "/coupon/process-expired",
        method: "POST",
      }),
      invalidatesTags: ["Coupon"],
    }),

    // === THÊM VÀO endpoints ===
    getActiveApplicableCouponsForHomestay: builder.query<
      ApiResponse<Coupon[]>,
      { homestayId: number; bookingAmount?: number; numberOfNights?: number }
    >({
      query: ({ homestayId, bookingAmount, numberOfNights }) => ({
        url: `/coupon/homestay/${homestayId}/active`,
        params: { bookingAmount, numberOfNights },
      }),
      providesTags: (result, error, arg) => [
        { type: "Coupon", id: `homestay-active-${arg.homestayId}` },
      ],
    }),

    getApplicableCouponsForHomestay: builder.query<
      ApiResponse<Coupon[]>,
      { homestayId: number; includeInactive?: boolean }
    >({
      query: ({ homestayId, includeInactive }) => ({
        url: `/coupon/homestay/${homestayId}/all`,
        params: { includeInactive },
      }),
      providesTags: (result, error, arg) => [
        { type: "Coupon", id: `homestay-all-${arg.homestayId}` },
      ],
    }),

    // === SỬA getCouponUsagesByBooking (sửa tên + trả về mảng) ===
    getCouponUsagesByBooking: builder.query<ApiResponse<CouponUsage[]>, number>(
      {
        query: (bookingId) => `/coupon/booking/${bookingId}/usages`, // Sửa: "usages"
        providesTags: (result, error, bookingId) => [
          { type: "CouponUsage", id: bookingId },
        ],
      }
    ),
  }),
});

// Export hooks
export const {
  // CRUD
  useCreateCouponMutation,
  useGetCouponByIdQuery,
  useGetCouponByCodeQuery,
  useGetAllCouponsQuery,
  useGetMyCouponsQuery,
  useGetPublicCouponsQuery,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useGetCouponUsagesByBookingQuery,

  // Validation & Calculation
  useValidateCouponMutation,
  useCalculateDiscountQuery,
  useGetAvailableCouponsQuery,

  // Usage
  useApplyCouponToBookingMutation,
  useRemoveCouponFromBookingMutation,
  useGetCouponUsageByBookingQuery,
  useGetMyCouponUsageHistoryQuery,
  useGetCouponUsageHistoryQuery,

  // Status
  useActivateCouponMutation,
  useDeactivateCouponMutation,
  useToggleCouponStatusMutation,
  useExtendCouponExpiryMutation,

  // Statistics
  useGetCouponStatisticsQuery,
  useProcessExpiredCouponsMutation,

  useGetActiveApplicableCouponsForHomestayQuery,
  useGetApplicableCouponsForHomestayQuery,
} = couponApi;
