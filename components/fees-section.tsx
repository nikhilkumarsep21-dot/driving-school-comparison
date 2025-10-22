'use client';

import { Detail, OtherFee } from '@/lib/types';
import { DollarSign, Clock, CreditCard, FileText, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/fee-utils';
import { detectFeePattern, isSimpleCourseFee, isNestedCourseFee, isRTAStyleCourseFee } from '@/lib/fee-utils';

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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
      >
        <div className="space-y-8">
          {fees.timings && Object.keys(fees.timings).length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900">Training Timings</h4>
              </div>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(fees.timings).map(([key, value], index) => (
                  <div
                    key={key}
                    className="p-3 bg-blue-50 rounded-lg border border-blue-100"
                  >
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900 text-sm mb-1">{key}</p>
                        <p className="text-xs text-gray-700">{value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {fees.course_fees && fees.course_fees.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900">Course Fees</h4>
              </div>
              <div className="space-y-4">
                {fees.course_fees.map((courseFee, index) => {
                  if (isSimpleCourseFee(courseFee)) {
                    return (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg overflow-hidden bg-gradient-to-r from-green-50 to-emerald-50"
                      >
                        <div className="px-4 py-3 border-b border-gray-200">
                          <h5 className="font-bold text-gray-900 text-sm">
                            {courseFee.eligibility || `Course Option ${index + 1}`}
                          </h5>
                          {courseFee.hours && (
                            <p className="text-xs text-gray-600 mt-1">{courseFee.hours} hours training</p>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="grid md:grid-cols-3 gap-3">
                            {courseFee.normal_fee && (
                              <div className="p-3 bg-white rounded-lg border border-gray-200">
                                <p className="text-xs font-semibold text-gray-600 mb-1">Normal Rate</p>
                                <p className="text-base font-bold text-green-600">{courseFee.normal_fee}</p>
                              </div>
                            )}
                            {courseFee.sunday_fee && (
                              <div className="p-3 bg-white rounded-lg border border-amber-200">
                                <p className="text-xs font-semibold text-gray-600 mb-1">Sunday Rate</p>
                                <p className="text-base font-bold text-amber-600">{courseFee.sunday_fee}</p>
                              </div>
                            )}
                            {courseFee.shift_fee && (
                              <div className="p-3 bg-white rounded-lg border border-blue-200">
                                <p className="text-xs font-semibold text-gray-600 mb-1">Shift Rate</p>
                                <p className="text-base font-bold text-blue-600">{courseFee.shift_fee}</p>
                              </div>
                            )}
                          </div>
                          {courseFee.notes && (
                            <p className="text-xs text-gray-600 italic mt-3">{courseFee.notes}</p>
                          )}
                        </div>
                      </div>
                    );
                  }

                  if (isNestedCourseFee(courseFee)) {
                    return (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg overflow-hidden bg-gradient-to-r from-green-50 to-emerald-50"
                      >
                        <div className="px-4 py-3 border-b border-gray-200">
                          <h5 className="font-bold text-gray-900 text-sm">
                            {courseFee.category || `Course Category ${index + 1}`}
                          </h5>
                          {courseFee.min_age && (
                            <p className="text-xs text-gray-600 mt-1">Minimum Age: {courseFee.min_age}</p>
                          )}
                        </div>
                        <div className="p-4">
                          <div className="grid md:grid-cols-2 gap-3 mb-3">
                            {courseFee.regular_course_fees && (
                              <div className="p-3 bg-white rounded-lg border border-gray-200">
                                <p className="text-xs font-semibold text-gray-600 mb-1">Regular Course</p>
                                {Array.isArray(courseFee.regular_course_fees.total) ? (
                                  courseFee.regular_course_fees.total.map((total, idx) => (
                                    <p key={idx} className="text-base font-bold text-green-600">
                                      {formatCurrency(total)}
                                    </p>
                                  ))
                                ) : (
                                  <p className="text-base font-bold text-green-600">
                                    {formatCurrency(courseFee.regular_course_fees.total)}
                                  </p>
                                )}
                              </div>
                            )}
                            {courseFee.sunday_night_shift_fees && (
                              <div className="p-3 bg-white rounded-lg border border-amber-200">
                                <p className="text-xs font-semibold text-gray-600 mb-1">Sunday/Night Shift</p>
                                {Array.isArray(courseFee.sunday_night_shift_fees.total) ? (
                                  courseFee.sunday_night_shift_fees.total.map((total, idx) => (
                                    <p key={idx} className="text-base font-bold text-amber-600">
                                      {formatCurrency(total)}
                                    </p>
                                  ))
                                ) : (
                                  <p className="text-base font-bold text-amber-600">
                                    {formatCurrency(courseFee.sunday_night_shift_fees.total)}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                          {courseFee.notes && (
                            <p className="text-xs text-gray-600 italic">{courseFee.notes}</p>
                          )}
                        </div>
                      </div>
                    );
                  }

                  if (isRTAStyleCourseFee(courseFee)) {
                    const rtaTotal = courseFee.rta_fees?.reduce((sum, fee) => sum + fee.amount, 0) || 0;

                    return (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg overflow-hidden bg-gradient-to-r from-green-50 to-emerald-50"
                      >
                        <div className="px-4 py-3 border-b border-gray-200">
                          <h5 className="font-bold text-gray-900 text-sm">
                            {courseFee.category || `RTA Course ${index + 1}`}
                          </h5>
                        </div>
                        <div className="p-4 space-y-3">
                          {courseFee.training_rates && Object.keys(courseFee.training_rates).length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-gray-600 mb-2">Training Rates</p>
                              <div className="grid md:grid-cols-2 gap-2">
                                {Object.entries(courseFee.training_rates).map(([type, rate]) => (
                                  <div key={type} className="p-2 bg-white rounded-lg border border-gray-200 flex justify-between items-center">
                                    <span className="text-xs text-gray-600">{type}</span>
                                    <span className="text-xs font-bold text-green-600">
                                      {formatCurrency(rate)}/hr
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {courseFee.rta_fees && courseFee.rta_fees.length > 0 && (
                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <p className="text-xs font-semibold text-gray-600 mb-1">RTA Fees Total</p>
                              <p className="text-base font-bold text-blue-600">{formatCurrency(rtaTotal)}</p>
                            </div>
                          )}
                          {courseFee.notes && (
                            <p className="text-xs text-gray-600 italic">{courseFee.notes}</p>
                          )}
                        </div>
                      </div>
                    );
                  }

                  const pattern = detectFeePattern(courseFee);
                  return (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                    >
                      <p className="text-sm text-gray-600">
                        Unrecognized fee structure. Pattern: {pattern}
                      </p>
                      <pre className="text-xs mt-2 overflow-auto">{JSON.stringify(courseFee, null, 2)}</pre>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {fees.other_fees && fees.other_fees.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <CreditCard className="h-5 w-5 text-amber-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900">Other Fees</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-2 px-3 font-semibold text-gray-700 text-sm">Fee Type</th>
                      {(() => {
                        const columns = fees.other_fees.length > 0
                          ? Object.keys(fees.other_fees[0]).filter(key => key !== 'type')
                          : [];
                        return columns.map(col => (
                          <th key={col} className="text-right py-2 px-3 font-semibold text-gray-700 text-sm">
                            {col.toUpperCase()}
                          </th>
                        ));
                      })()}
                    </tr>
                  </thead>
                  <tbody>
                    {fees.other_fees.map((fee: OtherFee, index: number) => {
                      const columns = Object.keys(fee).filter(key => key !== 'type');
                      return (
                        <tr
                          key={index}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-2 px-3 text-gray-900 text-sm">{fee.type}</td>
                          {columns.map(col => {
                            const value = fee[col];
                            return (
                              <td key={col} className="py-2 px-3 text-right text-gray-700 font-medium text-sm">
                                {value !== null && value !== undefined
                                  ? typeof value === 'number'
                                    ? formatCurrency(value)
                                    : String(value)
                                  : '-'}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {fees.notes && typeof fees.notes === 'string' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
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
