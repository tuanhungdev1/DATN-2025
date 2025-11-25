export const ROUTES = {
  // 🔹 Base Paths
  ROOT: "/",
  AUTH: "/auth",
  ADMIN: "/admin",
  USER: "/user",
  HOST: "/host",

  // 🔹 Trang chính
  HOME: "/",
  HOMESTAY_LIST: "homestay-list",
  HOMESTAY_DETAIL: "/homestay/:slug",

  // 🔹 Xác thực (Relative paths sẽ được combine với /auth)
  AUTH_LOGIN: "/auth/login",
  AUTH_REGISTER: "/auth/register",
  AUTH_FORGOT_PASSWORD: "/auth/forgot-password",
  AUTH_RESET_PASSWORD: "/auth/reset-password",
  AUTH_VERIFY_EMAIL: "/auth/email-verification-sent",
  AUTH_CONFIRM_EMAIL: "/auth/confirm-email",
  AUTH_VERIFY_2FA: "/auth/verify-2fa",

  // 🔹 Admin
  ADMIN_LOGIN: "/admin/login",
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_USERS: "/admin/users",
  ADMIN_BOOKINGS: "/admin/bookings",
  ADMIN_RULES: "/admin/rules",
  ADMIN_AMENITIES: "/admin/amenities",
  ADMIN_PROPERTY_TYPES: "/admin/property-types",
  ADMIN_HOMESTAYS: "/admin/homestays",
  ADMIN_HOMESTAYS_CREATE: "/admin/homestays/create",
  ADMIN_DETAIL_HOMESTAY: "/admin/homestays/:id",
  ADMIN_HOMESTAYS_EDIT: "/admin/homestays/:id/edit",
  ADMIN_COUPONS: "/admin/coupons",

  // ✅ Bổ sung các route mới bạn yêu cầu
  ADMIN_HOSTS: "/admin/hosts", // Chủ nhà
  ADMIN_PAYMENTS: "/admin/payments", // Doanh thu
  ADMIN_REVENUE: "/admin/revenue",
  ADMIN_REVIEWS: "/admin/reviews", // Đánh giá
  ADMIN_STATISTICS: "/admin/statistics", // Phân tích

  HOST_DASHBOARD: "/host/dashboard",
  HOST_HOMESTAYS: "/host/homestays",
  HOST_BOOKINGS: "/host/bookings",
  HOST_PAYMENTS: "/host/payments",
  HOST_REVIEWS: "/host/reviews",
  HOST_MESSAGES: "/host/messages",
  HOST_PROFILE: "/host/profile",
  HOST_PROFILE_EDIT: "/host/profile/edit",
  HOST_COUPON: "/host/coupons",

  // 🔹 User Profile
  USER_PROFILE: "/user/profile",
  USER_INFORMATION: "/user/profile/information",
  USER_PROFILE_EDIT: "/user/profile/edit",
  USER_PROFILE_SETTINGS: "/user/profile/settings",
  USER_PROFILE_BOOKINGS: "/user/profile/bookings",
  USER_PROFILE_WISHLIST: "/user/profile/wishlist",
  USER_PROFILE_PAYMENTS: "/user/profile/payments",
  USER_PROFILE_REVIEWS: "/user/profile/reviews",

  // 🔹 Cài đặt chung
  SETTINGS: "/settings",

  // 🔹 Lỗi
  NOT_FOUND: "*",
};
