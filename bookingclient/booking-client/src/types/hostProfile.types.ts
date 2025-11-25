export const HostStatus = {
  Pending: 0, // Chờ xét duyệt
  UnderReview: 1, // Đang xem xét
  Approved: 2, // Đã chấp nhận
  Rejected: 3, // Đã từ chối
  RequiresMoreInfo: 4, // Yêu cầu bổ sung thông tin
  Cancelled: 5, // Người dùng hủy đơn
} as const;

export type HostStatus = (typeof HostStatus)[keyof typeof HostStatus];
export interface CreateHostProfile {
  userId: number;
  businessName: string;
  aboutMe?: string | null;
  languages?: string | null;
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
  identityCardFrontFile: File;
  identityCardBackFile: File;
  businessLicenseFile?: File | null;
  taxCodeDocumentFile?: File | null;
  applicantNote?: string | null;
  avatarFile?: File | null;
}

export interface UpdateHostProfile {
  businessName?: string | null;
  aboutMe?: string | null;
  languages?: string | null;
  bankName?: string | null;
  bankAccountNumber?: string | null;
  bankAccountName?: string | null;
  taxCode?: string | null;
  applicantNote?: string | null;
  avatarFile?: File | null;
}

export interface UploadIdentityCard {
  frontImage: File;
  backImage: File;
}

export interface UploadBusinessLicense {
  file: File;
}

export interface UploadTaxCodeDocument {
  file: File;
}

export interface ApproveHostProfileRequest {
  note?: string | null;
}

export interface RejectHostProfileRequest {
  reason: string;
}

export interface ReviewHostProfileRequest {
  status: string;
  note?: string | null;
}

export interface SuperhostRequest {
  isSuperhost: boolean;
}

export interface ActiveStatusRequest {
  isActive: boolean;
}

export interface UpdateStatisticsRequest {
  totalHomestays: number;
  totalBookings: number;
  averageRating: number;
  responseRate: number;
  averageResponseTime?: string | null; // ISO duration or string
}

export interface HostProfile {
  id: number;
  userId: number;
  businessName?: string | null;
  aboutMe?: string | null;
  languages?: string | null;
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
  identityCardFrontUrl?: string | null;
  identityCardBackUrl?: string | null;
  businessLicenseUrl?: string | null;
  taxCodeDocumentUrl?: string | null;
  taxCode?: string | null;
  avatarUrl?: string | null;
  totalHomestays: number;
  totalBookings: number;
  averageRating: number;
  responseRate: number;
  averageResponseTime?: string | null; // ISO duration
  isActive: boolean;
  isSuperhost: boolean;
  registeredAsHostAt: string;
  status: HostStatus;
  reviewedByAdminId?: number | null;
  reviewedAt?: string | null;
  reviewNote?: string | null;
  applicantNote?: string | null;
  submittedAt: string;
  createdAt: string;
  updatedAt?: string | null;
  isDeleted: boolean;
  deletedAt?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}

export interface HostProfileFilter {
  searchTerm?: string;
  isActive?: boolean;
  hostStatus?: HostStatus;
  isSuperhost?: boolean;
  registeredFrom?: string;
  registeredTo?: string;
  reviewedFrom?: string;
  reviewedTo?: string;
  minAverageRating?: number;
  maxAverageRating?: number;
  minTotalBookings?: number;
  maxTotalBookings?: number;
  minTotalHomestays?: number;
  maxTotalHomestays?: number;
  minResponseRate?: number;
  maxResponseRate?: number;
  sortBy?: string;
  sortDirection?: string;
  pageNumber?: number;
  pageSize?: number;
}
