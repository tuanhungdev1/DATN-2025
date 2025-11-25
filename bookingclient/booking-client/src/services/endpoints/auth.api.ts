/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/services/api.service";
import type {
  ConfirmEmailRequest,
  Enable2FARequest,
  ExternalLoginRequest,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResendConfirmationRequest,
  ResetPasswordRequest,
  UserProfile,
  Verify2FARequest,
} from "@/types/auth.types";
import type { ApiResponse } from "@/types/baseApi.types";

import type { EndpointBuilder } from "@reduxjs/toolkit/query";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder: EndpointBuilder<any, any, any>) => ({
    // Register
    register: builder.mutation<ApiResponse<{ email: string }>, RegisterRequest>(
      {
        query: (data) => ({
          url: "/auth/register",
          method: "POST",
          body: data,
        }),
      }
    ),

    // Login
    login: builder.mutation<ApiResponse<UserProfile>, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth", "User"],
    }),

    // Verify 2FA
    verify2FA: builder.mutation<ApiResponse<UserProfile>, Verify2FARequest>({
      query: (data) => ({
        url: "/auth/verify-2fa",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth", "User"],
    }),

    // Logout
    logout: builder.mutation<ApiResponse<object>, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth", "User"],
    }),

    // Get current user
    getCurrentUser: builder.query<ApiResponse<UserProfile>, void>({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),

    // Confirm Email
    confirmEmail: builder.mutation<ApiResponse<object>, ConfirmEmailRequest>({
      query: (data) => ({
        url: "/auth/confirm-email",
        method: "POST",
        body: data,
      }),
    }),

    // Resend Confirmation
    resendConfirmation: builder.mutation<
      ApiResponse<object>,
      ResendConfirmationRequest
    >({
      query: (data) => ({
        url: "/auth/resend-confirmation",
        method: "POST",
        body: data,
      }),
    }),

    // Forgot Password
    forgotPassword: builder.mutation<
      ApiResponse<object>,
      ForgotPasswordRequest
    >({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    // Reset Password
    resetPassword: builder.mutation<ApiResponse<object>, ResetPasswordRequest>({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),

    // Enable/Disable 2FA
    enable2FA: builder.mutation<ApiResponse<object>, Enable2FARequest>({
      query: (data) => ({
        url: "/auth/enable-2fa",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // Send 2FA Code
    send2FACode: builder.mutation<ApiResponse<object>, string>({
      query: (email) => ({
        url: "/auth/send-2fa-code",
        method: "POST",
        body: JSON.stringify(email),
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    // Login Admin
    loginAdmin: builder.mutation<ApiResponse<UserProfile>, LoginRequest>({
      query: (data) => ({
        url: "/auth/login/admin",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // Refresh Token
    refreshToken: builder.mutation<
      ApiResponse<UserProfile>,
      { refreshToken: string }
    >({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
      }),
    }),

    // Google Login
    googleLogin: builder.mutation<
      ApiResponse<UserProfile>,
      ExternalLoginRequest
    >({
      query: (data) => ({
        url: "/auth/external-login/google",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth", "User"],
    }),

    // Facebook Login
    facebookLogin: builder.mutation<
      ApiResponse<UserProfile>,
      ExternalLoginRequest
    >({
      query: (data) => ({
        url: "/auth/external-login/facebook",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth", "User"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useVerify2FAMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useConfirmEmailMutation,
  useResendConfirmationMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useEnable2FAMutation,
  useSend2FACodeMutation,
  useRefreshTokenMutation,
  useLoginAdminMutation,
  useGoogleLoginMutation,
  useFacebookLoginMutation,
} = authApi;
