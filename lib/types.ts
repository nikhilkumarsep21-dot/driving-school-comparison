export type CategoryType =
  | "motorcycle"
  | "light_motor_vehicle"
  | "heavy_truck"
  | "light_bus"
  | "heavy_bus"
  | "light_forklift"
  | "heavy_forklift";

export interface School {
  id: number;
  name: string;
  website?: string;
  contact?: string;
  phone?: string;
  email?: string;
  address?: string;
  location_area?: string;
  description?: string;
  established_year?: number;
  operating_hours?: string;
  logo_url?: string;
  rating: number;
  review_count: number;
  license_categories?: any[];
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Branch {
  id: number;
  school_id: number;
  name: string;
  address: string;
  city?: string;
  contact?: string;
  email?: string;
  normal_hours?: string;
  directions_url?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  created_at?: string;
  updated_at?: string;
}

export interface BranchWithSchool extends Branch {
  school: School;
}

export interface RTAFeeItem {
  type: string;
  amount: number;
}

export interface SimpleCourseFee {
  hours?: number;
  duration?: string;
  normal_fee?: string;
  sunday_fee?: string;
  shift_fee?: string;
  eligibility?: string;
  notes?: string;
  [key: string]: any;
}

export interface NestedCourseFee {
  category?: string;
  min_age?: number;
  internal_training?: string;
  road_training?: string;
  total_hours?: number;
  regular_course_fees?: {
    hourly?: number;
    total: number | number[];
  };
  sunday_night_shift_fees?: {
    hourly?: number;
    total: number | number[];
  };
  notes?: string;
  [key: string]: any;
}

export interface RTAStyleCourseFee {
  category?: string;
  rta_fees?: RTAFeeItem[];
  training_rates?: Record<string, number>;
  notes?: string;
  [key: string]: any;
}

export type CourseFee = SimpleCourseFee | NestedCourseFee | RTAStyleCourseFee;

export interface OtherFee {
  type: string;
  [key: string]: number | string | null;
}

export interface Fees {
  timings?: Record<string, string>;
  course_fees?: CourseFee[];
  other_fees?: OtherFee[];
  notes?: string;
}

export interface Detail {
  id: string;
  school_id: number;
  category_id: number;
  documents_required?: any;
  course_details?: any;
  lecture_details?: any;
  fees?: Fees;
  created_at?: string;
  updated_at?: string;
}

export interface BranchWithDetails extends BranchWithSchool {
  categories?: Category[];
  details?: Detail[];
}

export interface FilterOptions {
  search?: string;
  categories?: number[];
  locations?: string[];
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
}
