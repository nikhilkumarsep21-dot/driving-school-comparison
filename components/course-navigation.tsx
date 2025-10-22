'use client';

import { Category } from '@/lib/types';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CourseNavigationProps {
  categories: Category[];
  selectedCategoryId: number;
  onSelectCategory: (categoryId: number) => void;
}

export function CourseNavigation({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CourseNavigationProps) {
  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="relative">
        <div className="flex overflow-x-auto scrollbar-hide">
          <div className="flex space-x-1 p-2">
            {categories.map((category) => {
              const isSelected = category.id === selectedCategoryId;
              return (
                <button
                  key={category.id}
                  onClick={() => onSelectCategory(category.id)}
                  className={cn(
                    'relative whitespace-nowrap rounded-lg px-6 py-3 text-sm font-medium transition-all duration-200',
                    isSelected
                      ? 'text-gold-900'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  )}
                >
                  {category.name}
                  {isSelected && (
                    <motion.div
                      layoutId="activeTab"
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
    </div>
  );
}
