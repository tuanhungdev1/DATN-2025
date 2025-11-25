// utils/couponDisplay.ts

import { CouponScope, CouponType } from "@/types/coupon.types";

export function getCouponTypeDisplay(type: CouponType): string {
  switch (type) {
    case CouponType.Percentage:
      return "Giảm theo phần trăm";
    case CouponType.FixedAmount:
      return "Giảm số tiền cố định";
    case CouponType.FirstBooking:
      return "Ưu đãi booking đầu tiên";
    case CouponType.Seasonal:
      return "Giảm giá theo mùa";
    case CouponType.LongStay:
      return "Giảm giá cho kỳ ở dài ngày";
    case CouponType.Referral:
      return "Giảm giá giới thiệu bạn bè";
    default:
      return "Không xác định";
  }
}

export function getCouponScopeDisplay(scope: CouponScope): string {
  switch (scope) {
    case CouponScope.AllHomestays:
      return "Tất cả homestay";
    case CouponScope.SpecificHomestay:
      return "Một homestay cụ thể";
    case CouponScope.MultipleHomestays:
      return "Nhiều homestay cụ thể";
    default:
      return "Không xác định";
  }
}
