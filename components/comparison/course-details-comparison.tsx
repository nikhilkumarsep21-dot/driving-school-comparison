'use client';

import { BranchWithDetails, Detail, Category } from '@/lib/types';
import { ComparisonRow, ComparisonEmptyCell } from './comparison-row';
import { CheckCircle2 } from 'lucide-react';

interface CourseDetailsComparisonProps {
  branches: BranchWithDetails[];
  categoryId: number;
}

export function CourseDetailsComparison({
  branches,
  categoryId,
}: CourseDetailsComparisonProps) {
  const getBranchDetail = (branch: BranchWithDetails): Detail | undefined => {
    return branch.details?.find((d) => d.category_id === categoryId);
  };

  const hasAnyCourseDetails = branches.some(
    (branch) => !!getBranchDetail(branch)?.course_details
  );

  if (!hasAnyCourseDetails) {
    return null;
  }

  const renderCourseDetails = (branch: BranchWithDetails) => {
    const detail = getBranchDetail(branch);
    const courseDetails = detail?.course_details;

    if (!courseDetails) {
      return <ComparisonEmptyCell message="Course details not available" />;
    }

    const isArrayFormat = Array.isArray(courseDetails);

    if (isArrayFormat) {
      const sections = courseDetails as any[];
      return (
        <div className="space-y-4">
          {sections.map((section, index) => (
            <div key={index} className="space-y-2">
              {section.type && (
                <div className="inline-block px-2 py-1 bg-gold-100 text-gold-800 text-xs font-medium rounded-full">
                  {section.type}
                </div>
              )}
              {section.title && (
                <h5 className="font-bold text-gray-900 text-sm">{section.title}</h5>
              )}
              {section.details && section.details.length > 0 && (
                <ul className="space-y-1">
                  {section.details.map((item: string, itemIndex: number) => (
                    <li
                      key={itemIndex}
                      className="flex items-start gap-2 text-xs text-gray-700"
                    >
                      <CheckCircle2 className="h-3 w-3 text-gold-600 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              {section.notes && (
                <p className="text-xs text-blue-700 bg-blue-50 p-2 rounded border border-blue-200">
                  {section.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {Object.entries(courseDetails).map(([key, value]) => {
          if (typeof value === 'string' || typeof value === 'number') {
            return (
              <div key={key} className="text-xs">
                <span className="font-medium text-gray-600 capitalize">
                  {key.replace(/_/g, ' ')}:
                </span>{' '}
                <span className="text-gray-900">{String(value)}</span>
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  };

  return (
    <tbody>
      <ComparisonRow
        label="Course Details"
        branches={branches}
        renderCell={renderCourseDetails}
      />
    </tbody>
  );
}
