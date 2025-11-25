/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/services/api.service";
import type { ApiResponse, PagedResult } from "@/types/baseApi.types";
import type {
  PropertyType,
  PropertyTypeFilter,
  CreatePropertyType,
  UpdatePropertyType,
} from "@/types/propertyType.types";
import type { EndpointBuilder } from "@reduxjs/toolkit/query";

export const propertyTypeApi = baseApi.injectEndpoints({
  endpoints: (builder: EndpointBuilder<any, any, any>) => ({
    // 🔹 GET: danh sách có phân trang + lọc
    getPropertyTypes: builder.query<
      ApiResponse<PagedResult<PropertyType>>,
      PropertyTypeFilter
    >({
      query: (filters) => {
        const params = new URLSearchParams();

        if (filters.search) params.append("search", filters.search);
        if (filters.isActive !== undefined)
          params.append("isActive", String(filters.isActive));
        if (filters.sortBy) params.append("sortBy", filters.sortBy);
        if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);
        params.append("pageNumber", String(filters.pageNumber || 1));
        params.append("pageSize", String(filters.pageSize || 10));

        return `/propertytype?${params.toString()}`;
      },
      providesTags: ["PropertyType"],
    }),

    // 🔹 GET: lấy theo Id
    getPropertyTypeById: builder.query<ApiResponse<PropertyType>, number>({
      query: (id) => `/propertytype/${id}`,
      providesTags: ["PropertyType"],
    }),

    // 🔹 POST: tạo mới PropertyType
    createPropertyType: builder.mutation<
      ApiResponse<PropertyType>,
      CreatePropertyType
    >({
      queryFn: async (data) => {
        try {
          const formData = new FormData();
          formData.append("typeName", data.typeName);
          if (data.description)
            formData.append("description", data.description);
          formData.append("isActive", String(data.isActive ?? true));
          formData.append("displayOrder", String(data.displayOrder ?? 0));
          if (data.iconFile) formData.append("iconFile", data.iconFile);

          const response = await fetch(
            `${
              import.meta.env.VITE_API_URL || "https://localhost:7073/api"
            }/propertytype`,
            {
              method: "POST",
              body: formData,
              credentials: "include",
            }
          );

          if (!response.ok) {
            const error = await response.json();
            return {
              error: { status: response.status, data: error },
            };
          }

          const responseData = await response.json();
          return { data: responseData };
        } catch (error: any) {
          return {
            error: {
              status: 500,
              data: error?.message || "Tạo loại tài sản thất bại",
            },
          };
        }
      },
      invalidatesTags: ["PropertyType"],
    }),

    // 🔹 PUT: cập nhật PropertyType
    updatePropertyType: builder.mutation<
      ApiResponse<PropertyType>,
      { id: number; data: UpdatePropertyType }
    >({
      queryFn: async ({ id, data }) => {
        try {
          const formData = new FormData();
          if (data.typeName) formData.append("typeName", data.typeName);
          if (data.description)
            formData.append("description", data.description);
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
            }/propertytype/${id}`,
            {
              method: "PUT",
              body: formData,
              credentials: "include",
            }
          );

          if (!response.ok) {
            const error = await response.json();
            return {
              error: { status: response.status, data: error },
            };
          }

          const responseData = await response.json();
          return { data: responseData };
        } catch (error: any) {
          return {
            error: {
              status: 500,
              data: error?.message || "Cập nhật loại tài sản thất bại",
            },
          };
        }
      },
      invalidatesTags: ["PropertyType"],
    }),

    // 🔹 DELETE: xóa PropertyType
    deletePropertyType: builder.mutation<ApiResponse<object>, number>({
      query: (id) => ({
        url: `/propertytype/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PropertyType"],
    }),

    // 🔹 PUT: đổi trạng thái kích hoạt
    setPropertyTypeStatus: builder.mutation<
      ApiResponse<object>,
      { id: number; isActive: boolean }
    >({
      query: ({ id, isActive }) => ({
        url: `/propertytype/${id}/status`,
        method: "PUT",
        body: isActive,
      }),
      invalidatesTags: ["PropertyType"],
    }),
  }),
});

// ✅ Export hooks
export const {
  useGetPropertyTypesQuery,
  useGetPropertyTypeByIdQuery,
  useCreatePropertyTypeMutation,
  useUpdatePropertyTypeMutation,
  useDeletePropertyTypeMutation,
  useSetPropertyTypeStatusMutation,
} = propertyTypeApi;
