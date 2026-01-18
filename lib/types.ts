export interface School {
  id: string;
  name: string;
  website?: string;
  phone?: string;
  email?: string;
  logo_url?: string;
  rating: number;
  review_count: number;
  created_at?: string;
}

export interface BranchLocation {
  id: string;
  school_id: string;
  name: string;
  address: string;
  city: string;
  contact?: string;
  email?: string;
  normal_hours?: string;
  directions_url?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  created_at?: string;
}

export interface LicenseType {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
}

export interface CourseLevel {
  id: string;
  school_id: string;
  license_type_id: string;
  name: string;
  duration_hours?: number;
  description?: string;
  created_at?: string;
}

export interface Shift {
  id: string;
  course_level_id: string;
  type: string;
  description?: string;
  created_at?: string;
}

export interface Package {
  id: string;
  shift_id: string;
  name: string;
  fee_aed: number;
  details?: PackageDetails;
  created_at?: string;
}

export interface PackageDetails {
  documents_required?: string[];
  course_details?: Record<string, any>;
  lecture_details?: Record<string, any>;
  fee_breakdown?: Record<string, any>;
  notes?: string;
  [key: string]: any;
}

export interface SchoolWithLocations extends School {
  branch_locations?: BranchLocation[];
}

export interface CourseLevelWithRelations extends CourseLevel {
  license_type?: LicenseType;
  school?: School;
  shifts?: ShiftWithPackages[];
}

export interface ShiftWithPackages extends Shift {
  packages?: Package[];
}

export interface SchoolWithCourses extends School {
  branch_locations?: BranchLocation[];
  course_levels?: CourseLevelWithRelations[];
}

export interface FilterOptions {
  search?: string;
  licenseTypes?: string[];
  locations?: string[];
  experienceLevels?: string[];
  packageTypes?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: "recommended" | "rating" | "price_low" | "price_high" | "newest";
}

export interface PriceRange {
  min: number;
  max: number;
  average: number;
}

export interface UserDetails {
  name: string;
  email: string;
  phone: string;
  currentVehicleType?: string;
}

export type CategoryType =
  | "motorcycle"
  | "light_motor_vehicle"
  | "heavy_truck"
  | "light_bus"
  | "heavy_bus"
  | "light_forklift"
  | "heavy_forklift";
