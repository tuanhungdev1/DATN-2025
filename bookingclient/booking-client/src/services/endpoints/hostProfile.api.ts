/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/services/api.service";
import type { ApiResponse, PagedResult } from "@/types/baseApi.types";
import type {
  HostProfile,
  HostProfileFilter,
  CreateHostProfile,
  UpdateHostProfile,
  UploadIdentityCard,
  UploadBusinessLicense,
  UploadTaxCodeDocument,
  ApproveHostProfileRequest,
  RejectHostProfileRequest,
  ReviewHostProfileRequest,
  SuperhostRequest,
  ActiveStatusRequest,
  UpdateStatisticsRequest,
} from "@/types/hostProfile.types";

const API_URL = import.meta.env.VITE_API_URL || "https://localhost:7073/api";

export const hostProfileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // === REGISTER (Upload File + FormData) ===
    registerHost: builder.mutation<ApiResponse<object>, CreateHostProfile>({
      queryFn: async (data) => {
        try {
          const formData = new FormData();

          if (data.userId != null)
            formData.append("userId", String(data.userId));
          if (data.businessName?.trim())
            formData.append("businessName", data.businessName);
          if (data.aboutMe?.trim()) formData.append("aboutMe", data.aboutMe);
          if (data.languages?.length)
            formData.append("languages", data.languages);
          if (data.bankName?.trim()) formData.append("bankName", data.bankName);
          if (data.bankAccountNumber?.trim())
            formData.append("bankAccountNumber", data.bankAccountNumber);
          if (data.bankAccountName?.trim())
            formData.append("bankAccountName", data.bankAccountName);

          // THÊM AVATAR
          if (data.avatarFile instanceof File)
            formData.append("avatarFile", data.avatarFile);

          if (data.identityCardFrontFile instanceof File)
            formData.append(
              "identityCardFrontFile",
              data.identityCardFrontFile
            );

          if (data.identityCardBackFile instanceof File)
            formData.append("identityCardBackFile", data.identityCardBackFile);

          if (data.businessLicenseFile)
            formData.append("businessLicenseFile", data.businessLicenseFile);
          if (data.taxCodeDocumentFile)
            formData.append("taxCodeDocumentFile", data.taxCodeDocumentFile);
          if (data.applicantNote)
            formData.append("applicantNote", data.applicantNote);

          const response = await fetch(`${API_URL}/hostProfile/register`, {
            method: "POST",
            body: formData,
            credentials: "include",
          });

          if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            return { error: { status: response.status, data: error } };
          }

          const result = await response.json();
          return { data: result };
        } catch (error: any) {
          return {
            error: {
              status: 500,
              data: { message: error?.message || "Đăng ký chủ nhà thất bại" },
            },
          };
        }
      },
      invalidatesTags: ["HostProfile"],
    }),

    // === UPLOAD IDENTITY CARD ===
    uploadIdentityCard: builder.mutation<
      ApiResponse<object>,
      { hostId: number; data: UploadIdentityCard }
    >({
      queryFn: async ({ hostId, data }) => {
        try {
          const formData = new FormData();
          formData.append("frontImage", data.frontImage);
          formData.append("backImage", data.backImage);

          const response = await fetch(
            `${API_URL}/hostProfile/${hostId}/identity-card`,
            {
              method: "POST",
              body: formData,
              credentials: "include",
            }
          );

          if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            return { error: { status: response.status, data: error } };
          }

          const result = await response.json();
          return { data: result };
        } catch (error: any) {
          return {
            error: {
              status: 500,
              data: { message: error?.message || "Tải CMND thất bại" },
            },
          };
        }
      },
      invalidatesTags: (result, error, { hostId }) => [
        { type: "HostProfile", id: hostId },
        "HostProfile",
      ],
    }),

    // === UPLOAD BUSINESS LICENSE ===
    uploadBusinessLicense: builder.mutation<
      ApiResponse<object>,
      { hostId: number; data: UploadBusinessLicense }
    >({
      queryFn: async ({ hostId, data }) => {
        try {
          const formData = new FormData();
          formData.append("file", data.file);

          const response = await fetch(
            `${API_URL}/hostProfile/${hostId}/business-license`,
            {
              method: "POST",
              body: formData,
              credentials: "include",
            }
          );

          if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            return { error: { status: response.status, data: error } };
          }

          const result = await response.json();
          return { data: result };
        } catch (error: any) {
          return {
            error: {
              status: 500,
              data: {
                message: error?.message || "Tải giấy phép kinh doanh thất bại",
              },
            },
          };
        }
      },
      invalidatesTags: (result, error, { hostId }) => [
        { type: "HostProfile", id: hostId },
        "HostProfile",
      ],
    }),

    // === UPLOAD TAX CODE DOCUMENT ===
    uploadTaxCodeDocument: builder.mutation<
      ApiResponse<object>,
      { hostId: number; data: UploadTaxCodeDocument }
    >({
      queryFn: async ({ hostId, data }) => {
        try {
          const formData = new FormData();
          formData.append("file", data.file);

          const response = await fetch(
            `${API_URL}/hostProfile/${hostId}/tax-code-document`,
            {
              method: "POST",
              body: formData,
              credentials: "include",
            }
          );

          if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            return { error: { status: response.status, data: error } };
          }

          const result = await response.json();
          return { data: result };
        } catch (error: any) {
          return {
            error: {
              status: 500,
              data: { message: error?.message || "Tải mã số thuế thất bại" },
            },
          };
        }
      },
      invalidatesTags: (result, error, { hostId }) => [
        { type: "HostProfile", id: hostId },
        "HostProfile",
      ],
    }),

    // === CÁC ENDPOINT KHÔNG UPLOAD FILE (giữ nguyên query) ===
    getHostProfileById: builder.query<ApiResponse<HostProfile>, number>({
      query: (userId) => `/hostProfile/${userId}`,
      providesTags: (result, error, userId) => [
        { type: "HostProfile", id: userId },
      ],
    }),

    getAllHostProfiles: builder.query<
      ApiResponse<PagedResult<HostProfile>>,
      HostProfileFilter
    >({
      query: (filter) => {
        const params = new URLSearchParams();
        if (filter.searchTerm) params.append("searchTerm", filter.searchTerm);
        if (filter.isActive !== undefined)
          params.append("isActive", String(filter.isActive));
        if (filter.hostStatus !== undefined)
          params.append("hostStatus", String(filter.hostStatus));
        if (filter.isSuperhost !== undefined)
          params.append("isSuperhost", String(filter.isSuperhost));
        if (filter.registeredFrom)
          params.append("registeredFrom", filter.registeredFrom);
        if (filter.registeredTo)
          params.append("registeredTo", filter.registeredTo);
        if (filter.reviewedFrom)
          params.append("reviewedFrom", filter.reviewedFrom);
        if (filter.reviewedTo) params.append("reviewedTo", filter.reviewedTo);
        if (filter.minAverageRating !== undefined)
          params.append("minAverageRating", String(filter.minAverageRating));
        if (filter.maxAverageRating !== undefined)
          params.append("maxAverageRating", String(filter.maxAverageRating));
        if (filter.minTotalBookings !== undefined)
          params.append("minTotalBookings", String(filter.minTotalBookings));
        if (filter.maxTotalBookings !== undefined)
          params.append("maxTotalBookings", String(filter.maxTotalBookings));
        if (filter.minTotalHomestays !== undefined)
          params.append("minTotalHomestays", String(filter.minTotalHomestays));
        if (filter.maxTotalHomestays !== undefined)
          params.append("maxTotalHomestays", String(filter.maxTotalHomestays));
        if (filter.minResponseRate !== undefined)
          params.append("minResponseRate", String(filter.minResponseRate));
        if (filter.maxResponseRate !== undefined)
          params.append("maxResponseRate", String(filter.maxResponseRate));
        if (filter.sortBy) params.append("sortBy", filter.sortBy);
        if (filter.sortDirection)
          params.append("sortDirection", filter.sortDirection);
        params.append("pageNumber", String(filter.pageNumber || 1));
        params.append("pageSize", String(filter.pageSize || 10));

        return `/hostProfile?${params.toString()}`;
      },
      providesTags: ["HostProfile"],
    }),

    updateHostProfile: builder.mutation<
      ApiResponse<object>,
      { id: number; data: UpdateHostProfile }
    >({
      query: ({ id, data }) => ({
        url: `/hostProfile/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "HostProfile", id },
        "HostProfile",
      ],
    }),

    approveHostProfile: builder.mutation<
      ApiResponse<object>,
      { id: number; data: ApproveHostProfileRequest }
    >({
      query: ({ id, data }) => ({
        url: `/hostProfile/${id}/approve`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "HostProfile", id },
        "HostProfile",
      ],
    }),

    rejectHostProfile: builder.mutation<
      ApiResponse<object>,
      { id: number; data: RejectHostProfileRequest }
    >({
      query: ({ id, data }) => ({
        url: `/hostProfile/${id}/reject`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "HostProfile", id },
        "HostProfile",
      ],
    }),

    reviewHostProfile: builder.mutation<
      ApiResponse<object>,
      { id: number; data: ReviewHostProfileRequest }
    >({
      query: ({ id, data }) => ({
        url: `/hostProfile/${id}/review`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "HostProfile", id },
        "HostProfile",
      ],
    }),

    markAsSuperhost: builder.mutation<
      ApiResponse<object>,
      { hostProfileId: number; data: SuperhostRequest }
    >({
      query: ({ hostProfileId, data }) => ({
        url: `/hostProfile/${hostProfileId}/superhost`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { hostProfileId }) => [
        { type: "HostProfile", id: hostProfileId },
        "HostProfile",
      ],
    }),

    toggleActiveStatus: builder.mutation<
      ApiResponse<object>,
      { hostProfileId: number; data: ActiveStatusRequest }
    >({
      query: ({ hostProfileId, data }) => ({
        url: `/hostProfile/${hostProfileId}/active-status`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { hostProfileId }) => [
        { type: "HostProfile", id: hostProfileId },
        "HostProfile",
      ],
    }),

    removeHostProfile: builder.mutation<ApiResponse<object>, number>({
      query: (userId) => ({
        url: `/hostProfile/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, userId) => [
        { type: "HostProfile", id: userId },
        "HostProfile",
      ],
    }),

    updateStatistics: builder.mutation<
      ApiResponse<object>,
      { hostProfileId: number; data: UpdateStatisticsRequest }
    >({
      query: ({ hostProfileId, data }) => ({
        url: `/hostProfile/${hostProfileId}/statistics`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { hostProfileId }) => [
        { type: "HostProfile", id: hostProfileId },
        "HostProfile",
      ],
    }),

    // services/endpoints/hostProfile.api.ts
    deleteHostAvatar: builder.mutation<void, number>({
      query: (hostId) => ({
        url: `/hosts/${hostId}/avatar`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "HostProfile", id }],
    }),

    uploadHostAvatar: builder.mutation<
      { avatarUrl: string },
      { hostId: number; file: File }
    >({
      async queryFn({ hostId, file }, { getState }) {
        try {
          const formData = new FormData();
          formData.append("file", file);

          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/hosts/${hostId}/avatar`,
            {
              method: "POST",
              body: formData,

              // Không set Content-Type → browser tự thêm boundary
            }
          );

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Upload avatar thất bại");
          }

          const data: { avatarUrl: string } = await response.json();
          return { data };
        } catch (error: any) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: error.message || "Lỗi mạng hoặc server",
            },
          };
        }
      },
      invalidatesTags: (result, error, { hostId }) => [
        { type: "HostProfile", id: hostId },
      ],
    }),

    exportHostProfilesToExcel: builder.query<Blob, HostProfileFilter>({
      query: (filter) => ({
        url: "/hostProfile/export/excel",
        method: "GET",
        params: filter,
        responseHandler: (response) => response.blob(),
      }),
    }),
    exportHostProfilesToPdf: builder.query<Blob, HostProfileFilter>({
      query: (filter) => ({
        url: "/hostProfile/export/pdf",
        method: "GET",
        params: filter,
        responseHandler: (response) => response.blob(),
      }),
    }),
    exportHostProfilesToCSV: builder.query<Blob, HostProfileFilter>({
      query: (filter) => ({
        url: "/hostProfile/export/csv",
        method: "GET",
        params: filter,
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

// === EXPORT HOOKS ===
export const {
  useRegisterHostMutation,
  useGetHostProfileByIdQuery,
  useGetAllHostProfilesQuery,
  useUpdateHostProfileMutation,
  useUploadIdentityCardMutation,
  useUploadBusinessLicenseMutation,
  useUploadTaxCodeDocumentMutation,
  useApproveHostProfileMutation,
  useRejectHostProfileMutation,
  useReviewHostProfileMutation,
  useMarkAsSuperhostMutation,
  useToggleActiveStatusMutation,
  useRemoveHostProfileMutation,
  useUpdateStatisticsMutation,
  useUploadHostAvatarMutation,
  useDeleteHostAvatarMutation,
  useLazyExportHostProfilesToExcelQuery,
  useLazyExportHostProfilesToPdfQuery,
  useLazyExportHostProfilesToCSVQuery,
} = hostProfileApi;
