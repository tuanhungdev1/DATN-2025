// src/types/payment.types.ts
import type { PaymentMethod, PaymentStatus } from "@/enums/payment.enums";

export interface BookingPaymentInfo {
  id: number;
  bookingCode: string;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
  homestayTitle: string;
  guestName: string;
  numberOfNights: number;
  numberOfGuests: number;
}

export interface RefundStatus {
  paymentId: number;
  originalAmount: number;
  refundedAmount: number;
  refundableAmount: number;
  canRefund: boolean;

  // Tính toán các giá trị
  refundedPercentage: number;
  refundablePercentage: number;
  refundStatusDisplay: string;
  suggestedColor: "success" | "warning" | "error";
}

export interface Payment {
  id: number;
  paymentAmount: number;
  paymentMethod: PaymentMethod;
  paymentMethodDisplay: string;
  paymentStatus: PaymentStatus;
  paymentStatusDisplay: string;
  transactionId?: string;
  paymentGateway?: string;
  paymentGatewayId?: string;
  processedAt?: string;
  paymentNotes?: string;
  failureReason?: string;
  refundAmount?: number;
  refundedAt?: string;
  createdAt: string;
  updatedAt: string;
  bookingId: number;
  booking?: BookingPaymentInfo;
}

export interface PaymentFilter {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: "createdAt" | "paymentAmount" | "processedAt";
  sortDirection?: "asc" | "desc";
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  minAmount?: number;
  maxAmount?: number;
  dateFrom?: string;
  dateTo?: string;
  bookingCode?: string;
}

export interface CreateOnlinePayment {
  bookingId: number;
  paymentMethod: PaymentMethod;
  returnUrl: string;
  paymentNotes?: string;
}

export interface PaymentUrlResponse {
  paymentUrl: string;
  paymentId: number;
  transactionReference: string;
  expiryTime: string;
}

export interface CreatePayment {
  bookingId: number;
  paymentAmount: number;
  paymentMethod: PaymentMethod;
  paymentNotes?: string;
}

export interface ProcessPayment {
  paymentId: number;
  transactionId: string;
  paymentGatewayId?: string;
  paymentGateway?: string;
}

export interface RefundPayment {
  refundAmount: number;
  refundReason: string;
}

export interface MarkPaymentFailed {
  failureReason: string;
}
