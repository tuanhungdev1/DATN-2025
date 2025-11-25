export interface Amenity {
  id: number;
  amenityName: string;
  amenityDescription?: string;
  iconUrl?: string;
  category: string;
  usageCount: number;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateAmenity {
  amenityName: string;
  amenityDescription?: string;
  category: string;
  isActive?: boolean;
  displayOrder?: number;
  iconFile?: File;
}

export interface UpdateAmenity {
  amenityName?: string;
  amenityDescription?: string;
  category?: string;
  isActive?: boolean;
  displayOrder?: number;
  iconFile?: File;
  imageAction?: "Keep" | "Update" | "Remove";
}

export interface AmenityFilter {
  search?: string;
  category?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  pageNumber?: number;
  pageSize?: number;
}
