'use client';

import React from 'react';
import { Detail } from '@/lib/types';
import { Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface LectureDetailsSectionProps {
  detail: Detail;
}

export function LectureDetailsSection({ detail }: LectureDetailsSectionProps) {
  const lectureDetails = detail.lecture_details;

  if (!lectureDetails) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No lecture details available at this time.</p>
        <p className="text-sm text-gray-400 mt-2">Please contact the branch directly for lecture schedules.</p>
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
    const isType = lowerKey.includes('type') || lowerKey.includes('format');
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

  const renderLectureDetails = () => {
    if (typeof lectureDetails === 'object' && !Array.isArray(lectureDetails)) {
      const entries = Object.entries(lectureDetails);
      const titleItems = entries.filter(([key]) => key.toLowerCase().includes('title') || key.toLowerCase().includes('name'));
      const typeItems = entries.filter(([key]) => key.toLowerCase().includes('type') || key.toLowerCase().includes('format'));
      const noteItems = entries.filter(([key]) => key.toLowerCase().includes('note') || key.toLowerCase().includes('remark') || key.toLowerCase().includes('info'));
      const detailItems = entries.filter(([key]) => {
        const lowerKey = key.toLowerCase();
        return !lowerKey.includes('title') && !lowerKey.includes('name') &&
               !lowerKey.includes('type') && !lowerKey.includes('format') &&
               !lowerKey.includes('note') && !lowerKey.includes('remark') && !lowerKey.includes('info');
      });

      return (
        <div className="space-y-4">
          {titleItems.map(([key, value], index) => renderDetailItem(key, value, index))}
          {typeItems.map(([key, value], index) => renderDetailItem(key, value, index + titleItems.length))}

          {detailItems.length > 0 && (
            <ul className="space-y-3 ml-6 list-disc marker:text-blue-600">
              {detailItems.map(([key, value], index) => renderDetailItem(key, value, index + titleItems.length + typeItems.length))}
            </ul>
          )}

          {noteItems.map(([key, value], index) => renderDetailItem(key, value, index + titleItems.length + typeItems.length + detailItems.length))}
        </div>
      );
    }

    if (Array.isArray(lectureDetails)) {
      return (
        <div className="space-y-6">
          {lectureDetails.map((lecture: any, lectureIndex: number) => (
            <motion.div
              key={lectureIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: lectureIndex * 0.1 }}
              className="space-y-4"
            >
              {typeof lecture === 'string' ? (
                <p className="text-gray-900">{lecture}</p>
              ) : (
                (() => {
                  const entries = Object.entries(lecture);
                  const titleItems = entries.filter(([key]) => key.toLowerCase().includes('title') || key.toLowerCase().includes('name'));
                  const typeItems = entries.filter(([key]) => key.toLowerCase().includes('type') || key.toLowerCase().includes('format'));
                  const noteItems = entries.filter(([key]) => key.toLowerCase().includes('note') || key.toLowerCase().includes('remark') || key.toLowerCase().includes('info'));
                  const detailItems = entries.filter(([key]) => {
                    const lowerKey = key.toLowerCase();
                    return !lowerKey.includes('title') && !lowerKey.includes('name') &&
                           !lowerKey.includes('type') && !lowerKey.includes('format') &&
                           !lowerKey.includes('note') && !lowerKey.includes('remark') && !lowerKey.includes('info');
                  });

                  return (
                    <div className="space-y-4">
                      {titleItems.map(([key, value], index) => renderDetailItem(key, value, index))}
                      {typeItems.map(([key, value], index) => renderDetailItem(key, value, index + titleItems.length))}

                      {detailItems.length > 0 && (
                        <ul className="space-y-3 ml-6 list-disc marker:text-blue-600">
                          {detailItems.map(([key, value], index) => renderDetailItem(key, value, index + titleItems.length + typeItems.length))}
                        </ul>
                      )}

                      {noteItems.map(([key, value], index) => renderDetailItem(key, value, index + titleItems.length + typeItems.length + detailItems.length))}
                    </div>
                  );
                })()
              )}
            </motion.div>
          ))}
        </div>
      );
    }

    return (
      <p className="text-gray-700">{String(lectureDetails)}</p>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="h-6 w-6 text-blue-700" />
          <h3 className="text-2xl font-bold text-gray-900">Lecture Details</h3>
        </div>
        <p className="text-gray-600">Information about class schedules, instructors, and lecture format.</p>
      </div>

      {renderLectureDetails()}
    </div>
  );
}
