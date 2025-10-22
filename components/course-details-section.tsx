'use client';

import { Detail, Category } from '@/lib/types';
import { BookOpen, CheckCircle2, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface CourseDetailsSectionProps {
  detail: Detail;
  category: Category;
}

interface CourseSection {
  type?: string;
  title?: string;
  details?: string[];
  notes?: string;
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

  const isArrayFormat = Array.isArray(courseDetails);

  if (isArrayFormat) {
    const sections = courseDetails as CourseSection[];

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-gold-50 to-sand-50 rounded-xl p-6 border border-gold-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{category.name}</h3>
          {category.description && (
            <p className="text-gray-600">{category.description}</p>
          )}
        </div>

        <div className="space-y-8">
          {sections.map((section, sectionIndex) => (
            <motion.div
              key={sectionIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: sectionIndex * 0.1 }}
              className="space-y-4"
            >
              {section.type && (
                <div className="inline-block px-3 py-1 bg-gold-100 text-gold-800 text-sm font-medium rounded-full">
                  {section.type}
                </div>
              )}

              {section.title && (
                <h4 className="text-xl font-bold text-gray-900">{section.title}</h4>
              )}

              {section.details && section.details.length > 0 && (
                <ul className="space-y-3">
                  {section.details.map((item, itemIndex) => (
                    <motion.li
                      key={itemIndex}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: (sectionIndex * 0.1) + (itemIndex * 0.05) }}
                      className="flex items-start gap-3 text-gray-700"
                    >
                      <CheckCircle2 className="h-5 w-5 text-gold-600 mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              )}

              {section.notes && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: (sectionIndex * 0.1) + 0.2 }}
                  className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-900 leading-relaxed">{section.notes}</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
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

  const renderDetailItem = (key: string, value: any, index: number) => {
    const lowerKey = key.toLowerCase();
    const isTitle = lowerKey.includes('title') || lowerKey.includes('name');
    const isType = lowerKey.includes('type') || lowerKey.includes('category');
    const isNote = lowerKey.includes('note') || lowerKey.includes('remark') || lowerKey.includes('info');

    if (isTitle) {
      return (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="mb-6"
        >
          <h3 className="text-2xl font-bold text-gray-900">{renderValue(value)}</h3>
        </motion.div>
      );
    }

    if (isType) {
      return (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="mb-4"
        >
          <h4 className="text-lg font-semibold text-gray-700">{renderValue(value)}</h4>
        </motion.div>
      );
    }

    if (isNote) {
      return (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="mt-6"
        >
          <p className="text-sm text-gray-500 leading-relaxed">{renderValue(value)}</p>
        </motion.div>
      );
    }

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

  const entries = Object.entries(courseDetails);
  const titleItems = entries.filter(([key]) => key.toLowerCase().includes('title') || key.toLowerCase().includes('name'));
  const typeItems = entries.filter(([key]) => key.toLowerCase().includes('type') || key.toLowerCase().includes('category'));
  const noteItems = entries.filter(([key]) => key.toLowerCase().includes('note') || key.toLowerCase().includes('remark') || key.toLowerCase().includes('info'));
  const detailItems = entries.filter(([key]) => {
    const lowerKey = key.toLowerCase();
    return !lowerKey.includes('title') && !lowerKey.includes('name') &&
           !lowerKey.includes('type') && !lowerKey.includes('category') &&
           !lowerKey.includes('note') && !lowerKey.includes('remark') && !lowerKey.includes('info');
  });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-gold-50 to-sand-50 rounded-xl p-6 border border-gold-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{category.name}</h3>
        {category.description && (
          <p className="text-gray-600">{category.description}</p>
        )}
      </div>

      <div className="space-y-4">
        {titleItems.map(([key, value], index) => renderDetailItem(key, value, index))}
        {typeItems.map(([key, value], index) => renderDetailItem(key, value, index + titleItems.length))}

        {detailItems.length > 0 && (
          <ul className="space-y-3 ml-6 list-disc marker:text-gold-600">
            {detailItems.map(([key, value], index) => renderDetailItem(key, value, index + titleItems.length + typeItems.length))}
          </ul>
        )}

        {noteItems.map(([key, value], index) => renderDetailItem(key, value, index + titleItems.length + typeItems.length + detailItems.length))}
      </div>
    </div>
  );
}
