/* eslint-disable @typescript-eslint/no-empty-object-type */

export interface Homestay {
  id: number;
  homestayTitle: string;
  homestayDescription?: string;
  slug?: string;

  fullAddress: string;
  city: string;
  province: string;
  country: string;
  postalCode?: string;
  latitude: number;
  longitude: number;

  areaInSquareMeters?: number; // Diện tích
  numberOfFloors?: number; // Số tầng
  numberOfRooms: number; // Tổng số phòng
  numberOfBedrooms: number;
  numberOfBathrooms: number;
  numberOfBeds: number;
  availableRooms: number;
  isFreeCancellation: boolean;
  freeCancellationDays?: number;
  isPrepaymentRequired: boolean;
  roomsAtThisPrice: number;
  maximumGuests: number;
  maximumChildren: number;

  baseNightlyPrice: number;
  weekendPrice?: number;
  weeklyDiscount?: number;
  monthlyDiscount?: number;

  minimumNights: number;
  maximumNights: number;
  checkInTime: string; // e.g. "15:00:00"
  checkOutTime: string; // e.g. "11:00:00"
  isInstantBook: boolean;

  isActive: boolean;
  isApproved: boolean;
  isFeatured: boolean;
  approvalNote?: string;
  rejectionReason?: string;
  approvedAt?: string;
  approvedBy?: string;

  searchKeywords?: string;
  viewCount: number;
  ratingAverage: number;
  totalReviews: number;
  bookingCount: number;

  hasParking: boolean;
  isPetFriendly: boolean;
  hasPrivatePool: boolean;

  ownerId: number;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  ownerAvatar?: string;

  propertyTypeId: number;
  propertyTypeName: string;
  propertyTypeIcon?: string;

  mainImageUrl?: string;
  images: HomestayImage[];

  amenities: AmenitySimple[];
  rules: RuleSimple[];

  availabilityCalendars: AvailabilityCalendar[];

  createdAt: string;
  updatedAt?: string;
}

export interface HomestayImage {
  id: number;
  imageUrl: string;
  imageTitle?: string;
  imageDescription?: string;
  displayOrder: number;
  isPrimaryImage: boolean;
  roomType?: string;
  homestayId: number;
  createdAt: string;
  updatedAt?: string;
}

export interface AmenitySimple {
  id: number;
  amenityName: string;
  amenityDescription?: string;
  iconUrl?: string;
  category: string;
  displayOrder: number;
  // Thông tin từ bảng trung gian (nếu cần)
  customNote?: string;
  isHighlight?: boolean;
}

export interface RuleSimple {
  id: number;
  ruleName: string;
  ruleDescription?: string;
  iconUrl?: string;
  ruleType: string;
  displayOrder: number;
  // Thông tin từ bảng trung gian (nếu cần)
  customNote?: string;
}

