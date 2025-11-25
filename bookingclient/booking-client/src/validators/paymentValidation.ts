// src/validators/paymentValidation.ts
import * as Yup from "yup";
import { PaymentMethod } from "@/enums/paymentEnums";

export const createOnlinePaymentValidationSchema = Yup.object().shape({
  bookingId: Yup.number()
    .required("Booking ID là bắt buộc")
    .min(1, "Booking ID phải là số dương"),

  paymentMethod: Yup.number()
    .required("Phương thức thanh toán là bắt buộc")
    .oneOf(
      [PaymentMethod.VNPay, PaymentMethod.ZaloPay, PaymentMethod.Momo],
      "Phương thức thanh toán không hợp lệ"
    ),

  returnUrl: Yup.string()
    .required("Return URL là bắt buộc")
    .url("Return URL không hợp lệ"),

  paymentNotes: Yup.string()
    .max(500, "Ghi chú không được vượt quá 500 ký tự")
    .optional(),
});

export const processPaymentValidationSchema = Yup.object().shape({
  paymentId: Yup.number()
    .required("Payment ID là bắt buộc")
    .min(1, "Payment ID phải là số dương"),

  transactionId: Yup.string()
    .required("Transaction ID là bắt buộc")
    .min(1, "Transaction ID không được để trống"),

  paymentGatewayId: Yup.string().optional(),
  paymentGateway: Yup.string().optional(),
});

export const refundPaymentValidationSchema = Yup.object().shape({
  refundAmount: Yup.number()
    .required("Số tiền hoàn là bắt buộc")
    .min(0.01, "Số tiền hoàn phải lớn hơn 0"),

  refundReason: Yup.string()
    .required("Lý do hoàn tiền là bắt buộc")
    .max(500, "Lý do hoàn tiền không được vượt quá 500 ký tự"),
});

export const markPaymentFailedValidationSchema = Yup.object().shape({
  failureReason: Yup.string()
    .required("Lý do thất bại là bắt buộc")
    .max(500, "Lý do thất bại không được vượt quá 500 ký tự"),
});
