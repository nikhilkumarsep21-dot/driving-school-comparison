/*
  # Restructure to Course-Based Schema with Branch Locations

  ## Overview
  Complete database restructure from branch-centric to course-based architecture.
  Separates course offerings from physical branch locations for better organization.

  ## Changes Made

  ### 1. Drop Existing Tables
  - Drop details table
  - Drop branches table  
  - Drop categories table
  - Drop schools table
  - Drop user_inquiries table (if exists)

  ### 2. New Tables Created

  #### `schools`
  Core school information:
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - School name
  - `website` (text, nullable) - School website
  - `phone` (text, nullable) - Contact phone
  - `email` (text, nullable) - Contact email
  - `logo_url` (text, nullable) - School logo
  - `rating` (decimal) - School rating (0-5)
  - `review_count` (integer) - Total reviews
  - `created_at` (timestamptz) - Record creation

  #### `branch_locations`
  Physical branch locations:
  - `id` (uuid, primary key) - Unique identifier
  - `school_id` (uuid, foreign key) - References schools
  - `name` (text) - Branch name/location
  - `address` (text) - Full street address
  - `city` (text) - City/area name
  - `contact` (text, nullable) - Branch phone
  - `email` (text, nullable) - Branch email
  - `normal_hours` (text, nullable) - Operating hours
  - `directions_url` (text, nullable) - Google Maps link
  - `coordinates` (jsonb, nullable) - {lat, lng}
  - `created_at` (timestamptz) - Record creation

  #### `license_types`
  License type lookup table:
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - License type name (e.g., "Motorcycle", "Car")
  - `description` (text, nullable) - License description
  - `created_at` (timestamptz) - Record creation

  #### `course_levels`
  Course offerings per school:
  - `id` (uuid, primary key) - Unique identifier
  - `school_id` (uuid, foreign key) - References schools
  - `license_type_id` (uuid, foreign key) - References license_types
  - `name` (text) - Course level (e.g., "Beginner", "Experienced", "Direct Test")
  - `duration_hours` (integer, nullable) - Course duration in hours
  - `description` (text, nullable) - Course description
  - `created_at` (timestamptz) - Record creation

  #### `shifts`
  Available shift times per course:
  - `id` (uuid, primary key) - Unique identifier
  - `course_level_id` (uuid, foreign key) - References course_levels
  - `type` (text) - Shift type (e.g., "Regular", "Night", "Weekend")
  - `description` (text, nullable) - Shift details
  - `created_at` (timestamptz) - Record creation

  #### `packages`
  Package options per shift:
  - `id` (uuid, primary key) - Unique identifier
  - `shift_id` (uuid, foreign key) - References shifts
  - `name` (text) - Package name (e.g., "Standard", "Flexi", "Lumpsum", "VIP")
  - `fee_aed` (numeric) - Package fee in AED
  - `details` (jsonb, nullable) - Flexible fee breakdown structure
  - `created_at` (timestamptz) - Record creation

  ### 3. Security
  - Enable RLS on all tables
  - Add public read-only policies for anonymous and authenticated users
  - Restrict write operations

  ### 4. Indexes
  - Index on branch_locations.school_id for fast joins
  - Index on branch_locations.city for location filtering
  - Index on course_levels.school_id for course lookups
  - Index on course_levels.license_type_id for type filtering
  - Index on shifts.course_level_id for shift lookups
  - Index on packages.shift_id for package lookups

  ## Important Notes
  - This is a destructive migration - all existing data will be lost
  - Data must be re-imported after migration
  - New structure separates course offerings from branch locations
  - Flexible JSONB details field supports various fee structures
*/

-- Drop existing tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS details CASCADE;
DROP TABLE IF EXISTS branches CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS schools CASCADE;
DROP TABLE IF EXISTS user_inquiries CASCADE;

-- Create schools table
CREATE TABLE IF NOT EXISTS schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  website text,
  phone text,
  email text,
  logo_url text,
  rating decimal(3,2) DEFAULT 4.2 CHECK (rating >= 0 AND rating <= 5),
  review_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create branch_locations table
CREATE TABLE IF NOT EXISTS branch_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  contact text,
  email text,
  normal_hours text,
  directions_url text,
  coordinates jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create license_types table
CREATE TABLE IF NOT EXISTS license_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create course_levels table
CREATE TABLE IF NOT EXISTS course_levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  license_type_id uuid NOT NULL REFERENCES license_types(id) ON DELETE CASCADE,
  name text NOT NULL,
  duration_hours integer,
  description text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(school_id, license_type_id, name)
);

-- Create shifts table
CREATE TABLE IF NOT EXISTS shifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_level_id uuid NOT NULL REFERENCES course_levels(id) ON DELETE CASCADE,
  type text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(course_level_id, type)
);

-- Create packages table
CREATE TABLE IF NOT EXISTS packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shift_id uuid NOT NULL REFERENCES shifts(id) ON DELETE CASCADE,
  name text NOT NULL,
  fee_aed numeric(10,2) NOT NULL,
  details jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_branch_locations_school_id ON branch_locations(school_id);
CREATE INDEX IF NOT EXISTS idx_branch_locations_city ON branch_locations(city);
CREATE INDEX IF NOT EXISTS idx_course_levels_school_id ON course_levels(school_id);
CREATE INDEX IF NOT EXISTS idx_course_levels_license_type_id ON course_levels(license_type_id);
CREATE INDEX IF NOT EXISTS idx_shifts_course_level_id ON shifts(course_level_id);
CREATE INDEX IF NOT EXISTS idx_packages_shift_id ON packages(shift_id);

-- Enable Row Level Security
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE branch_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE license_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to schools"
  ON schools FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read access to branch_locations"
  ON branch_locations FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read access to license_types"
  ON license_types FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read access to course_levels"
  ON course_levels FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read access to shifts"
  ON shifts FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read access to packages"
  ON packages FOR SELECT
  TO anon, authenticated
  USING (true);

-- Insert sample license types
INSERT INTO license_types (name, description) VALUES
('Motorcycle', 'Motorcycle license training and testing'),
('Light Motor Vehicle', 'Standard car/light vehicle license'),
('Heavy Truck', 'Heavy truck and commercial vehicle license'),
('Light Bus', 'Light bus and minibus license'),
('Heavy Bus', 'Heavy bus and coach license'),
('Light Forklift', 'Light forklift operator license'),
('Heavy Forklift', 'Heavy forklift operator license')
ON CONFLICT (name) DO NOTHING;