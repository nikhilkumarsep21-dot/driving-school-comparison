-- Add new fields to user_queries table for better query tracking
ALTER TABLE user_queries
ADD COLUMN IF NOT EXISTS license_type VARCHAR(100),
ADD COLUMN IF NOT EXISTS license_status VARCHAR(50),
ADD COLUMN IF NOT EXISTS package_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS location VARCHAR(100),
ADD COLUMN IF NOT EXISTS start_time VARCHAR(50);

-- Add indexes for frequently queried fields
CREATE INDEX IF NOT EXISTS idx_user_queries_license_type ON user_queries(license_type);
CREATE INDEX IF NOT EXISTS idx_user_queries_location ON user_queries(location);
CREATE INDEX IF NOT EXISTS idx_user_queries_package_type ON user_queries(package_type);

-- Add comment to table
COMMENT ON COLUMN user_queries.license_type IS 'Type of driving license (e.g., Motorcycle, Light Motor Vehicle)';
COMMENT ON COLUMN user_queries.license_status IS 'Whether user has license from home country (yes/no)';
COMMENT ON COLUMN user_queries.package_type IS 'Package type preference (Regular/Flexi/Unlimited)';
COMMENT ON COLUMN user_queries.location IS 'Preferred location/city for training';
COMMENT ON COLUMN user_queries.start_time IS 'When user wants to start (e.g., immediately, 1-2weeks)';
