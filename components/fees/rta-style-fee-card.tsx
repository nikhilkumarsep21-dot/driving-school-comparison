'use client';

import { RTAStyleCourseFee } from '@/lib/types';
import { formatCurrency } from '@/lib/fee-utils';
import { motion } from 'framer-motion';
import { FileText, DollarSign } from 'lucide-react';

interface RTAStyleFeeCardProps {
  courseFee: RTAStyleCourseFee;
  index: number;
}

export function RTAStyleFeeCard({ courseFee, index }: RTAStyleFeeCardProps) {
  const rtaTotal = courseFee.rta_fees?.reduce((sum, fee) => sum + fee.amount, 0) || 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="border border-gray-200 rounded-lg overflow-hidden"
    >
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 border-b border-gray-200">
        <h5 className="font-bold text-gray-900">{courseFee.category || `Course ${index + 1}`}</h5>
      </div>

      <div className="p-4 space-y-6">
        {courseFee.training_rates && Object.keys(courseFee.training_rates).length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="h-5 w-5 text-green-600" />
              <h6 className="font-semibold text-gray-900">Training Rates</h6>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {Object.entries(courseFee.training_rates).map(([rateType, rate]) => (
                <div key={rateType} className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-gray-600 mb-1">{rateType}</p>
                  <p className="text-lg font-bold text-green-600">{formatCurrency(rate)}</p>
                  <p className="text-xs text-gray-500 mt-1">per hour</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {courseFee.rta_fees && courseFee.rta_fees.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-5 w-5 text-blue-600" />
              <h6 className="font-semibold text-gray-900">RTA & Registration Fees</h6>
            </div>
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <div className="divide-y divide-gray-200">
                {courseFee.rta_fees.map((fee, idx) => (
                  <div key={idx} className="flex justify-between items-center px-4 py-3 hover:bg-gray-100 transition-colors">
                    <span className="text-sm text-gray-700">{fee.type}</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(fee.amount)}</span>
                  </div>
                ))}
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-t-2 border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total RTA Fees</span>
                  <span className="text-xl font-bold text-blue-600">{formatCurrency(rtaTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {courseFee.notes && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 italic">{courseFee.notes}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
