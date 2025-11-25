import type { BookingStatus } from "@/enums/bookingStatus";
import type { Payment } from "./payment.types";
import type { CouponUsage } from "./coupon.types";

// DTOs
export interface BookingHomestay {
  id: number;
  homestayTitle: string;
  fullAddress: string;
  city: string;
  province: string;
  checkInTime: string;
  checkOutTime: string;
  mainImageUrl?: string | null;
  propertyTypeName: string;

  // Host Information
  ownerId: number;
  ownerName: string;
  ownerPhone?: string | null;
  ownerEmail?: string | null;
  ownerAvatar?: string | null;
}

export interface Booking {
  id: number;
  bookingCode: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfNights: number;
  numberOfGuests: number;
  numberOfAdults: number;
  numberOfChildren: number;
  numberOfInfants: number;
  baseAmount: number;
  cleaningFee: number;
  serviceFee: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  bookingStatus: BookingStatus;
  bookingStatusDisplay: string;
  specialRequests?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  cancelledBy?: string;
  createdAt: string;
  updatedAt: string;
  paymentNotes?: string;
  paymentExpiresAt?: string;

  // Guest Information
  guestId: number;
  guestName: string;
  guestPhone?: string;
  guestAvatar?: string;
  // THÊM: Thông tin người đặt phòng
  guestFullName: string;
  guestEmail: string;
  guestPhoneNumber: string;
  guestAddress?: string | null;
  guestCity?: string | null;
  guestCountry?: string | null;

  // THÊM: Thông tin người ở thực tế
  isBookingForSomeoneElse: boolean;
  actualGuestFullName?: string | null;
  actualGuestEmail?: string | null;
  actualGuestPhoneNumber?: string | null;
  actualGuestIdNumber?: string | null;
  actualGuestNotes?: string | null;

  // Homestay Information
  homestay: BookingHomestay;

  // Payment Information
  payments: Payment[];

  // Review Information
  canReview: boolean;
  hasReviewed: boolean;

  couponDiscountAmount?: number; // Tổng giảm giá từ coupon
  appliedCoupons?: CouponUsage[]; // Danh sách coupon đã dùng
}

export interface CreateBooking {
  homestayId: number;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  numberOfAdults: number;
  numberOfChildren?: number;
  numberOfInfants?: number;
  specialRequests?: string;

  // THÊM: Thông tin người đặt (bắt buộc)
  guestFullName: string;
  guestEmail: string;
  guestPhoneNumber: string;
  guestAddress?: string;
  guestCity?: string;
  guestCountry?: string;

  // THÊM: Thông tin đặt cho người khác (optional)
  isBookingForSomeoneElse?: boolean;
  actualGuestFullName?: string;
  actualGuestEmail?: string;
  actualGuestPhoneNumber?: string;
  actualGuestIdNumber?: string;
  actualGuestNotes?: string;
}

export interface UpdateBooking {
  checkInDate?: string;
  checkOutDate?: string;
  numberOfGuests?: number;
  numberOfAdults?: number;
  numberOfChildren?: number;
  numberOfInfants?: number;
  specialRequests?: string;

  // THÊM: Thông tin người đặt (chỉ Admin)
  guestFullName?: string;
  guestEmail?: string;
  guestPhoneNumber?: string;
  guestAddress?: string;
  guestCity?: string;
  guestCountry?: string;

  // THÊM: Thông tin người ở thực tế
  isBookingForSomeoneElse?: boolean;
  actualGuestFullName?: string;
  actualGuestEmail?: string;
  actualGuestPhoneNumber?: string;
  actualGuestIdNumber?: string;
  actualGuestNotes?: string;
}

export interface CancelBooking {
  cancellationReason: string;
}

export interface BookingStatistics {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  averageBookingValue: number;
  occupancyRate: number;
}

export interface BookingPriceCalculation {
  homestayId: number;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  numberOfAdults: number;
  numberOfChildren?: number;
  numberOfInfants?: number;
}

export interface BookingPriceBreakdown {
  baseAmount: number;
  cleaningFee: number;
  serviceFee: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
}

// Filter
export interface BookingFilter {
  bookingCode?: string;
  homestayId?: number;
  guestId?: number;
  hostId?: number;
  status?: BookingStatus;
  checkInDateFrom?: string;
  checkInDateTo?: string;
  checkOutDateFrom?: string;
  checkOutDateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  pageNumber?: number;
  pageSize?: number;
}
