-- Create user_queries table to store enquiry form submissions
CREATE TABLE IF NOT EXISTS user_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
  school_name VARCHAR(255),
  message TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_queries_email ON user_queries(email);
CREATE INDEX IF NOT EXISTS idx_user_queries_created_at ON user_queries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_queries_status ON user_queries(status);

-- Add RLS (Row Level Security) policies if needed
ALTER TABLE user_queries ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for enquiry form submissions)
CREATE POLICY "Allow public insert" ON user_queries
  FOR INSERT
  WITH CHECK (true);

-- Only allow authenticated users to view all queries (for admin panel later)
CREATE POLICY "Allow authenticated select" ON user_queries
  FOR SELECT
  USING (auth.role() = 'authenticated');
