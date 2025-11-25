export interface PropertyType {
  id: number;
  typeName: string;
  description?: string | null;
  iconUrl?: string | null;
  isActive: boolean;
  displayOrder: number;
  createdAt: string; // ISO date string
  updatedAt?: string | null;
  isDeleted: boolean;
  deletedAt?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
}
export interface PropertyTypeFilter {
  search?: string | null;
  isActive?: boolean | null;
  sortBy?: string; // default: "createdAt"
  sortOrder?: "asc" | "desc"; // default: "asc"
  pageNumber?: number;
  pageSize?: number;
}

export interface CreatePropertyType {
  typeName: string;
  description?: string | null;
  iconFile?: File | null;
  isActive: boolean;
  displayOrder: number;
}

export interface UpdatePropertyType {
  typeName?: string | null;
  description?: string | null;
  iconFile?: File | null;
  imageAction?: "Keep" | "Update" | "Remove";
  isActive?: boolean | null;
  displayOrder?: number | null;
}
