'use client';

import { BranchWithDetails, Detail, CourseFee, OtherFee } from '@/lib/types';
import { ComparisonRow, ComparisonEmptyCell } from './comparison-row';
import { Clock, DollarSign, CreditCard, Calendar } from 'lucide-react';
import {
  detectFeePattern,
  isSimpleCourseFee,
  isNestedCourseFee,
  isRTAStyleCourseFee,
  formatCurrency,
} from '@/lib/fee-utils';

interface FeesComparisonProps {
  branches: BranchWithDetails[];
  categoryId: number;
}

export function FeesComparison({ branches, categoryId }: FeesComparisonProps) {
  const getBranchDetail = (branch: BranchWithDetails): Detail | undefined => {
    return branch.details?.find((d) => d.category_id === categoryId);
  };

  const hasAnyFees = branches.some((branch) => !!getBranchDetail(branch)?.fees);

  if (!hasAnyFees) {
    return null;
  }

  const renderAllFees = (branch: BranchWithDetails) => {
    const detail = getBranchDetail(branch);
    const fees = detail?.fees;

    if (!fees || (!fees.timings && !fees.course_fees?.length && !fees.other_fees?.length)) {
      return <ComparisonEmptyCell message="Fee information not available" />;
    }

    return (
      <div className="space-y-4">
        {fees.timings && Object.keys(fees.timings).length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <h5 className="font-bold text-gray-900 text-xs">Training Timings</h5>
            </div>
            <div className="space-y-1">
              {Object.entries(fees.timings).map(([key, value]) => (
                <div key={key} className="bg-blue-50 rounded p-2 border border-blue-100">
                  <p className="font-semibold text-gray-900 text-xs">{key}</p>
                  <p className="text-xs text-gray-700">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {fees.course_fees && fees.course_fees.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <h5 className="font-bold text-gray-900 text-xs">Course Fees</h5>
            </div>
            <div className="space-y-2">
              {fees.course_fees.map((courseFee: CourseFee, index: number) => {
                if (isSimpleCourseFee(courseFee)) {
                  return (
                    <div
                      key={index}
                      className="bg-green-50 rounded p-2 border border-green-200 space-y-2"
                    >
                      {courseFee.eligibility && (
                        <p className="font-bold text-gray-900 text-xs">
                          {courseFee.eligibility}
                        </p>
                      )}
                      {courseFee.hours && (
                        <p className="text-xs text-gray-600">{courseFee.hours} hours</p>
                      )}
                      <div className="grid grid-cols-2 gap-1">
                        {courseFee.normal_fee && (
                          <div className="bg-white rounded p-1.5">
                            <p className="text-xs text-gray-600">Normal</p>
                            <p className="font-bold text-green-600 text-xs">
                              {courseFee.normal_fee}
                            </p>
                          </div>
                        )}
                        {courseFee.sunday_fee && (
                          <div className="bg-white rounded p-1.5">
                            <p className="text-xs text-gray-600">Sunday</p>
                            <p className="font-bold text-amber-600 text-xs">
                              {courseFee.sunday_fee}
                            </p>
                          </div>
                        )}
                      </div>
                      {courseFee.notes && (
                        <p className="text-xs text-gray-600 italic">{courseFee.notes}</p>
                      )}
                    </div>
                  );
                }

                if (isNestedCourseFee(courseFee)) {
                  return (
                    <div
                      key={index}
                      className="bg-green-50 rounded p-2 border border-green-200 space-y-2"
                    >
                      {courseFee.category && (
                        <p className="font-bold text-gray-900 text-xs">
                          {courseFee.category}
                        </p>
                      )}
                      <div className="space-y-1">
                        {courseFee.regular_course_fees && (
                          <div className="bg-white rounded p-1.5">
                            <p className="text-xs text-gray-600 mb-0.5">Regular Course</p>
                            {Array.isArray(courseFee.regular_course_fees.total) ? (
                              courseFee.regular_course_fees.total.map((total, idx) => (
                                <p key={idx} className="font-bold text-green-600 text-xs">
                                  {formatCurrency(total)}
                                </p>
                              ))
                            ) : (
                              <p className="font-bold text-green-600 text-xs">
                                {formatCurrency(courseFee.regular_course_fees.total)}
                              </p>
                            )}
                          </div>
                        )}
                        {courseFee.sunday_night_shift_fees && (
                          <div className="bg-white rounded p-1.5">
                            <p className="text-xs text-gray-600 mb-0.5">Sunday/Night</p>
                            {Array.isArray(courseFee.sunday_night_shift_fees.total) ? (
                              courseFee.sunday_night_shift_fees.total.map((total, idx) => (
                                <p key={idx} className="font-bold text-amber-600 text-xs">
                                  {formatCurrency(total)}
                                </p>
                              ))
                            ) : (
                              <p className="font-bold text-amber-600 text-xs">
                                {formatCurrency(courseFee.sunday_night_shift_fees.total)}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }

                if (isRTAStyleCourseFee(courseFee)) {
                  const rtaTotal =
                    courseFee.rta_fees?.reduce((sum, fee) => sum + fee.amount, 0) || 0;

                  return (
                    <div
                      key={index}
                      className="bg-green-50 rounded p-2 border border-green-200 space-y-2"
                    >
                      {courseFee.category && (
                        <p className="font-bold text-gray-900 text-xs">
                          {courseFee.category}
                        </p>
                      )}
                      {courseFee.training_rates &&
                        Object.keys(courseFee.training_rates).length > 0 && (
                          <div className="space-y-1">
                            <p className="text-xs font-semibold text-gray-600">
                              Training Rates
                            </p>
                            {Object.entries(courseFee.training_rates).map(
                              ([type, rate]) => (
                                <div
                                  key={type}
                                  className="bg-white rounded p-1.5 flex justify-between"
                                >
                                  <span className="text-xs text-gray-600">{type}</span>
                                  <span className="text-xs font-bold text-green-600">
                                    {formatCurrency(rate)}/hr
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        )}
                      {courseFee.rta_fees && courseFee.rta_fees.length > 0 && (
                        <div className="bg-blue-50 rounded p-1.5 border border-blue-200">
                          <p className="text-xs font-semibold text-gray-600 mb-0.5">
                            RTA Fees Total
                          </p>
                          <p className="font-bold text-blue-600 text-xs">
                            {formatCurrency(rtaTotal)}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                }

                const pattern = detectFeePattern(courseFee);
                return (
                  <div
                    key={index}
                    className="bg-gray-50 rounded p-2 border border-gray-200"
                  >
                    <p className="text-xs text-gray-600">
                      Fee structure available (Pattern: {pattern})
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {fees.other_fees && fees.other_fees.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="h-4 w-4 text-amber-600" />
              <h5 className="font-bold text-gray-900 text-xs">Other Fees</h5>
            </div>
            <div className="space-y-1">
              {fees.other_fees.map((fee: OtherFee, index: number) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-amber-50 rounded p-2 text-xs border border-amber-100"
                >
                  <span className="text-gray-700 font-medium">{fee.type}</span>
                  <span className="font-semibold text-gray-900">
                    {Object.entries(fee)
                      .filter(([key]) => key !== 'type')
                      .map(([key, value]) =>
                        value !== null && value !== undefined
                          ? typeof value === 'number'
                            ? formatCurrency(value)
                            : String(value)
                          : '-'
                      )
                      .join(', ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <tbody>
      <ComparisonRow
        label="Fees & Pricing"
        branches={branches}
        renderCell={renderAllFees}
      />
    </tbody>
  );
}
