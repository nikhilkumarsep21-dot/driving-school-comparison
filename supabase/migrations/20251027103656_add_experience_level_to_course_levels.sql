-- Add experience_level column to course_levels table
ALTER TABLE course_levels ADD COLUMN IF NOT EXISTS experience_level text;
