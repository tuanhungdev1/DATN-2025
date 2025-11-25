// services/endpoints/dashboard.api.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/services/api.service";
import type { ApiResponse } from "@/types/baseApi.types";
import type {
  DashboardOverview,
  UserStatistics,
  BookingStatistics,
  RevenueStatistics,
  ReviewStatistics,
  CompleteDashboard,
  ExportParams,
} from "@/types/dashboard.types";
import type { EndpointBuilder } from "@reduxjs/toolkit/query";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder: EndpointBuilder<any, any, any>) => ({
    // Get dashboard overview
    getDashboardOverview: builder.query<
      ApiResponse<DashboardOverview>,
      { months?: number }
    >({
      query: ({ months = 12 }) => ({
        url: `/admin/dashboard/overview`,
        params: { months },
      }),
      providesTags: ["Dashboard"],
    }),

    // Get user statistics
    getUserStatistics: builder.query<
      ApiResponse<UserStatistics>,
      { startDate?: string; endDate?: string }
    >({
      query: ({ startDate, endDate }) => ({
        url: `/admin/dashboard/users`,
        params: { startDate, endDate },
      }),
      providesTags: ["Dashboard"],
    }),

    // Get booking statistics
    getBookingStatistics: builder.query<
      ApiResponse<BookingStatistics>,
      { months?: number }
    >({
      query: ({ months = 12 }) => ({
        url: `/admin/dashboard/bookings`,
        params: { months },
      }),
      providesTags: ["Dashboard"],
    }),

    // Get revenue statistics
    getRevenueStatistics: builder.query<
      ApiResponse<RevenueStatistics>,
      { months?: number }
    >({
      query: ({ months = 12 }) => ({
        url: `/admin/dashboard/revenue`,
        params: { months },
      }),
      providesTags: ["Dashboard"],
    }),

    // Get review statistics
    getReviewStatistics: builder.query<
      ApiResponse<ReviewStatistics>,
      { months?: number }
    >({
      query: ({ months = 6 }) => ({
        url: `/admin/dashboard/reviews`,
        params: { months },
      }),
      providesTags: ["Dashboard"],
    }),

    // Get complete dashboard
    getCompleteDashboard: builder.query<
      ApiResponse<CompleteDashboard>,
      { months?: number }
    >({
      query: ({ months = 12 }) => ({
        url: `/admin/dashboard/complete`,
        params: { months },
      }),
      providesTags: ["Dashboard"],
    }),

    // Export dashboard (optional)
    exportDashboard: builder.mutation<
      Blob,
      { format: "excel" | "csv"; months?: number }
    >({
      query: ({ format, months = 12 }) => ({
        url: `/admin/dashboard/export`,
        params: { format, months },
        responseHandler: (response: { blob: () => any }) => response.blob(),
      }),
    }),

    exportAdminDashboard: builder.query<Blob, ExportParams>({
      query: ({ format = "excel", months = 12 }) => ({
        url: `/admin/dashboard/export`,
        method: "GET",
        params: { format, months },
        responseHandler: async (response: { blob: () => any }) =>
          await response.blob(),
      }),
      transformResponse: (response: Blob) => response,
    }),
  }),
});

export const {
  useGetDashboardOverviewQuery,
  useGetUserStatisticsQuery,
  useGetBookingStatisticsQuery,
  useGetRevenueStatisticsQuery,
  useGetReviewStatisticsQuery,
  useGetCompleteDashboardQuery,
  useExportDashboardMutation,
  useLazyExportAdminDashboardQuery,
} = dashboardApi;
