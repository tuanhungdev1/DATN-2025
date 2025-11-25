// src/services/endpoints/payment.api.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/services/api.service";
import type { ApiResponse, PagedResult } from "@/types/baseApi.types";
import type {
  Payment,
  CreateOnlinePayment,
  PaymentUrlResponse,
  ProcessPayment,
  RefundPayment,
  MarkPaymentFailed,
  PaymentFilter,
  RefundStatus,
} from "@/types/payment.types";
import type { EndpointBuilder } from "@reduxjs/toolkit/query";

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder: EndpointBuilder<any, any, any>) => ({
    getMyPayments: builder.query<
      ApiResponse<PagedResult<Payment>>,
      PaymentFilter
    >({
      query: (params) => ({
        url: `/payments/my-payments`,
        params,
      }),
      providesTags: ["Payment"],
    }),

    getHostPayments: builder.query<
      ApiResponse<PagedResult<Payment>>,
      PaymentFilter
    >({
      query: (params) => ({
        url: `/payments/host`,
        params,
      }),
      providesTags: ["Payment"],
    }),

    getAllPayments: builder.query<
      ApiResponse<PagedResult<Payment>>,
      PaymentFilter
    >({
      query: (params) => ({
        url: `/payments`,
        params,
      }),
      providesTags: ["Payment"],
    }),
    // Create online payment (VNPay, ZaloPay, Momo)
    createOnlinePayment: builder.mutation<
      ApiResponse<PaymentUrlResponse>,
      CreateOnlinePayment
    >({
      query: (data) => ({
        url: `/payments/online`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Payment"],
    }),

    // Get payment by ID
    getPaymentById: builder.query<ApiResponse<Payment>, number>({
      query: (id) => `/payments/${id}`,
      providesTags: (result, error, id) => [{ type: "Payment", id }],
    }),

    // Get payments by booking ID
    getPaymentsByBookingId: builder.query<ApiResponse<Payment[]>, number>({
      query: (bookingId) => `/payments/booking/${bookingId}`,
      providesTags: ["Payment"],
    }),

    // Process/confirm manual payment (Host/Admin only)
    processPayment: builder.mutation<ApiResponse<Payment>, ProcessPayment>({
      query: (data) => ({
        url: `/payments/process`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Payment", "Booking"],
    }),

    // Refund payment (Host/Admin only)
    refundPayment: builder.mutation<
      ApiResponse<Payment>,
      { id: number; data: RefundPayment }
    >({
      query: ({ id, data }) => ({
        url: `/payments/${id}/refund`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Payment", "Booking"],
    }),

    // Mark payment as failed (Admin only)
    markPaymentAsFailed: builder.mutation<
      ApiResponse<object>,
      { id: number; data: MarkPaymentFailed }
    >({
      query: ({ id, data }) => ({
        url: `/payments/${id}/mark-failed`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Payment", "Booking"],
    }),

    verifyPaymentCallback: builder.query<
      ApiResponse<Payment>,
      { paymentMethod: string; queryParams: Record<string, string> }
    >({
      query: ({ paymentMethod, queryParams }) => ({
        url: `/payments/${paymentMethod}-return-json`,
        method: "GET",
        params: queryParams,
      }),
    }),

    getRefundStatus: builder.query<ApiResponse<RefundStatus>, number>({
      query: (id) => `/payments/${id}/refund-status`,
      providesTags: (result, error, id) => [{ type: "Payment", id }],
    }),

    // ✅ Export Payments
    exportPaymentsToExcel: builder.query<Blob, PaymentFilter>({
      query: (filter) => ({
        url: "/payments/export/excel",
        method: "GET",
        params: filter,
        responseHandler: async (response: { blob: () => any }) =>
          await response.blob(),
      }),
      transformResponse: (response: Blob) => response,
    }),

    exportPaymentsToPdf: builder.query<Blob, PaymentFilter>({
      query: (filter) => ({
        url: "/payments/export/pdf",
        method: "GET",
        params: filter,
        responseHandler: async (response: { blob: () => any }) =>
          await response.blob(),
      }),
      transformResponse: (response: Blob) => response,
    }),

    exportPaymentsToCSV: builder.query<Blob, PaymentFilter>({
      query: (filter) => ({
        url: "/payments/export/csv",
        method: "GET",
        params: filter,
        responseHandler: async (response: { blob: () => any }) =>
          await response.blob(),
      }),
      transformResponse: (response: Blob) => response,
    }),

    momoCallback: builder.mutation<void, Record<string, string>>({
      query: (data) => ({
        url: `/payments/momo-callback`,
        method: "POST",
        body: data,
      }),
    }),

    momoReturn: builder.query<ApiResponse<Payment>, Record<string, string>>({
      query: (queryParams) => ({
        url: `/payments/momo-return`,
        method: "GET",
        params: queryParams,
      }),
      providesTags: ["Payment"],
    }),

    momoReturnJson: builder.query<ApiResponse<Payment>, Record<string, string>>(
      {
        query: (queryParams) => ({
          url: `/payments/momo-return-json`,
          method: "GET",
          params: queryParams,
        }),
        providesTags: ["Payment"],
      }
    ),
  }),
});

export const {
  useCreateOnlinePaymentMutation,
  useGetPaymentByIdQuery,
  useGetPaymentsByBookingIdQuery,
  useProcessPaymentMutation,
  useRefundPaymentMutation,
  useMarkPaymentAsFailedMutation,
  useVerifyPaymentCallbackQuery,
  useGetMyPaymentsQuery,
  useGetAllPaymentsQuery,
  useGetHostPaymentsQuery,
  useGetRefundStatusQuery,
  useLazyExportPaymentsToExcelQuery,
  useLazyExportPaymentsToPdfQuery,
  useLazyExportPaymentsToCSVQuery,
  useMomoCallbackMutation,
  useMomoReturnQuery,
  useMomoReturnJsonQuery,
} = paymentApi;
