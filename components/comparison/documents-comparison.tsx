'use client';

import { SchoolWithCourses } from '@/lib/types';
import { ComparisonRow } from './comparison-row';

export function PlaceholderComparison({ branches }: { branches: SchoolWithCourses[] }) {
  return (
    <ComparisonRow
      label="Details"
      branches={branches}
      renderCell={(school) => <div className="text-sm text-gray-600">Not implemented yet</div>}
    />
  );
}
