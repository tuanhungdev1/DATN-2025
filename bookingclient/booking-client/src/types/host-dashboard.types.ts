// types/host-dashboard.types.ts

// ============= Host Overview Types =============
export interface HostDashboardOverview {
  totalHomestays: number;
  activeHomestays: number;
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  totalReviews: number;
  revenueGrowth: number;
  monthlyRevenue: number;
}

// ============= Host Revenue Statistics Types =============
export interface HostRevenueStatistics {
  totalRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  averageBookingValue: number;
  revenueBreakdown: HostRevenueBreakdown;
  monthlyRevenueData: MonthlyHostRevenue[];
}

export interface HostRevenueBreakdown {
  baseRevenue: number;
  cleaningFees: number;
  serviceFees: number;
  taxAmount: number;
}

export interface MonthlyHostRevenue {
  month: string;
  revenue: number;
  bookingCount: number;
  guestCount: number;
}

// ============= Host Booking Statistics Types =============
export interface HostBookingStatistics {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  cancellationRate: number;
  occupancyRate: number;
  statusBreakdown: HostBookingStatus;
  monthlyTrends: MonthlyBookingTrend[];
}

export interface HostBookingStatus {
  pending: number;
  confirmed: number;
  checkedIn: number;
  completed: number;
  cancelled: number;
  rejected: number;
}

export interface MonthlyBookingTrend {
  month: string;
  totalBookings: number;
  completed: number;
  cancelled: number;
  pending: number;
}

// ============= Host Review Statistics Types =============
export interface HostReviewStatistics {
  averageRating: number;
  totalReviews: number;
  averageCleanlinessRating: number;
  averageAccuracyRating: number;
  averageCommunicationRating: number;
  averageLocationRating: number;
  averageValueRating: number;
  ratingDistribution: HostRatingDistribution;
  recentReviews: HostRecentReview[];
}

export interface HostRatingDistribution {
  fiveStar: number;
  fourStar: number;
  threeStar: number;
  twoStar: number;
  oneStar: number;
}

export interface HostRecentReview {
  reviewId: number;
  guestName: string;
  homestayTitle: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

// ============= Host Performance Types =============
export interface HostPerformance {
  homestayPerformance: HomestayPerformance[];
  topGuests: TopGuest[];
  upcomingBookings: UpcomingBooking[];
}

export interface HomestayPerformance {
  homestayId: number;
  homestayTitle: string;
  bookingCount: number;
  revenue: number;
  averageRating: number;
  reviewCount: number;
  occupancyRate: number;
  viewCount: number;
}

export interface TopGuest {
  guestId: number;
  guestName: string;
  email: string;
  totalBookings: number;
  totalSpent: number;
  lastBookingDate: string;
}

export interface UpcomingBooking {
  bookingId: number;
  homestayTitle: string;
  guestName: string;
  checkInDate: string;
  checkOutDate: string;
  status: string;
  totalAmount: number;
}

// ============= Complete Host Dashboard Type =============
export interface CompleteHostDashboard {
  overview: HostDashboardOverview;
  revenue: HostRevenueStatistics;
  bookings: HostBookingStatistics;
  reviews: HostReviewStatistics;
  performance: HostPerformance;
  generatedAt: string;
}
