// src/enums/paymentEnums.ts

export const PaymentMethod = {
  Cash: 0,
  BankTransfer: 1,
  VNPay: 2,
  ZaloPay: 3,
  Momo: 4,
} as const;

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export const PaymentMethodDisplay: Record<PaymentMethod, string> = {
  [PaymentMethod.Cash]: "Tiền mặt",
  [PaymentMethod.BankTransfer]: "Chuyển khoản",
  [PaymentMethod.VNPay]: "VNPay",
  [PaymentMethod.ZaloPay]: "ZaloPay",
  [PaymentMethod.Momo]: "Momo",
};

export const PaymentStatus = {
  Pending: 0,
  Processing: 1,
  Completed: 2,
  Failed: 3,
  Refunded: 4,
  PartiallyRefunded: 5,
} as const;

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const PaymentStatusDisplay: Record<PaymentStatus, string> = {
  [PaymentStatus.Pending]: "Chờ thanh toán",
  [PaymentStatus.Processing]: "Đang xử lý",
  [PaymentStatus.Completed]: "Hoàn thành",
  [PaymentStatus.Failed]: "Thất bại",
  [PaymentStatus.Refunded]: "Đã hoàn tiền",
  [PaymentStatus.PartiallyRefunded]: "Hoàn tiền một phần",
};

export const PaymentStatusColor: Record<PaymentStatus, string> = {
  [PaymentStatus.Pending]: "#FF9800",
  [PaymentStatus.Processing]: "#2196F3",
  [PaymentStatus.Completed]: "#4CAF50",
  [PaymentStatus.Failed]: "#F44336",
  [PaymentStatus.Refunded]: "#9C27B0",
  [PaymentStatus.PartiallyRefunded]: "#FF9800",
};
