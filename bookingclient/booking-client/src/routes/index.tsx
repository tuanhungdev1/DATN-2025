import { lazy } from "react";
import { Navigate, type RouteObject } from "react-router-dom";
import { ROUTES } from "@/constants/routes/routeConstants";

// Layouts
import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import UserProfileLayout from "@/layouts/UserProfileLayout";

// Guards
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import HostDashboardLayout from "@/layouts/HostDashboardLayout";

// 🧱 Lazy import các trang
const Home = lazy(() => import("@/pages/home/HomePage"));
const HomestayList = lazy(
  () => import("@/pages/dashboard/homestay/HomestayListPage")
);

// ERROR PAGES
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
const UnauthorizedPage = lazy(() => import("@/pages/UnauthorizedPage"));

// INFO PAGES
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));

// AUTH
const Login = lazy(() => import("@/pages/auth/Login"));
const Register = lazy(() => import("@/pages/auth/Register"));
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/auth/ResetPassword"));
const EmailVerification = lazy(
  () => import("@/pages/auth/EmailVerificationSent")
);
const VerificationOtp = lazy(() => import("@/pages/auth/OtpVerification"));
const ConfirmEmail = lazy(() => import("@/pages/auth/ConfirmEmail"));
const AdminLogin = lazy(() => import("@/pages/auth/LoginAdmin"));

// DASHBOARD
const Dashboard = lazy(() => import("@/pages/dashboard/DashboardPage"));
const UserManager = lazy(
  () => import("@/pages/dashboard/user/UserManagerPage")
);
const AdminHomestay = lazy(
  () => import("@/pages/dashboard/homestay/HomestayManagerPage")
);

const AdminHomestayCreate = lazy(
  () => import("@/pages/dashboard/homestay/components/CreateHomestay")
);
const AdminDetailHomestay = lazy(
  () => import("@/pages/dashboard/homestay/components/HomestayDetail")
);
const AdminUpdateHomestay = lazy(
  () => import("@/pages/dashboard/homestay/components/UpdateHomestay")
);
const AdminAmenity = lazy(
  () => import("@/pages/dashboard/amenities/AmenityManagerPage")
);
const AdminRule = lazy(() => import("@/pages/dashboard/rules/RuleManagerPage"));
const AdminPropertyType = lazy(
  () => import("@/pages/dashboard/propertyType/PropertyTypeManagerPage")
);

// USER PROFILE
const UserProfile = lazy(() => import("@/pages/userProfile/UserProfilePage"));
const UserProfileEdit = lazy(
  () => import("@/pages/userProfile/UserProfileEditPage")
);
const UserProfileSettings = lazy(
  () => import("@/pages/userProfile/UserSettingsPage")
);
const UserWishlist = lazy(() => import("@/pages/userProfile/UserWishlistPage"));
const HomestayDetail = lazy(
  () => import("@/pages/dashboard/homestay/HomestayDetailForUser")
);

// Homestay
const HomestayUpdateRules = lazy(
  () => import("@/pages/dashboard/homestay/UpdateHomestayRules")
);
const HomestayUpdateAmenity = lazy(
  () => import("@/pages/dashboard/homestay/UpdateHomestayAmenities")
);
const HomestayUpdateImages = lazy(
  () => import("@/pages/dashboard/homestay/UpdateHomestayImages")
);
const HomestayUpdateAvaibleCalendar = lazy(
  () => import("@/pages/dashboard/homestay/UpdateAvailabilityCalendar")
);

// Booking
const CreateBookingPage = lazy(
  () => import("@/pages/booking/CreateBookingPage")
);
const MyBookingPage = lazy(
  () => import("@/pages/userProfile/booking/MyBookingsPage")
);
const BookingManagerPage = lazy(
  () => import("@/pages/dashboard/booking/AdminBookingManagementPage")
);
const PaymentResultPage = lazy(
  () => import("@/pages/payment/PaymentResultPage")
);

