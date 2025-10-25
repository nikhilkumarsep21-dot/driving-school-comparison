'use client';

import { SchoolWithCourses } from '@/lib/types';
import { ComparisonRow, ComparisonEmptyCell } from './comparison-row';
import { CheckCircle2 } from 'lucide-react';

interface CourseDetailsComparisonProps {
  branches: SchoolWithCourses[];
  categoryId: string;
}

export function CourseDetailsComparison({
  branches,
  categoryId,
}: CourseDetailsComparisonProps) {
  return (
    <ComparisonRow
      label="Course Details"
      branches={branches}
      renderCell={(school) => (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            {school.course_levels?.length || 0} courses available
          </p>
        </div>
      )}
    />
  );
}
