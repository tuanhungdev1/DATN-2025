export const CouponType = {
  Percentage: 1,
  FixedAmount: 2,
  FirstBooking: 3,
  Seasonal: 4,
  LongStay: 5,
  Referral: 6,
} as const;

export type CouponType = (typeof CouponType)[keyof typeof CouponType];

export const CouponScope = {
  AllHomestays: 1,
  SpecificHomestay: 2,
  MultipleHomestays: 3,
} as const;

export type CouponScope = (typeof CouponScope)[keyof typeof CouponScope];

export interface CreateCoupon {
  couponCode: string;
  couponName: string;
  description?: string | null;
  couponType: CouponType;
  discountValue: number;
  maxDiscountAmount?: number | null;
  startDate: string; // ISO string
  endDate: string; // ISO string
  totalUsageLimit?: number | null;
  usagePerUser?: number | null;
  minimumBookingAmount?: number | null;
  minimumNights?: number | null;
  isFirstBookingOnly?: boolean;
  isNewUserOnly?: boolean;
  scope: CouponScope;
  specificHomestayId?: number | null;
  applicableHomestayIds?: number[] | null;
  isPublic?: boolean;
  priority?: number;
  actingAsRole: "Host" | "Admin";
}

export interface UpdateCoupon {
  couponName?: string;
  description?: string | null;
  discountValue?: number;
  maxDiscountAmount?: number | null;
  startDate?: string;
  endDate?: string;
  totalUsageLimit?: number | null;
  usagePerUser?: number | null;
  minimumBookingAmount?: number | null;
  minimumNights?: number | null;
  scope: CouponScope;
  specificHomestayId?: number | null;
  isPublic?: boolean;
  priority?: number;
  applicableHomestayIds?: number[] | null;
  actingAsRole: "Host" | "Admin";
}

export interface ValidateCoupon {
  couponCode: string;
  homestayId: number;
  bookingAmount: number;
  numberOfNights: number;
  checkInDate: string;
  checkOutDate: string;
  bookingId: number;
}

export interface CouponValidationResult {
  isValid: boolean;
  message: string;
  coupon?: Coupon | null;
  discountAmount: number;
  finalAmount: number;
}

export interface CouponUsage {
  id: number;
  couponId: number;
  couponCode: string;
  userId: number;
  userName: string;
  bookingId: number;
  bookingCode: string;
  discountAmount: number;
  usedAt: string;
}

export interface CouponTypeStatistic {
  couponType: CouponType;
  count: number;
  totalDiscount: number;
}

export interface CouponStatistics {
  totalCoupons: number;
  activeCoupons: number;
  expiredCoupons: number;
  totalUsageCount: number;
  totalDiscountAmount: number;
  averageDiscountAmount: number;
  couponTypeStats: CouponTypeStatistic[];
}

export interface Coupon {
  id: number;
  couponCode: string;
  couponName: string;
  description?: string | null;
  couponType: CouponType;
  couponTypeDisplay: string;
  discountValue: number;
  maxDiscountAmount?: number | null;
  startDate: string;
  endDate: string;
  totalUsageLimit?: number | null;
  currentUsageCount: number;
  usagePerUser?: number | null;
  minimumBookingAmount?: number | null;
  minimumNights?: number | null;
  isFirstBookingOnly: boolean;
  isNewUserOnly: boolean;
  scope: CouponScope;
  scopeDisplay: string;
  specificHomestayId?: number | null;
  specificHomestayName?: string | null;
  applicableHomestayIds: number[];
  isActive: boolean;
  isPublic: boolean;
  priority: number;
  isExpired: boolean;
  isAvailable: boolean;
  createdByUserId?: number | null;
  createdByUserName?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CouponFilter {
  searchTerm?: string;
  couponCode?: string;
  couponType?: CouponType;
  isActive?: boolean;
  isPublic?: boolean;
  isExpired?: boolean;
  validFrom?: string;
  validTo?: string;
  homestayId?: number;
  createdByUserId?: number;
  sortBy?: string;
  sortDirection?: string;
  pageNumber?: number;
  pageSize?: number;
}
