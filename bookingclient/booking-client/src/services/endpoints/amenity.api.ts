/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/services/api.service";
import type { ApiResponse, PagedResult } from "@/types/baseApi.types";
import type {
  Amenity,
  AmenityFilter,
  CreateAmenity,
  UpdateAmenity,
} from "@/types/amenity.types";
import type { EndpointBuilder } from "@reduxjs/toolkit/query";

export const amenityApi = baseApi.injectEndpoints({
  endpoints: (builder: EndpointBuilder<any, any, any>) => ({
    getAmenities: builder.query<
      ApiResponse<PagedResult<Amenity>>,
      AmenityFilter
    >({
      query: (filters) => {
        const params = new URLSearchParams();

        if (filters.search) params.append("search", filters.search);
        if (filters.category) params.append("category", filters.category);
        if (filters.isActive !== undefined)
          params.append("isActive", String(filters.isActive));
        if (filters.sortBy) params.append("sortBy", filters.sortBy);
        if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

        params.append("pageNumber", String(filters.pageNumber || 1));
        params.append("pageSize", String(filters.pageSize || 10));

        return `/amenity?${params.toString()}`;
      },
      providesTags: ["Amenity"],
    }),

    getAmenityById: builder.query<ApiResponse<Amenity>, number>({
      query: (id) => `/amenity/${id}`,
      providesTags: ["Amenity"],
    }),

    createAmenity: builder.mutation<ApiResponse<Amenity>, CreateAmenity>({
      queryFn: async (data) => {
        try {
          const formData = new FormData();
          formData.append("amenityName", data.amenityName);
          if (data.amenityDescription)
            formData.append("amenityDescription", data.amenityDescription);
          formData.append("category", data.category);
          formData.append("isActive", String(data.isActive ?? true));
          formData.append("displayOrder", String(data.displayOrder ?? 0));
          if (data.iconFile) formData.append("iconFile", data.iconFile);

          const response = await fetch(
            `${
              import.meta.env.VITE_API_URL || "https://localhost:7073/api"
            }/amenity`,
            {
              method: "POST",
              body: formData,
              credentials: "include",
            }
          );

          if (!response.ok) {
            const error = await response.json();
            return {
              error: {
                status: response.status,
                data: error,
              },
            };
          }

          const responseData = await response.json();
          return { data: responseData };
        } catch (error: any) {
          return {
            error: {
              status: 500,
              data: error?.message || "Tạo tiện nghi thất bại",
            },
          };
        }
      },
      invalidatesTags: ["Amenity"],
    }),

    updateAmenity: builder.mutation<
      ApiResponse<Amenity>,
      { id: number; data: UpdateAmenity }
    >({
      queryFn: async ({ id, data }) => {
        try {
          const formData = new FormData();
          if (data.amenityName)
            formData.append("amenityName", data.amenityName);
          if (data.amenityDescription)
            formData.append("amenityDescription", data.amenityDescription);
          if (data.category) formData.append("category", data.category);
          if (data.isActive !== undefined)
            formData.append("isActive", String(data.isActive));
          if (data.displayOrder !== undefined)
            formData.append("displayOrder", String(data.displayOrder));
          if (data.iconFile) formData.append("iconFile", data.iconFile);
          if (data.imageAction)
            formData.append("imageAction", data.imageAction);

          const response = await fetch(
            `${
              import.meta.env.VITE_API_URL || "https://localhost:7073/api"
            }/amenity/${id}`,
            {
              method: "PUT",
              body: formData,
              credentials: "include",
            }
          );

          if (!response.ok) {
            const error = await response.json();
            return {
              error: {
                status: response.status,
                data: error,
              },
            };
          }

          const responseData = await response.json();
          return { data: responseData };
        } catch (error: any) {
          return {
            error: {
              status: 500,
              data: error?.message || "Cập nhật tiện nghi thất bại",
            },
          };
        }
      },
      invalidatesTags: ["Amenity"],
    }),

    deleteAmenity: builder.mutation<ApiResponse<object>, number>({
      query: (id) => ({
        url: `/amenity/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Amenity"],
    }),

    setAmenityStatus: builder.mutation<
      ApiResponse<object>,
      { id: number; isActive: boolean }
    >({
      query: ({ id, isActive }) => ({
        url: `/amenity/${id}/status`,
        method: "PUT",
        body: isActive,
      }),
      invalidatesTags: ["Amenity"],
    }),
  }),
});

export const {
  useGetAmenitiesQuery,
  useGetAmenityByIdQuery,
  useCreateAmenityMutation,
  useUpdateAmenityMutation,
  useDeleteAmenityMutation,
  useSetAmenityStatusMutation,
} = amenityApi;
