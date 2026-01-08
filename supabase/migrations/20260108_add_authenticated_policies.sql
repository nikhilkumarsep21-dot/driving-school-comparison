-- Add policies for authenticated users to manage all course-related data

-- Schools policies
CREATE POLICY "Allow authenticated users to insert schools"
  ON schools FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update schools"
  ON schools FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete schools"
  ON schools FOR DELETE
  TO authenticated
  USING (true);

-- Branch locations policies
CREATE POLICY "Allow authenticated users to insert branch_locations"
  ON branch_locations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update branch_locations"
  ON branch_locations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete branch_locations"
  ON branch_locations FOR DELETE
  TO authenticated
  USING (true);

-- License types policies
CREATE POLICY "Allow authenticated users to insert license_types"
  ON license_types FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update license_types"
  ON license_types FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete license_types"
  ON license_types FOR DELETE
  TO authenticated
  USING (true);

-- Course levels policies
CREATE POLICY "Allow authenticated users to insert course_levels"
  ON course_levels FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update course_levels"
  ON course_levels FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete course_levels"
  ON course_levels FOR DELETE
  TO authenticated
  USING (true);

-- Shifts policies
CREATE POLICY "Allow authenticated users to insert shifts"
  ON shifts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update shifts"
  ON shifts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete shifts"
  ON shifts FOR DELETE
  TO authenticated
  USING (true);

-- Packages policies
CREATE POLICY "Allow authenticated users to insert packages"
  ON packages FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update packages"
  ON packages FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete packages"
  ON packages FOR DELETE
  TO authenticated
  USING (true);

-- User queries policies (for admin dashboard enquiry management)
CREATE POLICY "Allow authenticated users to update user_queries"
  ON user_queries FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete user_queries"
  ON user_queries FOR DELETE
  TO authenticated
  USING (true);
