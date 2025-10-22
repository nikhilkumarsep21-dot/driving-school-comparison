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
      return Object.entries(value)
        .map(([k, v]) => `${k}: ${String(v)}`)
        .join(', ');
    }
    return String(value);
  };

  const renderLectureDetails = () => {
    if (Array.isArray(lectureDetails)) {
      return (
        <div className="space-y-6">
          {lectureDetails.map((lecture: any, lectureIndex: number) => {
            if (typeof lecture === 'string') {
              return (
                <motion.div
                  key={lectureIndex}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: lectureIndex * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <Calendar className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-900">{lecture}</p>
                </motion.div>
              );
            }

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
              <motion.div
                key={lectureIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: lectureIndex * 0.1 }}
                className="bg-white rounded-lg border border-blue-200 p-6 space-y-4"
              >
                {titleItems.map(([key, value], index) => (
                  <div key={key}>
                    <h3 className="text-2xl font-bold text-gray-900">{renderValue(value)}</h3>
                  </div>
                ))}

                {typeItems.map(([key, value], index) => (
                  <div key={key}>
                    <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      {renderValue(value)}
                    </div>
                  </div>
                ))}

                {detailItems.length > 0 && (
                  <div className="space-y-3">
                    {detailItems.map(([key, value], index) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="flex gap-3"
                      >
                        <span className="font-medium text-gray-900 capitalize min-w-[140px]">
                          {key.replace(/_/g, ' ')}:
                        </span>
                        <span className="text-gray-700 flex-1">{renderValue(value)}</span>
                      </motion.div>
                    ))}
                  </div>
                )}

                {noteItems.map(([key, value], index) => (
                  <div key={key} className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-900 leading-relaxed">{renderValue(value)}</p>
                  </div>
                ))}
              </motion.div>
            );
          })}
        </div>
      );
    }

    if (typeof lectureDetails === 'object' && lectureDetails !== null) {
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
        <div className="bg-white rounded-lg border border-blue-200 p-6 space-y-4">
          {titleItems.map(([key, value], index) => (
            <div key={key}>
              <h3 className="text-2xl font-bold text-gray-900">{renderValue(value)}</h3>
            </div>
          ))}

          {typeItems.map(([key, value], index) => (
            <div key={key}>
              <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {renderValue(value)}
              </div>
            </div>
          ))}

          {detailItems.length > 0 && (
            <div className="space-y-3">
              {detailItems.map(([key, value], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex gap-3"
                >
                  <span className="font-medium text-gray-900 capitalize min-w-[140px]">
                    {key.replace(/_/g, ' ')}:
                  </span>
                  <span className="text-gray-700 flex-1">{renderValue(value)}</span>
                </motion.div>
              ))}
            </div>
          )}

          {noteItems.map(([key, value], index) => (
            <div key={key} className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-900 leading-relaxed">{renderValue(value)}</p>
            </div>
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
