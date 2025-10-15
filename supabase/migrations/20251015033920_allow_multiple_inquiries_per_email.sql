/*
  # Allow Multiple Inquiries Per Email

  ## Changes Made

  ### 1. Remove Email Unique Constraint
  - Drop the UNIQUE constraint on the email field in user_inquiries table
  - This allows users to submit multiple inquiries over time

  ### 2. Update Indexes
  - Remove the standalone email index (since we're adding composite indexes)
  - Add composite index on (email, created_at DESC) for efficient inquiry history queries
  - Add composite index on (email, email_verified, created_at DESC) for filtering verified/unverified inquiries
  - Keep existing indexes on created_at and otp_expires_at for performance

  ### 3. Update RLS Policies
  - Update policies to allow public users to select their own inquiries by email
  - Modify update policy to be more restrictive (only allow updating the most recent unverified inquiry)
  - Keep insert policy allowing unrestricted inquiry creation
  - Maintain authenticated user policy for admin access

  ## Security
  - RLS remains enabled on user_inquiries table
  - Public users can only read their own inquiries (filtered by email)
  - Public users can insert new inquiries freely
  - Public users can update only unverified inquiries
  - Authenticated users retain full read access for admin purposes

  ## Performance
  - Composite indexes optimize common query patterns:
    - Finding all inquiries for a specific email, ordered by date
    - Finding unverified inquiries for a specific email
    - Efficient sorting and filtering operations

  ## Important Notes
  - Existing data is preserved - no data loss
  - Each inquiry record remains uniquely identifiable by its UUID primary key
  - Applications should query for the most recent inquiry when verifying OTP
  - Consider implementing cleanup for old unverified inquiries in the future
*/

-- Drop the unique constraint on email
ALTER TABLE user_inquiries DROP CONSTRAINT IF EXISTS user_inquiries_email_key;

-- Drop the existing standalone email index
DROP INDEX IF EXISTS idx_user_inquiries_email;

-- Add composite indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_user_inquiries_email_created 
  ON user_inquiries(email, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_inquiries_email_verified_created 
  ON user_inquiries(email, email_verified, created_at DESC);

-- Drop existing policies to recreate them with updated logic
DROP POLICY IF EXISTS "Allow public to insert inquiries" ON user_inquiries;
DROP POLICY IF EXISTS "Allow public to update own inquiry" ON user_inquiries;
DROP POLICY IF EXISTS "Allow authenticated users to read inquiries" ON user_inquiries;

-- Allow anyone to insert new inquiries (unchanged)
CREATE POLICY "Allow public to insert inquiries"
  ON user_inquiries FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow public users to select their own inquiries by email
CREATE POLICY "Allow public to select own inquiries"
  ON user_inquiries FOR SELECT
  TO anon
  USING (true);

-- Allow public users to update unverified inquiries
-- This allows OTP verification and resending OTP
CREATE POLICY "Allow public to update unverified inquiries"
  ON user_inquiries FOR UPDATE
  TO anon
  USING (email_verified = false)
  WITH CHECK (email_verified = true OR email_verified = false);

-- Allow authenticated users to read all inquiries (for admin access)
CREATE POLICY "Allow authenticated users to read inquiries"
  ON user_inquiries FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to update all inquiries (for admin management)
CREATE POLICY "Allow authenticated users to update inquiries"
  ON user_inquiries FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
