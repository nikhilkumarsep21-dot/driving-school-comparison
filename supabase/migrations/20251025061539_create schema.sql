
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
