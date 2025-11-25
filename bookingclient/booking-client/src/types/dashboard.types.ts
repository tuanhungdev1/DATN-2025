// types/dashboard.types.ts

// ============= Overview Types =============
export interface DashboardOverview {
  totalUsers: number;
  totalHosts: number;
  totalHomestays: number;
  activeHomestays: number;
  monthlyGrowthRate: number;
  userGrowth: GrowthTrend;
  hostGrowth: GrowthTrend;
  homestayGrowth: GrowthTrend;
}

export interface ExportParams {
  format?: "excel" | "pdf" | "csv";
  months?: number;
}

export interface GrowthTrend {
  currentMonth: number;
  previousMonth: number;
  growthPercentage: number;
  monthlyData: MonthlyDataPoint[];
}

export interface MonthlyDataPoint {
  month: string;
  value: number;
}

// ============= User Statistics Types =============
export interface UserStatistics {
  dailyActiveUsers: number;
  monthlyActiveUsers: number;
  activeHosts: number;
  userToHostConversionRate: number;
  usersByRegion: UserByRegion[];
  dailyActivity: DailyActivity[];
  monthlyActivity: DailyActivity[];
}

export interface UserByRegion {
  region: string;
  userCount: number;
  hostCount: number;
  percentage: number;
}

export interface DailyActivity {
  date: string;
  activeUsers: number;
  newUsers: number;
}

// ============= Booking Statistics Types =============
export interface BookingStatistics {
  totalBookings: number;
  completedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  occupancyRate: number;
  newHomestaysThisMonth: number;
  statusBreakdown: BookingStatusBreakdown;
  topHomestays: TopHomestay[];
  monthlyBookings: MonthlyBooking[];
}

export interface BookingStatusBreakdown {
  pending: number;
  confirmed: number;
  checkedIn: number;
  completed: number;
  cancelled: number;
  rejected: number;
}

export interface TopHomestay {
  homestayId: number;
  homestayTitle: string;
  city: string;
  bookingCount: number;
  averageRating: number;
  totalRevenue: number;
}

export interface MonthlyBooking {
  month: string;
  totalBookings: number;
  completed: number;
  cancelled: number;
}

// ============= Revenue Statistics Types =============
export interface RevenueStatistics {
  totalRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  averageRevenuePerBooking: number;
  refundAmount: number;
  refundRate: number;
  monthlyRevenueData: MonthlyRevenue[];
  revenueBreakdown: RevenueBreakdown;
  paymentMethodStats: PaymentMethodStats[];
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  bookingCount: number;
  averagePerBooking: number;
}

export interface RevenueBreakdown {
  baseAmount: number;
  serviceFee: number;
  cleaningFee: number;
  taxAmount: number;
}

export interface PaymentMethodStats {
  paymentMethod: string;
  totalAmount: number;
  count: number;
  percentage: number;
}

// ============= Review Statistics Types =============
export interface ReviewStatistics {
  averageRating: number;
  totalReviews: number;
  newReviewsThisMonth: number;
  complaintCount: number;
  ratingDistribution: RatingDistribution;
  topRatedHomestays: TopRatedHomestay[];
  lowRatedHomestays: LowRatedHomestay[];
  recentReviews: RecentReview[];
}

export interface RatingDistribution {
  fiveStar: number;
  fourStar: number;
  threeStar: number;
  twoStar: number;
  oneStar: number;
}

export interface TopRatedHomestay {
  homestayId: number;
  homestayTitle: string;
  hostName: string;
  averageRating: number;
  reviewCount: number;
}

export interface LowRatedHomestay {
  homestayId: number;
  homestayTitle: string;
  hostName: string;
  averageRating: number;
  reviewCount: number;
  mostCommonComplaint?: string;
}

export interface RecentReview {
  reviewId: number;
  guestName: string;
  homestayTitle: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

// ============= Complete Dashboard Type =============
export interface CompleteDashboard {
  overview: DashboardOverview;
  userStatistics: UserStatistics;
  bookingStatistics: BookingStatistics;
  revenueStatistics: RevenueStatistics;
  reviewStatistics: ReviewStatistics;
  generatedAt: string;
}

// ============= Dashboard Filter Types =============
export interface DashboardFilter {
  months?: number;
  startDate?: string;
  endDate?: string;
}