const MyBookingDetailPage = lazy(
  () => import("@/pages/userProfile/booking/MyBookingDetailPage")
);

const MyBookingEditPage = lazy(
  () => import("@/pages/userProfile/booking/UpdateMyBookingPage")
);

// Payment
const PaymentPage = lazy(() => import("@/pages/payment/PaymentPage"));
const PaymentCallback = lazy(() => import("@/pages/payment/PaymentCallback"));
const MyPayments = lazy(
  () => import("@/pages/userProfile/payment/MyPaymentManagementPage")
);

const MyPaymentDetail = lazy(
  () => import("@/pages/userProfile/payment/PaymentDetailPage")
);

const AdminBookingDetailPage = lazy(
  () => import("@/pages/dashboard/booking/AdminBookingDetailPage")
);

const AdminBookingUpdatePage = lazy(
  () => import("@/pages/dashboard/booking/AdminBookingEditPage")
);

const PaymentCallbackMomo = lazy(
  () => import("@/pages/payment/PaymentCallbackMomo")
);

// Payment Manager
const AdminPaymentPage = lazy(
  () => import("@/pages/dashboard/payment/AdminPaymentManagementPage")
);

// Review
const AdminReviewPage = lazy(
  () => import("@/pages/dashboard/reviews/AdminReviewManagementPage")
);

// Host

const HostRegistrationPage = lazy(
  () => import("@/pages/userProfile/host/HostRegistrationPage")
);

const CreateHostRegistrationPage = lazy(
  () => import("@/pages/userProfile/host/CreateHostRegistrationPage")
);

const ViewDetailHostRegistrationPage = lazy(
  () => import("@/pages/userProfile/host/ViewHostRegistrationPage")
);

const EditHostRegistration = lazy(
  () => import("@/pages/userProfile/host/EditHostRegistration")
);

const AdminHostManagerPage = lazy(
  () => import("@/pages/dashboard/host/HostManagementPage")
);

const AdminHostRegistrationDetail = lazy(
  () => import("@/pages/dashboard/host/ViewHostDetail")
);

const AdminCouponManagerPage = lazy(
  () => import("@/pages/dashboard/coupon/CouponManagerPage")
);

const AdminCreateUpdateCouponPage = lazy(
  () => import("@/pages/dashboard/coupon/CreateEditCouponPage")
);

const AdminPaymentDetailPage = lazy(
  () => import("@/pages/dashboard/payment/AdminPaymentDetailPage")
);

// Host
const HostProfilePage = lazy(() => import("@/pages/host/HostProfilePage"));
const HostEditPage = lazy(() => import("@/pages/host/EditHostProfilePage"));
const HostDashboardPage = lazy(() => import("@/pages/host/HostDashboardPage"));
const HostHomestayPage = lazy(
  () => import("@/pages/host/ManagerHomestayForHostPage")
);
const HostUpdateHomestayPage = lazy(
  () => import("@/pages/host/UpdateHomestayForHost")
);
const HostReviewManagerPage = lazy(
  () => import("@/pages/host/review/HostReviewManagementPage")
);
const HostBookingManagerPage = lazy(
  () => import("@/pages/host/booking/HostBookingManagementPage")
);
const HostPaymentManagerPage = lazy(
  () => import("@/pages/host/payment/HostPaymentManagementPage")
);

const HostDetailBookingPage = lazy(
  () => import("@/pages/host/booking/HostBookingDetailPage")
);

const HostDetailPaymentPage = lazy(
  () => import("@/pages/host/payment/HostPaymentDetailPage")
);

const HostCouponManagerPage = lazy(
  () => import("@/pages/host/coupon/HostCouponManagerPage")
);

const HostCreateAndUpdateCouponPage = lazy(
  () => import("@/pages/host/coupon/HostCreateAndUpdateCouponPage")
);

