import type { Gender } from "@/enums/gender.enum";

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface ExternalLoginRequest {
  email: string;
  externalId: string;
  idToken: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export const AuthProvider = {
  Local: 0,
  Google: 1,
  Facebook: 2,
} as const;

export type AuthProvider = (typeof AuthProvider)[keyof typeof AuthProvider];

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber?: string;
  gender?: Gender;
  dateOfBirth?: Date;
  address?: string;
  city?: string;
  country?: string;
  acceptTerms: boolean;
}

export interface LoginResponse {
  user: UserProfile;
  token: string;
}

export interface UserProfile {
  id: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber?: string;
  avatar?: string;
  gender?: Gender;
  dateOfBirth?: Date;
  postalCode?: string;
  address?: string;
  city?: string;
  country?: string;
  isEmailConfirmed: boolean;
  twoFactorEnabled: boolean;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
  roles: string[];
  isLocked: boolean;
}

export interface Verify2FARequest {
  email: string;
  code: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ConfirmEmailRequest {
  email: string;
  token: string;
}

export interface ResendConfirmationRequest {
  email: string;
}
export interface ForgotPasswordRequest {
  email: string;
}
export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
  confirmNewPassword: string;
}
export interface Enable2FARequest {
  enable: boolean;
}

export interface AuthResponse {
  user: UserProfile;
  requiresTwoFactor?: boolean;
}
