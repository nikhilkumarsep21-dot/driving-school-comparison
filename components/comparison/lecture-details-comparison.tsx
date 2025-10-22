'use client';

import { BranchWithDetails, Detail } from '@/lib/types';
import { ComparisonRow, ComparisonEmptyCell } from './comparison-row';
import { Calendar } from 'lucide-react';

interface LectureDetailsComparisonProps {
  branches: BranchWithDetails[];
  categoryId: number;
}

export function LectureDetailsComparison({
  branches,
  categoryId,
}: LectureDetailsComparisonProps) {
  const getBranchDetail = (branch: BranchWithDetails): Detail | undefined => {
    return branch.details?.find((d) => d.category_id === categoryId);
  };

  const hasAnyLectures = branches.some(
    (branch) => !!getBranchDetail(branch)?.lecture_details
  );

  if (!hasAnyLectures) {
    return null;
  }

  const renderLectureDetails = (branch: BranchWithDetails) => {
    const detail = getBranchDetail(branch);
    const lectureDetails = detail?.lecture_details;

    if (!lectureDetails) {
      return <ComparisonEmptyCell message="Lecture details not available" />;
    }

    if (Array.isArray(lectureDetails)) {
      return (
        <div className="space-y-3">
          {lectureDetails.map((lecture: any, index: number) => {
            if (typeof lecture === 'string') {
              return (
                <div key={index} className="flex items-start gap-2 text-xs">
                  <Calendar className="h-3 w-3 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-900">{lecture}</span>
                </div>
              );
            }

            return (
              <div
                key={index}
                className="bg-blue-50 rounded p-3 border border-blue-200 space-y-2"
              >
                {lecture.title && (
                  <h5 className="font-bold text-gray-900 text-sm">{lecture.title}</h5>
                )}
                {lecture.type && (
                  <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {lecture.type}
                  </span>
                )}
                <div className="space-y-1">
                  {Object.entries(lecture)
                    .filter(
                      ([key]) =>
                        !['title', 'type', 'notes', 'name'].includes(key)
                    )
                    .map(([key, value]) => (
                      <div key={key} className="text-xs">
                        <span className="font-medium text-gray-600 capitalize">
                          {key.replace(/_/g, ' ')}:
                        </span>{' '}
                        <span className="text-gray-900">{String(value)}</span>
                      </div>
                    ))}
                </div>
                {lecture.notes && (
                  <p className="text-xs text-amber-900 bg-amber-50 p-2 rounded border border-amber-200">
                    {lecture.notes}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    if (typeof lectureDetails === 'object' && lectureDetails !== null) {
      return (
        <div className="space-y-2">
          {Object.entries(lectureDetails).map(([key, value]) => (
            <div key={key} className="text-xs">
              <span className="font-medium text-gray-600 capitalize">
                {key.replace(/_/g, ' ')}:
              </span>{' '}
              <span className="text-gray-900">{String(value)}</span>
            </div>
          ))}
        </div>
      );
    }

    return <p className="text-xs text-gray-700">{String(lectureDetails)}</p>;
  };

  return (
    <tbody>
      <ComparisonRow
        label="Lecture Details"
        branches={branches}
        renderCell={renderLectureDetails}
      />
    </tbody>
  );
}
