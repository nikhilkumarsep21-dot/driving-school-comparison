'use client';

import { SimpleCourseFee } from '@/lib/types';
import { sortFieldsByPriority } from '@/lib/fee-utils';
import { DynamicFieldRenderer } from './dynamic-field-renderer';
import { motion } from 'framer-motion';

interface SimpleCourseFeeCardProps {
  courseFee: SimpleCourseFee;
  index: number;
}

export function SimpleCourseFeeCard({ courseFee, index }: SimpleCourseFeeCardProps) {
  const allFields = Object.keys(courseFee);
  const sortedFields = sortFieldsByPriority(allFields);

  const pricingFields = ['normal_fee', 'sunday_fee', 'shift_fee'];
  const hasPricing = pricingFields.some(field => field in courseFee);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="border border-gray-200 rounded-lg overflow-hidden"
    >
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 border-b border-gray-200">
        <h5 className="font-bold text-gray-900">
          {courseFee.eligibility || `Course Option ${index + 1}`}
        </h5>
        {courseFee.hours && (
          <p className="text-sm text-gray-600 mt-1">{courseFee.hours} hours training</p>
        )}
      </div>

      <div className="p-4">
        {hasPricing && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {courseFee.normal_fee && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-semibold text-gray-600 mb-2">Normal Rate</p>
                <p className="text-lg font-bold text-green-600">{courseFee.normal_fee}</p>
                {courseFee.duration && (
                  <p className="text-xs text-gray-500 mt-1">{courseFee.duration}</p>
                )}
              </div>
            )}

            {courseFee.sunday_fee && (
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-sm font-semibold text-gray-600 mb-2">Sunday Rate</p>
                <p className="text-lg font-bold text-amber-600">{courseFee.sunday_fee}</p>
                {courseFee.duration && (
                  <p className="text-xs text-gray-500 mt-1">{courseFee.duration}</p>
                )}
              </div>
            )}

            {courseFee.shift_fee && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-semibold text-gray-600 mb-2">Shift Rate</p>
                <p className="text-lg font-bold text-blue-600">{courseFee.shift_fee}</p>
                {courseFee.duration && (
                  <p className="text-xs text-gray-500 mt-1">{courseFee.duration}</p>
                )}
              </div>
            )}
          </div>
        )}

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
