/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/services/api.service";
import type { ApiResponse, PagedResult } from "@/types/baseApi.types";
import type {
  CreateRule,
  Rule,
  RuleFilter,
  UpdateRule,
} from "@/types/rule.type";

import type { EndpointBuilder } from "@reduxjs/toolkit/query";

export const ruleApi = baseApi.injectEndpoints({
  endpoints: (builder: EndpointBuilder<any, any, any>) => ({
    /** 🧩 Lấy danh sách Rule (có phân trang, filter, sort) */
    getRules: builder.query<ApiResponse<PagedResult<Rule>>, RuleFilter>({
      query: (filters) => {
        const params = new URLSearchParams();

        if (filters.search) params.append("search", filters.search);
        if (filters.ruleName) params.append("ruleName", filters.ruleName);
        if (filters.ruleType) params.append("ruleType", filters.ruleType);
        if (filters.isActive !== undefined)
          params.append("isActive", String(filters.isActive));
        if (filters.sortBy) params.append("sortBy", filters.sortBy);
        if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

        params.append("pageNumber", String(filters.pageNumber || 1));
        params.append("pageSize", String(filters.pageSize || 10));

        return `/rule?${params.toString()}`;
      },
      providesTags: ["Rule"],
    }),

    /** 🧩 Lấy Rule theo ID */
    getRuleById: builder.query<ApiResponse<Rule>, number>({
      query: (id) => `/rule/${id}`,
      providesTags: ["Rule"],
    }),

    /** 🧩 Lấy danh sách Rule đang active */
    getActiveRules: builder.query<ApiResponse<Rule[]>, void>({
      query: () => `/rule/active`,
      providesTags: ["Rule"],
    }),

    /** 🧩 Lấy danh sách Rule theo loại (Allowed / NotAllowed / Required) */
    getRulesByType: builder.query<ApiResponse<Rule[]>, string>({
      query: (ruleType) => `/rule/type/${ruleType}`,
      providesTags: ["Rule"],
    }),

    /** 🧩 Tạo mới Rule */
    createRule: builder.mutation<ApiResponse<Rule>, CreateRule>({
      queryFn: async (data) => {
        try {
          const formData = new FormData();
          formData.append("ruleName", data.ruleName);
          if (data.ruleDescription)
            formData.append("ruleDescription", data.ruleDescription);
          if (data.iconFile) formData.append("iconFile", data.iconFile);
          formData.append("ruleType", data.ruleType);
          formData.append("isActive", String(data.isActive ?? true));
          formData.append("displayOrder", String(data.displayOrder ?? 0));

          const response = await fetch(
            `${
              import.meta.env.VITE_API_URL || "https://localhost:7073/api"
            }/rule`,
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
              data: error?.message || "Tạo rule thất bại",
            },
          };
        }
      },
      invalidatesTags: ["Rule"],
    }),

    /** 🧩 Cập nhật Rule */
    updateRule: builder.mutation<
      ApiResponse<Rule>,
      { id: number; data: UpdateRule }
    >({
      queryFn: async ({ id, data }) => {
        try {
          const formData = new FormData();
          if (data.ruleName) formData.append("ruleName", data.ruleName);
          if (data.ruleDescription)
            formData.append("ruleDescription", data.ruleDescription);
          if (data.iconFile) formData.append("iconFile", data.iconFile);
          if (data.imageAction)
            formData.append("imageAction", data.imageAction);
          if (data.ruleType) formData.append("ruleType", data.ruleType);
          if (data.isActive !== undefined)
            formData.append("isActive", String(data.isActive));
          if (data.displayOrder !== undefined)
            formData.append("displayOrder", String(data.displayOrder));

          const response = await fetch(
            `${
              import.meta.env.VITE_API_URL || "https://localhost:7073/api"
            }/rule/${id}`,
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
              data: error?.message || "Cập nhật rule thất bại",
            },
          };
        }
      },
      invalidatesTags: ["Rule"],
    }),

    /** 🧩 Xóa Rule */
    deleteRule: builder.mutation<ApiResponse<object>, number>({
      query: (id) => ({
        url: `/rule/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Rule"],
    }),

    /** 🧩 Toggle trạng thái Active / Inactive */
    toggleRuleStatus: builder.mutation<ApiResponse<object>, number>({
      query: (id) => ({
        url: `/rule/${id}/toggle`,
        method: "PUT",
      }),
      invalidatesTags: ["Rule"],
    }),
  }),
});

export const {
  useGetRulesQuery,
  useGetRuleByIdQuery,
  useGetActiveRulesQuery,
  useGetRulesByTypeQuery,
  useCreateRuleMutation,
  useUpdateRuleMutation,
  useDeleteRuleMutation,
  useToggleRuleStatusMutation,
} = ruleApi;
