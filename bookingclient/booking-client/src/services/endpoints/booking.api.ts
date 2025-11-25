/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/services/api.service";
import type { ApiResponse, PagedResult } from "@/types/baseApi.types";
import type {
  Booking,
  BookingFilter,
  BookingPriceBreakdown,
  BookingPriceCalculation,
  BookingStatistics,
  CancelBooking,
  CreateBooking,
  UpdateBooking,
} from "@/types/booking.types";

import type { EndpointBuilder } from "@reduxjs/toolkit/query";

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder: EndpointBuilder<any, any, any>) => ({
    // Calculate price (AllowAnonymous)
    calculatePrice: builder.mutation<
      ApiResponse<BookingPriceBreakdown>,
      BookingPriceCalculation
    >({
      query: (data) => ({
        url: `/booking/calculate-price`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [],
    }),

    // Check availability (AllowAnonymous)
    checkAvailability: builder.query<
      ApiResponse<boolean>,
      {
        homestayId: number;
        checkInDate: string;
        checkOutDate: string;
        excludeBookingId?: number;
      }
    >({
      query: (args) => ({
        url: "/booking/check-availability",
        params: {
          homestayId: args.homestayId,
          checkInDate: args.checkInDate,
          checkOutDate: args.checkOutDate,
          excludeBookingId: args.excludeBookingId,
        },
      }),
      providesTags: [],
    }),

    // Create booking (Guest, Admin)
    createBooking: builder.mutation<ApiResponse<Booking>, CreateBooking>({
      query: (data) => ({
        url: `/booking`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Booking"],
    }),

    // Get booking by ID
    getBookingById: builder.query<ApiResponse<Booking>, number>({
      query: (id) => `/booking/${id}`,
      providesTags: (result, error, id) => [{ type: "Booking", id }],
    }),

    // Get booking by code
    getBookingByCode: builder.query<ApiResponse<Booking>, string>({
      query: (bookingCode) => `/booking/code/${bookingCode}`,
      providesTags: ["Booking"],
    }),

    // Get my bookings (Guest)
    getMyBookings: builder.query<
      ApiResponse<PagedResult<Booking>>,
      BookingFilter
    >({
      query: (filter) => {
        const params = new URLSearchParams();
        if (filter.bookingCode)
          params.append("bookingCode", filter.bookingCode);
        if (filter.homestayId)
          params.append("homestayId", String(filter.homestayId));
        if (filter.guestId) params.append("guestId", String(filter.guestId));
        if (filter.hostId) params.append("hostId", String(filter.hostId));
        if (filter.status !== undefined)
          params.append("status", String(filter.status));
        if (filter.checkInDateFrom)
          params.append("checkInDateFrom", filter.checkInDateFrom);
        if (filter.checkInDateTo)
          params.append("checkInDateTo", filter.checkInDateTo);
        if (filter.checkOutDateFrom)
          params.append("checkOutDateFrom", filter.checkOutDateFrom);
        if (filter.checkOutDateTo)
          params.append("checkOutDateTo", filter.checkOutDateTo);
        if (filter.minAmount)
          params.append("minAmount", String(filter.minAmount));
        if (filter.maxAmount)
          params.append("maxAmount", String(filter.maxAmount));
        if (filter.sortBy) params.append("sortBy", filter.sortBy);
        if (filter.sortDirection)
          params.append("sortDirection", filter.sortDirection);
        params.append("pageNumber", String(filter.pageNumber || 1));
        params.append("pageSize", String(filter.pageSize || 10));
        return `/booking/my-bookings?${params.toString()}`;
      },
      providesTags: ["Booking"],
    }),

    // Get host bookings (Host)
    getHostBookings: builder.query<
      ApiResponse<PagedResult<Booking>>,
      BookingFilter
    >({
      query: (filter) => {
        const params = new URLSearchParams();
        if (filter.bookingCode)
          params.append("bookingCode", filter.bookingCode);
        if (filter.homestayId)
          params.append("homestayId", String(filter.homestayId));
        if (filter.guestId) params.append("guestId", String(filter.guestId));
        if (filter.hostId) params.append("hostId", String(filter.hostId));
        if (filter.status !== undefined)
          params.append("status", String(filter.status));
        if (filter.checkInDateFrom)
          params.append("checkInDateFrom", filter.checkInDateFrom);
        if (filter.checkInDateTo)
          params.append("checkInDateTo", filter.checkInDateTo);
        if (filter.checkOutDateFrom)
          params.append("checkOutDateFrom", filter.checkOutDateFrom);
        if (filter.checkOutDateTo)
          params.append("checkOutDateTo", filter.checkOutDateTo);
        if (filter.minAmount)
          params.append("minAmount", String(filter.minAmount));
        if (filter.maxAmount)
          params.append("maxAmount", String(filter.maxAmount));
        if (filter.sortBy) params.append("sortBy", filter.sortBy);
        if (filter.sortDirection)
          params.append("sortDirection", filter.sortDirection);
        params.append("pageNumber", String(filter.pageNumber || 1));
        params.append("pageSize", String(filter.pageSize || 10));
        return `/booking/host-bookings?${params.toString()}`;
      },
      providesTags: ["Booking"],
    }),

    // Get all bookings (Admin)
    getAllBookings: builder.query<
      ApiResponse<PagedResult<Booking>>,
      BookingFilter
    >({
      query: (filter) => {
        const params = new URLSearchParams();
        if (filter.bookingCode)
          params.append("bookingCode", filter.bookingCode);
        if (filter.homestayId)
          params.append("homestayId", String(filter.homestayId));
        if (filter.guestId) params.append("guestId", String(filter.guestId));
        if (filter.hostId) params.append("hostId", String(filter.hostId));
        if (filter.status !== undefined)
          params.append("status", String(filter.status));
        if (filter.checkInDateFrom)
          params.append("checkInDateFrom", filter.checkInDateFrom);
        if (filter.checkInDateTo)
          params.append("checkInDateTo", filter.checkInDateTo);
        if (filter.checkOutDateFrom)
          params.append("checkOutDateFrom", filter.checkOutDateFrom);
        if (filter.checkOutDateTo)
          params.append("checkOutDateTo", filter.checkOutDateTo);
        if (filter.minAmount)
          params.append("minAmount", String(filter.minAmount));
        if (filter.maxAmount)
          params.append("maxAmount", String(filter.maxAmount));
        if (filter.sortBy) params.append("sortBy", filter.sortBy);
        if (filter.sortDirection)
          params.append("sortDirection", filter.sortDirection);
        params.append("pageNumber", String(filter.pageNumber || 1));
        params.append("pageSize", String(filter.pageSize || 10));
        return `/booking/all?${params.toString()}`;
      },
      providesTags: ["Booking"],
    }),

    // Update booking
    updateBooking: builder.mutation<
      ApiResponse<Booking>,
      { id: number; data: UpdateBooking }
    >({
      query: ({ id, data }) => ({
        url: `/booking/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Booking"],
    }),

    // Confirm booking (Host, Admin)
    confirmBooking: builder.mutation<ApiResponse<object>, number>({
      query: (id) => ({
        url: `/booking/${id}/confirm`,
        method: "PUT",
      }),
      invalidatesTags: ["Booking"],
    }),

    // Reject booking (Host, Admin)
    rejectBooking: builder.mutation<
      ApiResponse<object>,
      { id: number; reason: string }
    >({
      query: ({ id, reason }) => ({
        url: `/booking/${id}/reject`,
        method: "PUT",
        body: { reason },
      }),
      invalidatesTags: ["Booking"],
    }),

    // Cancel booking (Guest, Admin)
    cancelBooking: builder.mutation<
      ApiResponse<object>,
      { id: number; data: CancelBooking }
    >({
      query: ({ id, data }) => ({
        url: `/booking/${id}/cancel`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Booking"],
    }),

    // Check-in (Host, Admin)
    checkIn: builder.mutation<ApiResponse<object>, number>({
      query: (id) => ({
        url: `/booking/${id}/check-in`,
        method: "PUT",
      }),
      invalidatesTags: ["Booking"],
    }),

    // Check-out (Host, Admin)
    checkOut: builder.mutation<ApiResponse<object>, number>({
      query: (id) => ({
        url: `/booking/${id}/check-out`,
        method: "PUT",
      }),
      invalidatesTags: ["Booking"],
    }),

    // Mark as completed (Admin)
    markAsCompleted: builder.mutation<ApiResponse<object>, number>({
      query: (id) => ({
        url: `/booking/${id}/complete`,
        method: "PUT",
      }),
      invalidatesTags: ["Booking"],
    }),

    // Mark as no-show (Host, Admin)
    markAsNoShow: builder.mutation<ApiResponse<object>, number>({
      query: (id) => ({
        url: `/booking/${id}/no-show`,
        method: "PUT",
      }),
      invalidatesTags: ["Booking"],
    }),

    // Get statistics (Host, Admin)
    getBookingStatistics: builder.query<
      ApiResponse<BookingStatistics>,
      { homestayId?: number; startDate?: string; endDate?: string }
    >({
      query: ({ homestayId, startDate, endDate }) => {
        const params = new URLSearchParams();
        if (homestayId) params.append("homestayId", String(homestayId));
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        return `/booking/statistics?${params.toString()}`;
      },
      providesTags: ["Booking"],
    }),

    // Process expired bookings (Admin)
    processExpiredBookings: builder.mutation<ApiResponse<object>, void>({
      query: () => ({
        url: `/booking/process-expired`,
        method: "POST",
      }),
      invalidatesTags: ["Booking"],
    }),

    // ✅ Export Bookings
    exportBookingsToExcel: builder.query<Blob, BookingFilter>({
      query: (filter) => ({
        url: "/booking/export/excel",
        method: "GET",
        params: filter,
        responseHandler: async (response: { blob: () => any }) =>
          await response.blob(),
      }),
      transformResponse: (response: Blob) => response,
    }),

    exportBookingsToPdf: builder.query<Blob, BookingFilter>({
      query: (filter) => ({
        url: "/booking/export/pdf",
        method: "GET",
        params: filter,
        responseHandler: async (response: { blob: () => any }) =>
          await response.blob(),
      }),
      transformResponse: (response: Blob) => response,
    }),

    exportBookingsToCSV: builder.query<Blob, BookingFilter>({
      query: (filter) => ({
        url: "/booking/export/csv",
        method: "GET",
        params: filter,
        responseHandler: async (response: { blob: () => any }) =>
          await response.blob(),
      }),
      transformResponse: (response: Blob) => response,
    }),
  }),
});

export const {
  // Price & Availability
  useCalculatePriceMutation,
  useCheckAvailabilityQuery,

  // CRUD
  useCreateBookingMutation,
  useGetBookingByIdQuery,
  useGetBookingByCodeQuery,
  useGetMyBookingsQuery,
  useGetHostBookingsQuery,
  useGetAllBookingsQuery,
  useUpdateBookingMutation,

  // Actions
  useConfirmBookingMutation,
  useRejectBookingMutation,
  useCancelBookingMutation,
  useCheckInMutation,
  useCheckOutMutation,
  useMarkAsCompletedMutation,
  useMarkAsNoShowMutation,

  // Statistics
  useGetBookingStatisticsQuery,
  useProcessExpiredBookingsMutation,
  useLazyCheckAvailabilityQuery,
  useLazyExportBookingsToExcelQuery,
  useLazyExportBookingsToPdfQuery,
  useLazyExportBookingsToCSVQuery,
} = bookingApi;
