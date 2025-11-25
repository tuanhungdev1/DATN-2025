// src/services/endpoints/user.api.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/services/api.service";
import type { UserProfile } from "@/types/auth.types";
import type { ApiResponse, PagedResult } from "@/types/baseApi.types";
import {
  type UpdateUserProfile,
  type CreateUser,
  type UpdateUser,
  type User,
  type UserAvatar,
  type UserFilters,
} from "@/types/user.types";
import type { EndpointBuilder } from "@reduxjs/toolkit/query";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder: EndpointBuilder<any, any, any>) => ({
    // Get all users with filtering, sorting, and pagination
    getUsers: builder.query<ApiResponse<PagedResult<User>>, UserFilters>({
      query: (filters) => {
        const params = new URLSearchParams();

        if (filters.search) params.append("search", filters.search);
        if (filters.sortBy) params.append("sortBy", filters.sortBy);
        if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);
        if (filters.isActive !== undefined && filters.isActive !== "all")
          params.append("isActive", String(filters.isActive));
        if (filters.isLocked !== undefined && filters.isLocked !== "all")
          params.append("isLocked", String(filters.isLocked));
        if (
          filters.isEmailConfirmed !== undefined &&
          filters.isEmailConfirmed !== "all"
        )
          params.append("isEmailConfirmed", String(filters.isEmailConfirmed));
        if (filters.roles && filters.roles.length > 0) {
          // Nếu BE expect query string: ?roles=Admin&roles=Host
          filters.roles.forEach((role) => {
            params.append("roles", role);
          });
        }
        if (filters.createdAtFrom)
          params.append("createdAtFrom", filters.createdAtFrom);
        if (filters.createdAtTo)
          params.append("createdAtTo", filters.createdAtTo);

        params.append("pageNumber", String(filters.pageNumber || 1));
        params.append("pageSize", String(filters.pageSize || 10));

        return `/user?${params.toString()}`;
      },
      providesTags: ["User"],
    }),

    // Get user by ID
    getUserProfile: builder.query<ApiResponse<UserProfile>, number>({
      query: (id) => ({
        url: `/user/${id}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    // Get user by email
    getUserByEmail: builder.query<ApiResponse<UserProfile>, string>({
      query: (email) => ({
        url: `/user/by-email/${email}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    // Create user
    createUser: builder.mutation<ApiResponse<UserProfile>, CreateUser>({
      query: (data) => ({
        url: "/user",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // Update user
    updateUser: builder.mutation<
      ApiResponse<object>,
      { id: number; data: UpdateUser }
    >({
      query: ({ id, data }) => ({
        url: `/user/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // Delete user
    deleteUser: builder.mutation<ApiResponse<object>, number>({
      query: (id) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    // Change user status
    changeUserStatus: builder.mutation<
      ApiResponse<object>,
      { id: number; isActive: boolean }
    >({
      query: ({ id, isActive }) => ({
        url: `/user/${id}/status`,
        method: "PUT",
        body: { isActive },
      }),
      invalidatesTags: ["User"],
    }),

    // Assign roles to user
    assignRoles: builder.mutation<
      ApiResponse<object>,
      { id: number; roles: string[] }
    >({
      query: ({ id, roles }) => ({
        url: `/user/${id}/roles`,
        method: "POST",
        body: roles,
      }),
      invalidatesTags: ["User"],
    }),

    // Remove roles from user
    removeRoles: builder.mutation<
      ApiResponse<object>,
      { id: number; roles: string[] }
    >({
      query: ({ id, roles }) => ({
        url: `/user/${id}/roles`,
        method: "DELETE",
        body: roles,
      }),
      invalidatesTags: ["User"],
    }),

    // Get user roles
    getUserRoles: builder.query<ApiResponse<string[]>, number>({
      query: (id) => ({
        url: `/user/${id}/roles`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    // Update user password
    updateUserPassword: builder.mutation<
      ApiResponse<object>,
      { id: number; newPassword: string }
    >({
      query: ({ id, newPassword }) => ({
        url: `/user/${id}/password`,
        method: "PUT",
        body: { newPassword },
      }),
      invalidatesTags: ["User"],
    }),

    // THAY ĐỔI: Sử dụng queryFn thay vì query
    uploadUserAvatar: builder.mutation<
      ApiResponse<UserAvatar>,
      { id: number; file: File }
    >({
      queryFn: async ({ id, file }) => {
        try {
          const formData = new FormData();
          formData.append("image", file);

          console.log("Form Data:", formData);

          const response = await fetch(
            `${
              import.meta.env.VITE_API_URL || "https://localhost:7073/api"
            }/user/${id}/avatar`,
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

          const data = await response.json();
          return { data };
        } catch (error: any) {
          return {
            error: {
              status: 500,
              data: error?.message || "Upload failed",
            },
          };
        }
      },
      invalidatesTags: ["User"],
    }),

    // THÊM: Delete user avatar
    deleteUserAvatar: builder.mutation<ApiResponse<object>, number>({
      query: (id) => ({
        url: `/user/${id}/avatar`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    // Get total users count
    getTotalUsersCount: builder.query<ApiResponse<number>, void>({
      query: () => ({
        url: "/user/count",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    // Lock user
    lockUser: builder.mutation<ApiResponse<object>, number>({
      query: (id) => ({
        url: `/user/${id}/lock`,
        method: "PUT",
      }),
      invalidatesTags: ["User"],
    }),

    // Unlock user
    unlockUser: builder.mutation<ApiResponse<object>, number>({
      query: (id) => ({
        url: `/user/${id}/unlock`,
        method: "PUT",
      }),
      invalidatesTags: ["User"],
    }),

    // Update user profile
    updateUserProfile: builder.mutation<
      ApiResponse<UserProfile>,
      UpdateUserProfile
    >({
      query: (data) => ({
        url: `/user/user-profile`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserProfileQuery,
  useGetUserByEmailQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useChangeUserStatusMutation,
  useAssignRolesMutation,
  useRemoveRolesMutation,
  useGetUserRolesQuery,
  useUpdateUserPasswordMutation,
  useDeleteUserAvatarMutation,
  useUploadUserAvatarMutation,
  useGetTotalUsersCountQuery,
  useLockUserMutation,
  useUnlockUserMutation,
  useUpdateUserProfileMutation,
} = userApi;
