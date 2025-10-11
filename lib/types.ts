export type LicenseType = 'motorcycle' | 'light_vehicle' | 'heavy_truck' | 'bus' | 'taxi';

export interface LicenseCategory {
  id: string;
  school_id: string;
  type: LicenseType;
  name: string;
  price: number;
  duration: string;
  description: string;
  features?: string[];
  created_at?: string;
}

export interface School {
  id: string;
  name: string;
  slug: string;
  rating: number;
  review_count: number;
  location_area: string;
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  image_url: string;
  logo_url?: string;
  description: string;
  phone: string;
  email: string;
  website?: string;
  operating_hours: string;
  established_year?: number;
  license_categories?: LicenseCategory[];
  created_at?: string;
}

export interface Review {
  id: string;
  school_id: string;
  author_name: string;
  rating: number;
  comment: string;
  date: string;
  created_at?: string;
}

export interface FilterOptions {
  search?: string;
  categories?: LicenseType[];
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