export interface AvailabilityCalendar {
  id: number;
  availableDate: string;
  isAvailable: boolean;
  customPrice?: number;
  minimumNights?: number;
  isBlocked: boolean;
  blockReason?: string;
  homestayId: number;
  homestayTitle: string;
  baseNightlyPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHomestay {
  homestayTitle: string;
  homestayDescription?: string;
  slug?: string;

  fullAddress: string;
  city: string;
  province: string;
  country: string;
  postalCode?: string;
  latitude: number;
  longitude: number;

  areaInSquareMeters?: number; // Diện tích
  numberOfFloors?: number; // Số tầng
  numberOfRooms: number; // Tổng số phòng
  numberOfBedrooms: number;
  numberOfBathrooms: number;
  numberOfBeds: number;

  availableRooms: number;
  isFreeCancellation: boolean;
  freeCancellationDays?: number;
  isPrepaymentRequired: boolean;
  roomsAtThisPrice: number;

  maximumGuests: number;
  maximumChildren: number;

  baseNightlyPrice: number;
  weekendPrice?: number;
  weeklyDiscount?: number;
  monthlyDiscount?: number;

  minimumNights: number;
  maximumNights: number;
  checkInTime: string; // ISO time string (e.g. "15:00:00")
  checkOutTime: string; // ISO time string (e.g. "11:00:00")
  isInstantBook: boolean;

  hasParking: boolean;
  isPetFriendly: boolean;
  hasPrivatePool: boolean;

  ownerId: number;
  propertyTypeId: number;

  searchKeywords?: string;

  images: CreateHomestayImage[];
  amenities: CreateHomestayAmenity[];
  rules: CreateHomestayRule[];
  availabilityCalendars: CreateAvailabilityCalendar[];
}

export interface UpdateHomestay extends Partial<CreateHomestay> {}

export interface CreateHomestayImage {
  imageFile: File;
  imageTitle?: string;
  imageDescription?: string;
  displayOrder?: number;
  isPrimaryImage?: boolean;
  roomType?: string;
}

export interface CreateHomestayAmenity {
  amenityId: number;
  customNote?: string;
}

export interface CreateHomestayRule {
  ruleId: number;
  customNote?: string;
}

export interface ApproveHomestay {
  isApproved: boolean;
  approvalNote?: string;
  autoActivate: true;
}

export interface HomestayFilter {
  search?: string;
  city?: string;
  country?: string;
  type?: string;
  isActive?: boolean;
  province?: string;
  isApproved?: boolean;
  isFeatured?: boolean;
  isInstantBook?: boolean;
  minPrice?: number;
  maxPrice?: number;
  hasWeekendPrice?: boolean;
  hasWeeklyDiscount?: boolean;
  hasMonthlyDiscount?: boolean;
  minGuests?: number;
  minChildren?: number;
  minBedrooms?: number;
  minBathrooms?: number;
  minBeds?: number;
  minRooms?: number;
  latitude?: number;
  longitude?: number;
  radiusInKm?: number;
  hasParking?: boolean;
  isPetFriendly?: boolean;
  hasPrivatePool?: boolean;
  ownerId?: number;
  propertyTypeId?: number;
  checkInDate?: string;
  checkOutDate?: string;
  amenityIds?: number[];
  createdFrom?: string;
  createdTo?: string;
  approvedFrom?: string;
  approvedTo?: string;
  propertyTypeIds?: number[];
  adults?: number;
  children?: number;
  rooms?: number;
  pets?: boolean;
  minRating?: number;

  /** Sort fields allowed on backend */
  sortBy?:
    | "name"
    | "title"
    | "price"
    | "guests"
    | "rating"
    | "reviews"
    | "bookings"
    | "views"
    | "createdAt"
    | "created"
    | "updatedAt"
    | "updated"
    | "approvedAt"
    | "approved"
    | "featured"
    | "area"
    | "popular"
    | "newest"
    | "latest"
    | "oldest";

  sortDirection?: "asc" | "desc";
  pageNumber?: number;
  pageSize?: number;
}

export interface CreateAvailabilityCalendar {
  homestayId: number;

  availableDate: string;

  isAvailable?: boolean;

  customPrice?: number | null;

  minimumNights?: number | null;

  isBlocked?: boolean;

  blockReason?: string | null;
}

export interface UpdateExistingAvailabilityCalendar {
  calendarId: number;
  availableDate?: string; // Chuyển DateOnly thành string
  isAvailable?: boolean;
  customPrice?: number;
  minimumNights?: number;
  isBlocked?: boolean;
  blockReason?: string;
}

export interface UpdateHomestayAvailabilityCalendars {
  newCalendars?: CreateAvailabilityCalendar[];
  updateCalendars?: UpdateExistingAvailabilityCalendar[];
  deleteCalendarIds?: number[];
}

export interface ImageMetadata {
  imageId: number;
  imageTitle?: string;
  imageDescription?: string;
  displayOrder?: number;
  isPrimaryImage?: boolean;
  roomType?: string;
}

export interface UpdateHomestayImages {
  keepImageIds: number[];
  newImages: CreateHomestayImage[];
  updateExistingImages?: ImageMetadata[];
}

export interface CreateHomestayAmenity {
  amenityId: number;
  customNote?: string;
}

export interface UpdateHomestayAmenity {
  amenityId: number;
  customNote?: string;
}

export interface UpdateHomestayAmenities {
  keepAmenityIds: number[];
  newAmenities: CreateHomestayAmenity[];
  updateExistingAmenities: UpdateHomestayAmenity[];
}
