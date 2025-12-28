"use client";

import { SchoolWithCourses } from "@/lib/types";

interface ComparisonRowProps {
  label: string;
  branches: SchoolWithCourses[];
  renderCell: (branch: SchoolWithCourses, index: number) => React.ReactNode;
  className?: string;
}

export function ComparisonRow({
  label,
  branches,
  renderCell,
  className = "",
}: ComparisonRowProps) {
  return (
    <tr className={className}>
      <td className="sticky left-0 z-10 bg-white border-t border-r border-gray-200 p-4 align-top">
        <h4 className="font-heading font-semibold text-gray-900 text-sm">
          {label}
        </h4>
      </td>
      {branches.map((branch, index) => (
        <td
          key={branch.id}
          className="bg-white border-t border-r border-gray-200 p-4 align-top"
        >
          {renderCell(branch, index)}
        </td>
      ))}
    </tr>
  );
}

interface ComparisonEmptyCellProps {
  message?: string;
}

export function ComparisonEmptyCell({
  message = "Not Available",
}: ComparisonEmptyCellProps) {
  return (
    <div className="flex items-center justify-center py-8 text-gray-400">
      <p className="text-sm italic">{message}</p>
    </div>
  );
}
