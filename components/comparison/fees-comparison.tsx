'use client';

import { BranchWithDetails, Detail, CourseFee, OtherFee } from '@/lib/types';
import { ComparisonRow, ComparisonEmptyCell } from './comparison-row';
import { Clock, DollarSign, CreditCard, TrendingDown } from 'lucide-react';
import {
  detectFeePattern,
  isSimpleCourseFee,
  isNestedCourseFee,
  isRTAStyleCourseFee,
  formatCurrency,
  parseNumericValue,
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

  const renderTimings = (branch: BranchWithDetails) => {
    const detail = getBranchDetail(branch);
    const timings = detail?.fees?.timings;

    if (!timings || Object.keys(timings).length === 0) {
      return <ComparisonEmptyCell message="Timing information not available" />;
    }

    return (
      <div className="space-y-2">
        {Object.entries(timings).map(([key, value]) => (
          <div key={key} className="bg-blue-50 rounded p-2 border border-blue-100">
            <p className="font-semibold text-gray-900 text-xs">{key}</p>
            <p className="text-xs text-gray-700">{value}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderCourseFees = (branch: BranchWithDetails) => {
    const detail = getBranchDetail(branch);
    const courseFees = detail?.fees?.course_fees;

    if (!courseFees || courseFees.length === 0) {
      return <ComparisonEmptyCell message="Course fees not available" />;
    }

    return (
      <div className="space-y-3">
        {courseFees.map((courseFee: CourseFee, index: number) => {
          const pattern = detectFeePattern(courseFee);

          if (isSimpleCourseFee(courseFee)) {
            return (
              <div
                key={index}
                className="bg-green-50 rounded p-3 border border-green-200 space-y-2"
              >
                {courseFee.eligibility && (
                  <p className="font-bold text-gray-900 text-xs">
                    {courseFee.eligibility}
                  </p>
                )}
                {courseFee.hours && (
                  <p className="text-xs text-gray-600">{courseFee.hours} hours</p>
                )}
                <div className="grid grid-cols-2 gap-2">
                  {courseFee.normal_fee && (
                    <div className="bg-white rounded p-2">
                      <p className="text-xs text-gray-600">Normal</p>
                      <p className="font-bold text-green-600 text-sm">
                        {courseFee.normal_fee}
                      </p>
                    </div>
                  )}
                  {courseFee.sunday_fee && (
                    <div className="bg-white rounded p-2">
                      <p className="text-xs text-gray-600">Sunday</p>
                      <p className="font-bold text-amber-600 text-sm">
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
                className="bg-green-50 rounded p-3 border border-green-200 space-y-2"
              >
                {courseFee.category && (
                  <p className="font-bold text-gray-900 text-xs">
                    {courseFee.category}
                  </p>
                )}
                {courseFee.regular_course_fees && (
                  <div className="bg-white rounded p-2">
                    <p className="text-xs text-gray-600 mb-1">Regular Course</p>
                    {Array.isArray(courseFee.regular_course_fees.total) ? (
                      courseFee.regular_course_fees.total.map((total, idx) => (
                        <p key={idx} className="font-bold text-green-600 text-sm">
                          {formatCurrency(total)}
                        </p>
                      ))
                    ) : (
                      <p className="font-bold text-green-600 text-sm">
                        {formatCurrency(courseFee.regular_course_fees.total)}
                      </p>
                    )}
                  </div>
                )}
                {courseFee.sunday_night_shift_fees && (
                  <div className="bg-white rounded p-2">
                    <p className="text-xs text-gray-600 mb-1">Sunday/Night</p>
                    {Array.isArray(courseFee.sunday_night_shift_fees.total) ? (
                      courseFee.sunday_night_shift_fees.total.map((total, idx) => (
                        <p key={idx} className="font-bold text-amber-600 text-sm">
                          {formatCurrency(total)}
                        </p>
                      ))
                    ) : (
                      <p className="font-bold text-amber-600 text-sm">
                        {formatCurrency(courseFee.sunday_night_shift_fees.total)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          }

          if (isRTAStyleCourseFee(courseFee)) {
            const rtaTotal =
              courseFee.rta_fees?.reduce((sum, fee) => sum + fee.amount, 0) || 0;

            return (
              <div
                key={index}
                className="bg-green-50 rounded p-3 border border-green-200 space-y-2"
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
                            className="bg-white rounded p-2 flex justify-between"
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
                  <div className="bg-blue-50 rounded p-2 border border-blue-200">
                    <p className="text-xs font-semibold text-gray-600 mb-1">
                      RTA Fees Total
                    </p>
                    <p className="font-bold text-blue-600 text-sm">
                      {formatCurrency(rtaTotal)}
                    </p>
                  </div>
                )}
              </div>
            );
          }

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
    );
  };

  const findLowestPrice = (
    feeKey: string,
    branches: BranchWithDetails[]
  ): number | null => {
    const prices: number[] = [];

    branches.forEach((branch) => {
      const detail = getBranchDetail(branch);
      const courseFees = detail?.fees?.course_fees;

      if (courseFees) {
        courseFees.forEach((courseFee: CourseFee) => {
          if (feeKey in courseFee) {
            const value = (courseFee as any)[feeKey];
            const numericValue = parseNumericValue(value);
            if (numericValue !== null) {
              prices.push(numericValue);
            }
          }
        });
      }
    });

    return prices.length > 0 ? Math.min(...prices) : null;
  };

  const renderOtherFees = (branch: BranchWithDetails) => {
    const detail = getBranchDetail(branch);
    const otherFees = detail?.fees?.other_fees;

    if (!otherFees || otherFees.length === 0) {
      return <ComparisonEmptyCell message="Other fees not available" />;
    }

    return (
      <div className="space-y-1">
        {otherFees.map((fee: OtherFee, index: number) => (
          <div
            key={index}
            className="flex justify-between items-center bg-gray-50 rounded p-2 text-xs"
          >
            <span className="text-gray-700">{fee.type}</span>
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
    );
  };

  return (
    <tbody>
      <ComparisonRow
        label="Training Timings"
        branches={branches}
        renderCell={renderTimings}
      />
      <ComparisonRow
        label="Course Fees"
        branches={branches}
        renderCell={renderCourseFees}
      />
      <ComparisonRow
        label="Other Fees"
        branches={branches}
        renderCell={renderOtherFees}
      />
    </tbody>
  );
}
