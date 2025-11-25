/* eslint-disable @typescript-eslint/no-explicit-any */
// services/endpoints/host-dashboard.api.ts
import { baseApi } from "@/services/api.service";
import type { ApiResponse } from "@/types/baseApi.types";
import type { ExportParams } from "@/types/dashboard.types";
import type {
  HostDashboardOverview,
  HostRevenueStatistics,
  HostBookingStatistics,
  HostReviewStatistics,
  HostPerformance,
  CompleteHostDashboard,
} from "@/types/host-dashboard.types";
import type { EndpointBuilder } from "@reduxjs/toolkit/query";

export const hostDashboardApi = baseApi.injectEndpoints({
  endpoints: (builder: EndpointBuilder<any, any, any>) => ({
    // Get host dashboard overview
    getHostDashboardOverview: builder.query<
      ApiResponse<HostDashboardOverview>,
      void
    >({
      query: () => ({
        url: `/host/dashboard/overview`,
      }),
      providesTags: ["HostDashboard"],
    }),

    // Get host revenue statistics
    getHostRevenueStatistics: builder.query<
      ApiResponse<HostRevenueStatistics>,
      { months?: number }
    >({
      query: ({ months = 12 }) => ({
        url: `/host/dashboard/revenue`,
        params: { months },
      }),
      providesTags: ["HostDashboard"],
    }),

    // Get host booking statistics
    getHostBookingStatistics: builder.query<
      ApiResponse<HostBookingStatistics>,
      { months?: number }
    >({
      query: ({ months = 12 }) => ({
        url: `/host/dashboard/bookings`,
        params: { months },
      }),
      providesTags: ["HostDashboard"],
    }),

    // Get host review statistics
    getHostReviewStatistics: builder.query<
      ApiResponse<HostReviewStatistics>,
      void
    >({
      query: () => ({
        url: `/host/dashboard/reviews`,
      }),
      providesTags: ["HostDashboard"],
    }),

    // Get host performance
    getHostPerformance: builder.query<
      ApiResponse<HostPerformance>,
      { months?: number }
    >({
      query: ({ months = 12 }) => ({
        url: `/host/dashboard/performance`,
        params: { months },
      }),
      providesTags: ["HostDashboard"],
    }),

    // Get complete host dashboard
    getCompleteHostDashboard: builder.query<
      ApiResponse<CompleteHostDashboard>,
      { months?: number }
    >({
      query: ({ months = 12 }) => ({
        url: `/host/dashboard/complete`,
        params: { months },
      }),
      providesTags: ["HostDashboard"],
    }),

    exportHostDashboard: builder.query<Blob, ExportParams>({
      query: ({ format = "excel", months = 12 }) => ({
        url: `/host/dashboard/export`,
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
  useGetHostDashboardOverviewQuery,
  useGetHostRevenueStatisticsQuery,
  useGetHostBookingStatisticsQuery,
  useGetHostReviewStatisticsQuery,
  useGetHostPerformanceQuery,
  useGetCompleteHostDashboardQuery,
  useLazyExportHostDashboardQuery,
} = hostDashboardApi;
