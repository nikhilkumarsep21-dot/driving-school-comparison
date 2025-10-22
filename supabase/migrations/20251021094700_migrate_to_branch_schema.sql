/*
  # Migrate to Branch-Centric Schema

  ## Overview
  Complete schema migration from school-centric to branch-centric architecture.
  This migration drops all existing tables and creates new normalized structure.

  ## Changes Made

  ### 1. Drop Existing Tables
  - Drop reviews table
  - Drop license_categories table
  - Drop schools table
  - Drop user_inquiries table (if exists)

  ### 2. New Tables Created

  #### `schools`
  Main driving school brands (5 schools):
  - `id` (integer, primary key) - School ID from CSV
  - `name` (text) - School brand name
  - `website` (text) - School website URL
  - `contact` (text) - General contact email
  - `logo_url` (text, nullable) - School logo image
  - `rating` (decimal) - School reputation rating (0-5)
  - `review_count` (integer) - Total reviews count
  - `created_at` (timestamptz) - Record creation
  - `updated_at` (timestamptz) - Record update

  #### `branches`
  Physical branch locations (170 branches):
  - `id` (integer, primary key) - Branch ID from CSV
  - `school_id` (integer, foreign key) - Parent school
  - `name` (text) - Branch name/location
  - `address` (text) - Full street address
  - `city` (text) - City/area name
  - `contact` (text) - Branch phone number
  - `email` (text) - Branch email
  - `normal_hours` (text) - Operating hours
  - `directions_url` (text) - Google Maps link
  - `coordinates` (jsonb, nullable) - {lat, lng}
  - `created_at` (timestamptz) - Record creation
  - `updated_at` (timestamptz) - Record update

  #### `categories`
  License types lookup table (7 categories):
  - `id` (integer, primary key) - Category ID from CSV
  - `name` (text) - Category name
  - `description` (text, nullable) - Category description
  - `created_at` (timestamptz) - Record creation
  - `updated_at` (timestamptz) - Record update

  #### `details`
  Course details per school-category combination:
  - `id` (uuid, primary key) - Unique identifier
  - `school_id` (integer, foreign key) - References schools
  - `category_id` (integer, foreign key) - References categories
  - `documents_required` (jsonb) - Required documents list
  - `course_details` (jsonb) - Course information
  - `lecture_details` (jsonb) - Lecture information
  - `fees` (jsonb) - Fee structures (flexible format)
  - `created_at` (timestamptz) - Record creation
  - `updated_at` (timestamptz) - Record update

  ### 3. Security
  - Enable RLS on all tables
  - Add public read-only policies for anonymous users
  - Restrict write operations

  ### 4. Indexes
  - Index on branches.school_id for fast joins
  - Index on branches.city for location filtering
  - Index on details.school_id for course lookups
  - Index on details.category_id for category filtering

  ## Important Notes
  - This is a destructive migration - all existing data will be lost
  - CSV data must be imported after migration using Supabase dashboard or SQL
  - Details table will be populated separately with course/fee information
*/

-- Drop existing tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS license_categories CASCADE;
DROP TABLE IF EXISTS schools CASCADE;
DROP TABLE IF EXISTS user_inquiries CASCADE;

-- Create schools table
CREATE TABLE IF NOT EXISTS schools (
  id integer PRIMARY KEY,
  name text NOT NULL,
  website text,
  contact text,
  logo_url text,
  rating decimal(3,2) DEFAULT 4.2 CHECK (rating >= 0 AND rating <= 5),
  review_count integer DEFAULT 150,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id integer PRIMARY KEY,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create branches table
CREATE TABLE IF NOT EXISTS branches (
  id integer PRIMARY KEY,
  school_id integer NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name text NOT NULL,
  address text NOT NULL,
  city text,
  contact text,
  email text,
  normal_hours text,
  directions_url text,
  coordinates jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create details table
CREATE TABLE IF NOT EXISTS details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id integer NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  category_id integer NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  documents_required jsonb,
  course_details jsonb,
  lecture_details jsonb,
  fees jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(school_id, category_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_branches_school_id ON branches(school_id);
CREATE INDEX IF NOT EXISTS idx_branches_city ON branches(city);
CREATE INDEX IF NOT EXISTS idx_details_school_id ON details(school_id);
CREATE INDEX IF NOT EXISTS idx_details_category_id ON details(category_id);

-- Enable Row Level Security
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE details ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to schools"
  ON schools FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read access to categories"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read access to branches"
  ON branches FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read access to details"
  ON details FOR SELECT
  TO anon, authenticated
  USING (true);

-- Insert schools data
INSERT INTO schools (id, name, website, contact, rating, review_count) VALUES
(1, 'Emirates Driving Institute (EDI)', 'https://edi-uae.com', 'info@edi.ae', 4.5, 280),
(2, 'Belhasa Driving Center (BDC)', 'https://www.bdc.ae/', 'customercare@bdc.ae', 4.3, 420),
(3, 'Galadari Motor Driving Centre (GMDC)', 'https://www.gmdc.ae/', 'info@gmdc.ae', 4.4, 350),
(4, 'Dubai Driving Center (DDC)', 'https://dubaidrivingcenter.net/', 'enquiries@dcds123.ae', 4.2, 190),
(5, 'Al Ahli Driving Center', 'https://alahlidubai.ae/', 'care@alahlidubai.ae', 4.3, 220)
ON CONFLICT (id) DO NOTHING;

-- Insert categories data
INSERT INTO categories (id, name, description) VALUES
(1, 'Motorcycle', 'Motorcycle license training and testing'),
(2, 'Light Motor Vehicle', 'Standard car/light vehicle license'),
(3, 'Heavy Truck', 'Heavy truck and commercial vehicle license'),
(4, 'Light Bus', 'Light bus and minibus license'),
(5, 'Heavy Bus', 'Heavy bus and coach license'),
(6, 'Light Forklift', 'Light forklift operator license'),
(7, 'Heavy Forklift', 'Heavy forklift operator license')
ON CONFLICT (id) DO NOTHING;
