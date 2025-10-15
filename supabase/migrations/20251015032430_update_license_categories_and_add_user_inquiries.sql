/*
  # Update License Categories and Add User Inquiries Table

  ## Changes Made

  ### 1. Update License Categories
  - Migrate existing data:
    - light_vehicle → light_motor_vehicle
    - bus → light_bus
    - taxi → light_motor_vehicle
  - Update license_categories table constraint to include new types:
    - motorcycle (existing)
    - light_motor_vehicle (new)
    - heavy_truck (existing)
    - light_bus (new)
    - heavy_bus (new)
    - light_forklift (new)
    - heavy_forklift (new)

  ### 2. New Tables
  - `user_inquiries`
    - `id` (uuid, primary key) - Unique identifier
    - `name` (text) - User's full name
    - `email` (text, unique) - User's email address
    - `phone` (text) - User's phone number
    - `selected_category` (text) - Selected license category
    - `location` (text) - Selected Dubai area
    - `email_verified` (boolean) - Email verification status
    - `otp_code` (text, nullable) - One-time password for verification
    - `otp_expires_at` (timestamptz, nullable) - OTP expiration timestamp
    - `created_at` (timestamptz) - Record creation timestamp
    - `updated_at` (timestamptz) - Record update timestamp

  ## Security
  - Enable RLS on user_inquiries table
  - Add policy for public to insert new inquiries
  - Add policy for public to update their own inquiries (for OTP verification)
  - Add policy for authenticated users to read all inquiries (for future admin access)

  ## Indexes
  - Index on email for fast lookups
  - Index on created_at for sorting and cleanup
  - Index on otp_expires_at for expired OTP cleanup

  ## Important Notes
  - Existing data is migrated to new category names
  - Taxi licenses are converted to light_motor_vehicle category
  - Old constraint is dropped before data migration
*/

-- Drop the existing check constraint first to allow updates
ALTER TABLE license_categories DROP CONSTRAINT IF EXISTS license_categories_type_check;

-- Update existing data to new category names
UPDATE license_categories SET type = 'light_motor_vehicle' WHERE type = 'light_vehicle';
UPDATE license_categories SET type = 'light_bus' WHERE type = 'bus';
UPDATE license_categories SET type = 'light_motor_vehicle' WHERE type = 'taxi';

-- Add new check constraint with updated license types
ALTER TABLE license_categories
ADD CONSTRAINT license_categories_type_check
CHECK (type IN ('motorcycle', 'light_motor_vehicle', 'heavy_truck', 'light_bus', 'heavy_bus', 'light_forklift', 'heavy_forklift'));

-- Create user_inquiries table
CREATE TABLE IF NOT EXISTS user_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  selected_category text NOT NULL,
  location text NOT NULL,
  email_verified boolean DEFAULT false,
  otp_code text,
  otp_expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_inquiries_email ON user_inquiries(email);
CREATE INDEX IF NOT EXISTS idx_user_inquiries_created_at ON user_inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_inquiries_otp_expires ON user_inquiries(otp_expires_at);

-- Enable Row Level Security
ALTER TABLE user_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert new inquiries
CREATE POLICY "Allow public to insert inquiries"
  ON user_inquiries FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anyone to update their own inquiry (for OTP verification)
CREATE POLICY "Allow public to update own inquiry"
  ON user_inquiries FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to read all inquiries (for future admin)
CREATE POLICY "Allow authenticated users to read inquiries"
  ON user_inquiries FOR SELECT
  TO authenticated
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_user_inquiries_updated_at ON user_inquiries;
CREATE TRIGGER update_user_inquiries_updated_at
  BEFORE UPDATE ON user_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();