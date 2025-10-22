'use client';

import { Detail, CourseFee, OtherFee } from '@/lib/types';
import { DollarSign, Clock, CreditCard, FileText, Calendar } from 'lucide-react';
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

  const formatCurrency = (value: number): string => {
    return `AED ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const renderTimings = () => {
    if (!fees.timings || Object.keys(fees.timings).length === 0) {
      return null;
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Clock className="h-5 w-5 text-blue-600" />
          </div>
          <h4 className="text-xl font-bold text-gray-900">Training Timings</h4>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(fees.timings).map(([key, value], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="p-4 bg-blue-50 rounded-lg border border-blue-100"
            >
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">{key}</p>
                  <p className="text-sm text-gray-700">{value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  const renderCourseFees = () => {
    if (!fees.course_fees || fees.course_fees.length === 0) {
      return null;
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-green-100 rounded-lg">
            <DollarSign className="h-5 w-5 text-green-600" />
          </div>
          <h4 className="text-xl font-bold text-gray-900">Course Fees</h4>
        </div>
        <div className="space-y-6">
          {fees.course_fees.map((course: CourseFee, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 border-b border-gray-200">
                <h5 className="font-bold text-gray-900">{course.category}</h5>
                <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                  {course.min_age && (
                    <span className="inline-flex items-center gap-1">
                      <span className="font-medium">Min Age:</span> {course.min_age} years
                    </span>
                  )}
                  {course.road_training && (
                    <span className="inline-flex items-center gap-1">
                      <span className="font-medium">Training:</span> {course.road_training}
                    </span>
                  )}
                  {course.internal_training && (
                    <span className="inline-flex items-center gap-1">
                      <span className="font-medium">Internal:</span> {course.internal_training}
                    </span>
                  )}
                  {course.total_hours && (
                    <span className="inline-flex items-center gap-1">
                      <span className="font-medium">Total Hours:</span> {course.total_hours}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {course.regular_course_fees && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-semibold text-gray-600 mb-2">Regular Course</p>
                      {course.regular_course_fees.hourly && (
                        <p className="text-sm text-gray-700 mb-1">
                          <span className="font-medium">Hourly Rate:</span> {formatCurrency(course.regular_course_fees.hourly)}
                        </p>
                      )}
                      <p className="text-lg font-bold text-green-600">
                        {Array.isArray(course.regular_course_fees.total)
                          ? course.regular_course_fees.total.map(t => formatCurrency(t)).join(' / ')
                          : formatCurrency(course.regular_course_fees.total)}
                      </p>
                    </div>
                  )}

                  {course.sunday_night_shift_fees && (
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <p className="text-sm font-semibold text-gray-600 mb-2">Sunday/Night Shift</p>
                      {course.sunday_night_shift_fees.hourly && (
                        <p className="text-sm text-gray-700 mb-1">
                          <span className="font-medium">Hourly Rate:</span> {formatCurrency(course.sunday_night_shift_fees.hourly)}
                        </p>
                      )}
                      <p className="text-lg font-bold text-amber-600">
                        {Array.isArray(course.sunday_night_shift_fees.total)
                          ? course.sunday_night_shift_fees.total.map(t => formatCurrency(t)).join(' / ')
                          : formatCurrency(course.sunday_night_shift_fees.total)}
                      </p>
                    </div>
                  )}
                </div>

                {course.notes && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 italic">{course.notes}</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  const renderOtherFees = () => {
    if (!fees.other_fees || fees.other_fees.length === 0) {
      return null;
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 bg-amber-100 rounded-lg">
            <CreditCard className="h-5 w-5 text-amber-600" />
          </div>
          <h4 className="text-xl font-bold text-gray-900">Other Fees</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Fee Type</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">RTA</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">DDC</th>
              </tr>
            </thead>
            <tbody>
              {fees.other_fees.map((fee: OtherFee, index: number) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4 text-gray-900">{fee.type}</td>
                  <td className="py-3 px-4 text-right text-gray-700 font-medium">
                    {fee.RTA !== null ? formatCurrency(fee.RTA) : '-'}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-700 font-medium">
                    {fee.DDC !== null ? formatCurrency(fee.DDC) : '-'}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    );
  };

  const hasAnyFees = fees.timings || fees.course_fees?.length || fees.other_fees?.length;

  if (!hasAnyFees) {
    return (
      <div className="text-center py-12">
        <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No fee information available at this time.</p>
        <p className="text-sm text-gray-400 mt-2">Please contact the branch directly for pricing details.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
        <div className="flex items-center gap-3 mb-2">
          <DollarSign className="h-6 w-6 text-green-700" />
          <h3 className="text-2xl font-bold text-gray-900">Fees & Pricing</h3>
        </div>
        <p className="text-gray-600">Detailed pricing information and payment structure for this course.</p>
      </div>

      {renderTimings()}
      {renderCourseFees()}
      {renderOtherFees()}

      {fees.notes && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-gray-50 rounded-xl p-6 border border-gray-200"
        >
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-gray-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Additional Notes</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{fees.notes}</p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <p className="text-sm text-gray-500 leading-relaxed">
          Fees are subject to change. Please contact the branch directly to confirm current pricing and available payment plans.
        </p>
      </div>
    </div>
  );
}
