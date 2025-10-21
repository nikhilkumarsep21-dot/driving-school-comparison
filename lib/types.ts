export type CategoryType = 'motorcycle' | 'light_motor_vehicle' | 'heavy_truck' | 'light_bus' | 'heavy_bus' | 'light_forklift' | 'heavy_forklift';

export interface School {
  id: number;
  name: string;
  website?: string;
  contact?: string;
  logo_url?: string;
  rating: number;
  review_count: number;
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

export interface Detail {
  id: string;
  school_id: number;
  category_id: number;
  documents_required?: any;
  course_details?: any;
  lecture_details?: any;
  fees?: any;
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
  sortBy?: 'recommended' | 'rating' | 'price_low' | 'price_high' | 'newest';
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