const BookingConfirmPage = lazy(
  () => import("@/pages/booking/BookingConfirmationPage")
);
// 🎯 Định nghĩa routes theo chuẩn React Router
const routes: RouteObject[] = [
  // 🌐 HOME & PUBLIC ROUTES
  {
    path: ROUTES.HOME,
    element: (
      <PublicRoute>
        <MainLayout />
      </PublicRoute>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: ROUTES.HOMESTAY_DETAIL,
        element: <HomestayDetail />,
      },
      {
        path: "/booking/:homestayId/book",
        element: <CreateBookingPage />,
      },
      {
        path: "/booking/:homestayId/payment-result",
        element: <PaymentResultPage />,
      },
      {
        path: "/payment/:bookingId",
        element: <PaymentPage />,
      },
      {
        path: "/payment-callback",
        element: <PaymentCallback />,
      },
      {
        path: "/booking-confirmation/:bookingId",
        element: <BookingConfirmPage />,
      },
      {
        path: "/momo-callback",
        element: <PaymentCallbackMomo />,
      },

      // INFO PAGES
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/contact",
        element: <ContactPage />,
      },
      {
        path: "/unauthorized",
        element: <UnauthorizedPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
  {
    path: ROUTES.HOMESTAY_LIST,
    element: (
      <PublicRoute>
        <MainLayout></MainLayout>
      </PublicRoute>
    ),
    children: [
      {
        index: true,
        element: <HomestayList />,
      },
    ],
  },

  // 👤 USER PROFILE ROUTES (Nested Layout)
  {
    path: ROUTES.USER_PROFILE,
    element: (
      <ProtectedRoute>
        <MainLayout>
          <UserProfileLayout />
        </MainLayout>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.USER_INFORMATION} replace />,
      },
      {
        path: "information",
        element: <UserProfile />,
      },
      {
        path: "edit",
        element: <UserProfileEdit />,
      },
      {
        path: "settings",
        element: <UserProfileSettings />,
      },
      {
        path: "wishlist",
        element: <UserWishlist />,
      },
      {
        path: "my-bookings",
        element: <MyBookingPage />,
      },
      {
        path: "my-bookings/:bookingId",
        element: <MyBookingDetailPage />,
      },
      {
        path: "my-bookings/:bookingId/edit",
        element: <MyBookingEditPage />,
      },
      {
        path: "my-payments",
        element: <MyPayments />,
      },
      {
        path: "my-payments/:paymentId",
        element: <MyPaymentDetail />,
      },
      {
        path: "host-registration",
        element: <HostRegistrationPage />,
      },
      {
        path: "host-registration/create",
        element: <CreateHostRegistrationPage />,
      },
      {
        path: "host-registration/:id/view",
        element: <ViewDetailHostRegistrationPage />,
      },
      {
        path: "host-registration/:id/edit",
        element: <EditHostRegistration />,
      },
    ],
  },

  // 🔐 AUTH ROUTES
  {
    path: ROUTES.AUTH,
    element: (
      <PublicRoute restricted>
        <AuthLayout />
      </PublicRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.AUTH_LOGIN} replace />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "email-verification-sent",
        element: <EmailVerification />,
      },
      {
        path: "verify-2fa",
        element: <VerificationOtp />,
      },
      {
        path: "confirm-email",
        element: <ConfirmEmail />,
      },
    ],
  },

  // 🔐 ADMIN LOGIN (Riêng biệt)
  {
    path: ROUTES.ADMIN_LOGIN,
    element: (
      <PublicRoute restricted>
        <AuthLayout>
          <AdminLogin />
        </AuthLayout>
      </PublicRoute>
    ),
  },

  // 🧑‍💼 ADMIN ROUTES
  {
    path: ROUTES.ADMIN,
    element: (
      <ProtectedRoute allowedRoles={["Admin"]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "users",
        element: <UserManager />,
      },
      {
        path: "homestays",
        element: <AdminHomestay />,
      },
      {
        path: "homestays/create",
        element: <AdminHomestayCreate />,
      },
      {
        path: "homestays/:id",
        element: <AdminDetailHomestay />,
      },
      {
        path: "homestays/:id/edit",
        element: <AdminUpdateHomestay />,
      },
      {
        path: "homestays/:id",
        children: [
          {
            path: "edit",
            element: <AdminUpdateHomestay />,
          },
          {
            path: "images",
            element: <HomestayUpdateImages />,
          },
          {
            path: "amenities",
            element: <HomestayUpdateAmenity />,
          },
          {
            path: "rules",
            element: <HomestayUpdateRules />,
          },
          {
            path: "availability-calendar",
            element: <HomestayUpdateAvaibleCalendar />,
          },
        ],
      },

      {
        path: "bookings",
        element: <BookingManagerPage />,
      },
      {
        path: "bookings/:bookingId",
        element: <AdminBookingDetailPage />,
      },
      {
        path: "bookings/:bookingId/edit",
        element: <AdminBookingUpdatePage />,
      },
      {
        path: "payments",
        element: <AdminPaymentPage />,
      },
      {
        path: "payments/:paymentId",
        element: <AdminPaymentDetailPage />,
      },
      {
        path: "reviews",
        element: <AdminReviewPage />,
      },

      {
        path: "amenities",
        element: <AdminAmenity />,
      },
      {
        path: "rules",
        element: <AdminRule />,
      },
      {
        path: "property-types",
        element: <AdminPropertyType />,
      },
      {
        path: "hosts",
        element: <AdminHostManagerPage />,
      },
      {
        path: "hosts/:id/view",
        element: <AdminHostRegistrationDetail />,
      },
      {
        path: "coupons",
        element: <AdminCouponManagerPage />,
      },
      {
        path: "coupons/:id/edit",
        element: <AdminCreateUpdateCouponPage />,
      },
      {
        path: "coupons/create",
        element: <AdminCreateUpdateCouponPage />,
      },
    ],
  },

  // HOST
  {
    path: ROUTES.HOST,
    element: (
      <ProtectedRoute allowedRoles={["Host"]}>
        <HostDashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.HOST_DASHBOARD} replace />,
      },
      {
        path: "dashboard",
        element: <HostDashboardPage />,
      },
      {
        path: "profile",
        element: <HostProfilePage />,
      },
      {
        path: "profile/edit",
        element: <HostEditPage />,
      },
      {
        path: "homestays",
        element: <HostHomestayPage />,
      },
      {
        path: "homestays/create",
        element: <AdminHomestayCreate />,
      },
      {
        path: "homestays/:id",
        element: <AdminDetailHomestay />,
      },
      {
        path: "homestays/:id/edit",
        element: <HostUpdateHomestayPage />,
      },
      {
        path: "homestays/:id",
        children: [
          {
            path: "edit",
            element: <HostUpdateHomestayPage />,
          },
          {
            path: "images",
            element: <HomestayUpdateImages />,
          },
          {
            path: "amenities",
            element: <HomestayUpdateAmenity />,
          },
          {
            path: "rules",
            element: <HomestayUpdateRules />,
          },
          {
            path: "availability-calendar",
            element: <HomestayUpdateAvaibleCalendar />,
          },
        ],
      },

      {
        path: "bookings",
        element: <HostBookingManagerPage />,
      },
      {
        path: "bookings/:bookingId",
        element: <HostDetailBookingPage />,
      },
      {
        path: "payments",
        element: <HostPaymentManagerPage />,
      },
      {
        path: "payments/:paymentId",
        element: <HostDetailPaymentPage />,
      },

      {
        path: "reviews",
        element: <HostReviewManagerPage />,
      },
      {
        path: "coupons",
        element: <HostCouponManagerPage />,
      },
      {
        path: "coupons/:id/edit",
        element: <HostCreateAndUpdateCouponPage />,
      },
      {
        path: "coupons/create",
        element: <HostCreateAndUpdateCouponPage />,
      },
    ],
  },
];

export default routes;
