'use client';

import { Detail } from '@/lib/types';
import { DollarSign, Clock, CreditCard, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeesSectionProps {
  detail: Detail;
}

export function FeesSection({ detail }: FeesSectionProps) {
  const fees = detail.fees;

  if (!fees) {
    return (
      <div className="text-center py-12">
        <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No fee information available at this time.</p>
        <p className="text-sm text-gray-400 mt-2">Please contact the branch directly for pricing details.</p>
      </div>
    );
  }

  const formatCurrency = (value: any): string => {
    const numValue = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.-]+/g, ''));
    if (!isNaN(numValue)) {
      return `AED ${numValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return String(value);
  };

  const renderValue = (value: any): string => {
    if (typeof value === 'number' || (typeof value === 'string' && !isNaN(parseFloat(value)))) {
      return formatCurrency(value);
    }
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  const isTimingField = (key: string): boolean => {
    const timingKeywords = ['timing', 'schedule', 'duration', 'hours', 'days', 'period', 'time'];
    return timingKeywords.some((keyword) => key.toLowerCase().includes(keyword));
  };

  const isCourseFeesField = (key: string): boolean => {
    const courseFeeKeywords = ['course_fee', 'tuition', 'training_fee', 'lesson_fee', 'package', 'total_fee'];
    return courseFeeKeywords.some((keyword) => key.toLowerCase().includes(keyword));
  };

  const isOtherFeesField = (key: string): boolean => {
    const otherFeeKeywords = ['registration', 'material', 'exam', 'test', 'book', 'uniform', 'certificate', 'application', 'processing', 'administrative'];
    return otherFeeKeywords.some((keyword) => key.toLowerCase().includes(keyword));
  };

  const isNoteField = (key: string): boolean => {
    const noteKeywords = ['note', 'remark', 'info', 'additional'];
    return noteKeywords.some((keyword) => key.toLowerCase().includes(keyword));
  };

  const renderListItem = (key: string, value: any, index: number) => {
    return (
      <motion.li
        key={key}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="text-gray-900"
      >
        <span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span>{' '}
        <span className="text-gray-700">{renderValue(value)}</span>
      </motion.li>
    );
  };

  const renderFeesStructure = () => {
    if (typeof fees === 'object' && !Array.isArray(fees)) {
      const feeEntries = Object.entries(fees);
      const timingItems = feeEntries.filter(([key]) => isTimingField(key));
      const courseFeeItems = feeEntries.filter(([key]) => isCourseFeesField(key));
      const otherFeeItems = feeEntries.filter(([key]) => isOtherFeesField(key));
      const noteItems = feeEntries.filter(([key]) => isNoteField(key));
      const otherItems = feeEntries.filter(([key]) =>
        !isTimingField(key) && !isCourseFeesField(key) && !isOtherFeesField(key) && !isNoteField(key)
      );

      return (
        <div className="space-y-8">
          {timingItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-blue-600" />
                <h4 className="text-xl font-bold text-gray-900">Timing</h4>
              </div>
              <ul className="space-y-3 ml-6 list-disc marker:text-blue-600">
                {timingItems.map(([key, value], index) => renderListItem(key, value, index))}
              </ul>
              {noteItems.filter(([key]) => key.toLowerCase().includes('timing')).map(([key, value]) => (
                <p key={key} className="text-sm text-gray-400 mt-4 ml-6">{renderValue(value)}</p>
              ))}
            </motion.div>
          )}

          {courseFeeItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="h-5 w-5 text-green-600" />
                <h4 className="text-xl font-bold text-gray-900">Course Fees</h4>
              </div>
              <ul className="space-y-3 ml-6 list-disc marker:text-green-600">
                {courseFeeItems.map(([key, value], index) => renderListItem(key, value, index))}
              </ul>
              {noteItems.filter(([key]) => key.toLowerCase().includes('course') || key.toLowerCase().includes('tuition')).map(([key, value]) => (
                <p key={key} className="text-sm text-gray-400 mt-4 ml-6">{renderValue(value)}</p>
              ))}
            </motion.div>
          )}

          {otherFeeItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-5 w-5 text-amber-600" />
                <h4 className="text-xl font-bold text-gray-900">Other Fees</h4>
              </div>
              <ul className="space-y-3 ml-6 list-disc marker:text-amber-600">
                {otherFeeItems.map(([key, value], index) => renderListItem(key, value, index))}
              </ul>
              {noteItems.filter(([key]) => key.toLowerCase().includes('other') || key.toLowerCase().includes('additional')).map(([key, value]) => (
                <p key={key} className="text-sm text-gray-400 mt-4 ml-6">{renderValue(value)}</p>
              ))}
            </motion.div>
          )}

          {otherItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-gray-600" />
                <h4 className="text-xl font-bold text-gray-900">Additional Information</h4>
              </div>
              <ul className="space-y-3 ml-6 list-disc marker:text-gray-600">
                {otherItems.map(([key, value], index) => renderListItem(key, value, index))}
              </ul>
            </motion.div>
          )}

          {noteItems.filter(([key]) => !key.toLowerCase().includes('timing') && !key.toLowerCase().includes('course') && !key.toLowerCase().includes('tuition') && !key.toLowerCase().includes('other') && !key.toLowerCase().includes('additional')).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              {noteItems.filter(([key]) => !key.toLowerCase().includes('timing') && !key.toLowerCase().includes('course') && !key.toLowerCase().includes('tuition') && !key.toLowerCase().includes('other') && !key.toLowerCase().includes('additional')).map(([key, value]) => (
                <p key={key} className="text-sm text-gray-400 leading-relaxed">{renderValue(value)}</p>
              ))}
            </motion.div>
          )}
        </div>
      );
    }

    if (Array.isArray(fees)) {
      return (
        <ul className="space-y-3 ml-6 list-disc marker:text-green-600">
          {fees.map((feeItem: any, index: number) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="text-gray-900"
            >
              {typeof feeItem === 'string' ? (
                feeItem
              ) : (
                <div className="space-y-2">
                  {Object.entries(feeItem).map(([key, value]) => (
                    <div key={key}>
                      <span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span>{' '}
                      <span className="text-gray-700">{renderValue(value)}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.li>
          ))}
        </ul>
      );
    }

    return (
      <p className="text-gray-900 text-lg font-semibold">{renderValue(fees)}</p>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
        <div className="flex items-center gap-3 mb-2">
          <DollarSign className="h-6 w-6 text-green-700" />
          <h3 className="text-2xl font-bold text-gray-900">Fees & Pricing</h3>
        </div>
        <p className="text-gray-600">Detailed pricing information and payment structure for this course.</p>
      </div>

      {renderFeesStructure()}

      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <p className="text-sm text-gray-500 leading-relaxed">
          Fees are subject to change. Please contact the branch directly to confirm current pricing and available payment plans.
        </p>
      </div>
    </div>
  );
}
