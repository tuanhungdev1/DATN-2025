import type { UserProfile } from "./auth.types";

export interface BaseResponse {
  success: boolean;
  message: string;
  timestamp: string; // DateTime => string ISO
  traceId?: string;
}

export interface ApiResponse<T> extends BaseResponse {
  data?: T;
}

export interface AuthResponse extends BaseResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: string;
  refreshTokenExpires: string;
  user: UserProfile;
  requiresTwoFactor: boolean;
}

export interface PaginationFilter {
  pageNumber: number; // default: 1
  pageSize: number; // default: 10, max: 100
}

export const defaultPagination: PaginationFilter = {
  pageNumber: 1,
  pageSize: 10,
};

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  firstRowOnPage: number;
  lastRowOnPage: number;
}
