'use client';

import { NestedCourseFee } from '@/lib/types';
import { formatCurrency, sortFieldsByPriority } from '@/lib/fee-utils';
import { DynamicFieldRenderer } from './dynamic-field-renderer';
import { motion } from 'framer-motion';

interface NestedCourseFeeCardProps {
  courseFee: NestedCourseFee;
  index: number;
}

export function NestedCourseFeeCard({ courseFee, index }: NestedCourseFeeCardProps) {
  const allFields = Object.keys(courseFee);
  const sortedFields = sortFieldsByPriority(allFields);

  const renderPricing = (
    label: string,
    fees: { hourly?: number; total: number | number[] } | undefined,
    colorClass: string,
    bgClass: string
  ) => {
    if (!fees) return null;

    const totals = Array.isArray(fees.total) ? fees.total : [fees.total];

    return (
      <div className={`p-4 ${bgClass} rounded-lg`}>
        <p className="text-sm font-semibold text-gray-600 mb-2">{label}</p>
        {fees.hourly && (
          <p className="text-sm text-gray-700 mb-1">
            <span className="font-medium">Hourly Rate:</span> {formatCurrency(fees.hourly)}
          </p>
        )}
        <div className="space-y-1">
          {totals.map((total, idx) => (
            <p key={idx} className={`text-lg font-bold ${colorClass}`}>
              {formatCurrency(total)}
              {totals.length > 1 && (
                <span className="text-xs ml-2 text-gray-600">
                  ({['20 hours', '15 hours', '10 hours'][idx] || `Option ${idx + 1}`})
                </span>
              )}
            </p>
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="border border-gray-200 rounded-lg overflow-hidden"
    >
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 border-b border-gray-200">
        <h5 className="font-bold text-gray-900">{courseFee.category || `Course ${index + 1}`}</h5>
        <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
          {courseFee.min_age && (
            <span className="inline-flex items-center gap-1">
              <span className="font-medium">Min Age:</span> {courseFee.min_age} years
            </span>
          )}
          {courseFee.road_training && (
            <span className="inline-flex items-center gap-1">
              <span className="font-medium">Training:</span> {courseFee.road_training}
            </span>
          )}
          {courseFee.internal_training && (
            <span className="inline-flex items-center gap-1">
              <span className="font-medium">Internal:</span> {courseFee.internal_training}
            </span>
          )}
          {courseFee.total_hours && (
            <span className="inline-flex items-center gap-1">
              <span className="font-medium">Total Hours:</span> {courseFee.total_hours}
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {renderPricing(
            'Regular Course',
            courseFee.regular_course_fees,
            'text-green-600',
            'bg-gray-50'
          )}
          {renderPricing(
            'Sunday/Night Shift',
            courseFee.sunday_night_shift_fees,
            'text-amber-600',
            'bg-amber-50 border border-amber-200'
          )}
        </div>

        <div className="space-y-2">
          {sortedFields.map(fieldKey => (
            <DynamicFieldRenderer
              key={fieldKey}
              fieldKey={fieldKey}
              value={courseFee[fieldKey]}
            />
          ))}
        </div>

        {courseFee.notes && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 italic">{courseFee.notes}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
