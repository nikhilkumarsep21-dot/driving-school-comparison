'use client';

import { Detail, Category } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { BookOpen, Clock, GraduationCap, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface CourseDetailsSectionProps {
  detail: Detail;
  category: Category;
}

export function CourseDetailsSection({ detail, category }: CourseDetailsSectionProps) {
  const courseDetails = detail.course_details;

  if (!courseDetails) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No course details available at this time.</p>
        <p className="text-sm text-gray-400 mt-2">Please contact the branch directly for more information.</p>
      </div>
    );
  }

  const renderValue = (value: any): string => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  const renderDetailCard = (key: string, value: any, index: number) => {
    const icons: Record<string, any> = {
      duration: Clock,
      hours: Clock,
      lessons: BookOpen,
      theory: GraduationCap,
      practical: GraduationCap,
      default: Info,
    };

    const IconComponent = icons[key.toLowerCase()] || icons.default;

    return (
      <motion.div
        key={key}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
      >
        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold-100">
              <IconComponent className="h-5 w-5 text-gold-700" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-500 mb-1 capitalize">
                {key.replace(/_/g, ' ')}
              </h4>
              <p className="text-base font-semibold text-gray-900 break-words">
                {renderValue(value)}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-gold-50 to-sand-50 rounded-xl p-6 border border-gold-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{category.name}</h3>
        {category.description && (
          <p className="text-gray-600">{category.description}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(courseDetails).map(([key, value], index) =>
          renderDetailCard(key, value, index)
        )}
      </div>
    </div>
  );
}
