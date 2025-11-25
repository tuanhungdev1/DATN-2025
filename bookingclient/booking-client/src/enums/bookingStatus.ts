// src/enums/bookingEnums.ts

export const BookingStatus = {
  Pending: 0,
  Confirmed: 1,
  CheckedIn: 2,
  CheckedOut: 3,
  Completed: 4,
  Cancelled: 5,
  Rejected: 6,
  NoShow: 7,
} as const;

export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];

export const BookingStatusDisplay: Record<BookingStatus, string> = {
  [BookingStatus.Pending]: "Chờ xác nhận",
  [BookingStatus.Confirmed]: "Đã xác nhận",
  [BookingStatus.CheckedIn]: "Đã nhận phòng",
  [BookingStatus.CheckedOut]: "Đã trả phòng",
  [BookingStatus.Completed]: "Hoàn tất",
  [BookingStatus.Cancelled]: "Đã hủy",
  [BookingStatus.Rejected]: "Bị từ chối",
  [BookingStatus.NoShow]: "Không đến",
};

export const BookingStatusColor: Record<BookingStatus, string> = {
  [BookingStatus.Pending]: "#FF9800", // cam
  [BookingStatus.Confirmed]: "#2196F3", // xanh dương
  [BookingStatus.CheckedIn]: "#3F51B5", // tím than
  [BookingStatus.CheckedOut]: "#009688", // xanh ngọc
  [BookingStatus.Completed]: "#4CAF50", // xanh lá
  [BookingStatus.Cancelled]: "#F44336", // đỏ
  [BookingStatus.Rejected]: "#9C27B0", // tím
  [BookingStatus.NoShow]: "#795548", // nâu
};
