import type { Gender } from "@/enums/gender.enum";
import type { PaginationFilter } from "./baseApi.types";

export interface UserAvatar {
  userId: number;
  avatarUrl: string;
  publicId: string;
}

export interface UpdateUserProfile {
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  gender?: Gender;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  phoneNumber?: string;
}

export interface User {
  id: number;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth?: string | null; // ISO date string, ví dụ: "1990-05-14"
  gender?: Gender | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  postalCode?: string | null;
  avatar?: string | null;
  isActive: boolean;
  isEmailConfirmed: boolean;
  createdAt: string; // ISO datetime string
  updatedAt?: string | null;
  lastLoginAt?: string | null;
  isDeleted: boolean;
  isLocked: boolean;
  phoneNumber?: string | null;
  roles: string[];
}

export interface CreateUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string | null;
  gender?: Gender | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  postalCode?: string | null;
  phoneNumber?: string | null;
  roles?: string[] | null;
}

export interface UpdateUser {
  firstName?: string;
  lastName?: string;
  email?: string;
  dateOfBirth?: string | null;
  gender?: Gender | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  postalCode?: string | null;
  phoneNumber?: string | null;
  isActive?: boolean | null;
  isDeleted?: boolean | null;
  isLocked?: boolean | null;
  roles?: string[] | null;
}

export interface UserFilters extends PaginationFilter {
  // Sorting
  sortBy?: "userName" | "email" | "fullName" | "createdAt" | undefined;
  sortOrder?: "asc" | "desc";

  // Status Filters
  isActive?: boolean | "all";
  isLocked?: boolean | "all";
  isEmailConfirmed?: boolean | "all";

  // Role Filter
  roles?: string[];

  // Date Range
  createdAtFrom?: string; // ISO date
  createdAtTo?: string; // ISO date
  // Text Search
  search?: string;
}
