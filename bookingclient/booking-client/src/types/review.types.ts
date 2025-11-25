export interface CreateReview {
  overallRating: number;
  cleanlinessRating: number;
  locationRating: number;
  valueForMoneyRating: number;
  communicationRating: number;
  checkInRating: number;
  reviewComment?: string | null;
  isRecommended?: boolean;
  bookingId: number;
}

export interface UpdateReview {
  overallRating?: number;
  cleanlinessRating?: number;
  locationRating?: number;
  valueForMoneyRating?: number;
  communicationRating?: number;
  checkInRating?: number;
  reviewComment?: string | null;
  isRecommended?: boolean;
}

export interface HostResponse {
  hostResponse: string;
}

export interface HelpfulToggleResult {
  isNowHelpful: boolean;
  helpfulCount: number;
}

export interface Review {
  id: number;
  overallRating: number;
  cleanlinessRating: number;
  locationRating: number;
  valueForMoneyRating: number;
  communicationRating: number;
  checkInRating: number;
  reviewComment?: string | null;
  isVisible: boolean;
  isRecommended: boolean;
  helpfulCount: number;
  hostResponse?: string | null;
  hostRespondedAt?: string | null; // ISO string
  reviewerId: number;
  reviewerName: string;
  reviewerAvatar?: string | null;
  revieweeId: number;
  revieweeName: string;
  bookingId: number;
  homestayId: number;
  homestayTitle: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface ReviewFilter {
  searchTerm?: string;
  homestayId?: number;
  reviewerId?: number;
  revieweeId?: number;
  bookingId?: number;
  minOverallRating?: number;
  maxOverallRating?: number;
  isVisible?: boolean;
  isRecommended?: boolean;
  hasHostResponse?: boolean;
  createdFrom?: string; // ISO string
  createdTo?: string; // ISO string
  sortBy?: "CreatedAt" | "Date" | "Rating" | "Helpful";
  sortDirection?: "asc" | "desc";
  pageNumber?: number;
  pageSize?: number;
}

// src/types/reviewStatistics.ts

export interface UserReviewStatistics {
  totalReviewsWritten: number;
  totalReviewsReceived: number;
  averageRatingReceived: number;
  recommendedCount: number;
  recommendationPercentage: number;
}

export interface HomestayReviewStatistics {
  totalReviews: number;
  averageOverallRating: number;
  averageCleanlinessRating: number;
  averageLocationRating: number;
  averageValueForMoneyRating: number;
  averageCommunicationRating: number;
  averageCheckInRating: number;
  recommendedCount: number;
  recommendationPercentage: number;
  ratingDistribution: Record<number, number>;
}
