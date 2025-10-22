'use client';

import { Detail } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { DollarSign, CheckCircle, Info, Tag } from 'lucide-react';
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

  const isCurrencyField = (key: string): boolean => {
    const currencyKeywords = ['price', 'fee', 'cost', 'amount', 'total', 'charge', 'payment'];
    return currencyKeywords.some((keyword) => key.toLowerCase().includes(keyword));
  };

  const renderFeeCard = (key: string, value: any, index: number) => {
    const isCurrency = isCurrencyField(key);

    return (
      <motion.div
        key={key}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
      >
        <Card className="p-6 hover:shadow-md transition-shadow border-l-4 border-l-green-500">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100">
              {isCurrency ? (
                <DollarSign className="h-5 w-5 text-green-700" />
              ) : (
                <Tag className="h-5 w-5 text-green-700" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-500 mb-1 capitalize">
                {key.replace(/_/g, ' ')}
              </h4>
              <p className={`text-lg font-bold break-words ${isCurrency ? 'text-green-700' : 'text-gray-900'}`}>
                {renderValue(value)}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  const renderFeesStructure = () => {
    if (typeof fees === 'object' && !Array.isArray(fees)) {
      const feeEntries = Object.entries(fees);
      const mainFees = feeEntries.filter(([key]) => isCurrencyField(key));
      const otherInfo = feeEntries.filter(([key]) => !isCurrencyField(key));

      return (
        <div className="space-y-6">
          {mainFees.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Pricing
              </h4>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {mainFees.map(([key, value], index) => renderFeeCard(key, value, index))}
              </div>
            </div>
          )}

          {otherInfo.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-600" />
                Additional Information
              </h4>
              <div className="grid gap-4 sm:grid-cols-2">
                {otherInfo.map(([key, value], index) => renderFeeCard(key, value, index + mainFees.length))}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (Array.isArray(fees)) {
      return (
        <div className="space-y-4">
          {fees.map((feeItem: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-md transition-shadow border-l-4 border-l-green-500">
                {typeof feeItem === 'string' ? (
                  <p className="text-gray-900 font-medium">{feeItem}</p>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {Object.entries(feeItem).map(([key, value]) => (
                      <div key={key} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm font-medium text-gray-500 capitalize">
                            {key.replace(/_/g, ' ')}
                          </h5>
                          <p className="text-base font-semibold text-gray-900 break-words">
                            {renderValue(value)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      );
    }

    return (
      <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <div className="text-center">
          <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <p className="text-2xl font-bold text-green-700">{renderValue(fees)}</p>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
        <div className="flex items-center gap-3 mb-2">
          <DollarSign className="h-6 w-6 text-green-700" />
          <h3 className="text-2xl font-bold text-gray-900">Course Fees</h3>
        </div>
        <p className="text-gray-600">Detailed pricing information and payment structure for this course.</p>
      </div>

      {renderFeesStructure()}

      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Note</h4>
            <p className="text-sm text-gray-700">
              Fees are subject to change. Please contact the branch directly to confirm current pricing and available payment plans.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
