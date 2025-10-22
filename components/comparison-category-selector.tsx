'use client';

import { Category } from '@/lib/types';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ComparisonCategorySelectorProps {
  categories: Category[];
  selectedCategoryId: number | null;
  onSelectCategory: (categoryId: number | null) => void;
  branchAvailability?: Record<number, boolean>;
}

export function ComparisonCategorySelector({
  categories,
  selectedCategoryId,
  onSelectCategory,
  branchAvailability = {},
}: ComparisonCategorySelectorProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-soft border border-gray-200 overflow-hidden mb-6">
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gold-50 to-sand-50">
        <h3 className="font-bold text-gray-900">Select Course Category to Compare</h3>
        <p className="text-sm text-gray-600 mt-1">
          Choose a specific course type or view all available courses
        </p>
      </div>
      <div className="p-2">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onSelectCategory(null)}
            className={cn(
              'relative whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200',
              selectedCategoryId === null
                ? 'text-gold-900'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            )}
          >
            All Categories
            {selectedCategoryId === null && (
              <motion.div
                layoutId="activeCategoryTab"
                className="absolute inset-0 rounded-lg bg-gold-100 border-2 border-gold-500"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                style={{ zIndex: -1 }}
              />
            )}
          </button>

          {categories.map((category) => {
            const isSelected = category.id === selectedCategoryId;
            const availability = branchAvailability[category.id];
            const isPartiallyAvailable = availability === false;

            return (
              <button
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className={cn(
                  'relative whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200',
                  isSelected
                    ? 'text-gold-900'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                  isPartiallyAvailable && 'opacity-60'
                )}
              >
                <span className="flex items-center gap-2">
                  {category.name}
                  {isPartiallyAvailable && (
                    <span className="text-xs text-amber-600" title="Not available in all branches">
                      *
                    </span>
                  )}
                </span>
                {isSelected && (
                  <motion.div
                    layoutId="activeCategoryTab"
                    className="absolute inset-0 rounded-lg bg-gold-100 border-2 border-gold-500"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    style={{ zIndex: -1 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
