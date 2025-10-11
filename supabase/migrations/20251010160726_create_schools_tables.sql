/*
  # Create Driving Schools Database Schema

  ## Overview
  Creates comprehensive database schema for Dubai driving school comparison platform with schools, license categories, and reviews.

  ## New Tables

  ### `schools`
  Main table storing driving school information:
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - School name
  - `slug` (text, unique) - URL-friendly identifier
  - `rating` (decimal) - Average rating (0-5)
  - `review_count` (integer) - Total number of reviews
  - `location_area` (text) - Dubai area/district
  - `address` (text) - Full street address
  - `coordinates` (jsonb) - Latitude and longitude for maps
  - `image_url` (text) - Main school image
  - `logo_url` (text, nullable) - School logo
  - `description` (text) - Detailed school description
  - `phone` (text) - Contact phone number
  - `email` (text) - Contact email
  - `website` (text, nullable) - School website URL
  - `operating_hours` (text) - Business hours
  - `established_year` (integer, nullable) - Year founded
  - `created_at` (timestamptz) - Record creation timestamp

  ### `license_categories`
  License types and pricing offered by each school:
  - `id` (uuid, primary key) - Unique identifier
  - `school_id` (uuid, foreign key) - References schools table
  - `type` (text) - License type (motorcycle, light_vehicle, etc.)
  - `name` (text) - Display name for license category
  - `price` (decimal) - Course price in AED
  - `duration` (text) - Course duration description
  - `description` (text) - Course details
  - `features` (jsonb) - Array of course features/inclusions
  - `created_at` (timestamptz) - Record creation timestamp

  ### `reviews`
  Customer reviews for schools:
  - `id` (uuid, primary key) - Unique identifier
  - `school_id` (uuid, foreign key) - References schools table
  - `author_name` (text) - Reviewer name
  - `rating` (integer) - Rating (1-5)
  - `comment` (text) - Review text
  - `date` (date) - Review date
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Enable Row Level Security on all tables
  - Add read-only policies for public access (no authentication required)
  - Restrict write operations (for future admin functionality)

  ## Indexes
  - Index on school slug for fast lookups
  - Index on location_area for filtering
  - Index on license_category type for filtering
  - Index on school rating for sorting
*/

-- Create schools table
CREATE TABLE IF NOT EXISTS schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  rating decimal(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  review_count integer DEFAULT 0,
  location_area text NOT NULL,
  address text NOT NULL,
  coordinates jsonb,
  image_url text NOT NULL,
  logo_url text,
  description text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  website text,
  operating_hours text NOT NULL,
  established_year integer,
  created_at timestamptz DEFAULT now()
);

-- Create license_categories table
CREATE TABLE IF NOT EXISTS license_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('motorcycle', 'light_vehicle', 'heavy_truck', 'bus', 'taxi')),
  name text NOT NULL,
  price decimal(10,2) NOT NULL,
  duration text NOT NULL,
  description text NOT NULL,
  features jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_schools_slug ON schools(slug);
CREATE INDEX IF NOT EXISTS idx_schools_location_area ON schools(location_area);
CREATE INDEX IF NOT EXISTS idx_schools_rating ON schools(rating DESC);
CREATE INDEX IF NOT EXISTS idx_license_categories_school_id ON license_categories(school_id);
CREATE INDEX IF NOT EXISTS idx_license_categories_type ON license_categories(type);
CREATE INDEX IF NOT EXISTS idx_reviews_school_id ON reviews(school_id);

-- Enable Row Level Security
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE license_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to schools"
  ON schools FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public read access to license categories"
  ON license_categories FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public read access to reviews"
  ON reviews FOR SELECT
  TO anon
  USING (true);
