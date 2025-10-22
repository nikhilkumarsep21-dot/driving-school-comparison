'use client';

import React from 'react';
import { Detail } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Calendar, Clock, User, MapPin, BookOpen } from 'lucide-react';
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

  const getIconForKey = (key: string) => {
    const lowerKey = key.toLowerCase();
    if (lowerKey.includes('schedule') || lowerKey.includes('time') || lowerKey.includes('day')) {
      return Calendar;
    }
    if (lowerKey.includes('duration') || lowerKey.includes('hour')) {
      return Clock;
    }
    if (lowerKey.includes('instructor') || lowerKey.includes('teacher')) {
      return User;
    }
    if (lowerKey.includes('location') || lowerKey.includes('room') || lowerKey.includes('venue')) {
      return MapPin;
    }
    return BookOpen;
  };

  const renderValue = (value: any): string => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  const renderLectureCard = (key: string, value: any, index: number) => {
    const IconComponent = getIconForKey(key);

    return (
      <motion.div
        key={key}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
      >
        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
              <IconComponent className="h-5 w-5 text-blue-700" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-500 mb-1 capitalize">
                {key.replace(/_/g, ' ')}
              </h4>
              <p className="text-base font-semibold text-gray-900 break-words whitespace-pre-wrap">
                {renderValue(value)}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  const renderLectureDetails = () => {
    if (typeof lectureDetails === 'object' && !Array.isArray(lectureDetails)) {
      return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {Object.entries(lectureDetails).map(([key, value], index) =>
            renderLectureCard(key, value, index)
          )}
        </div>
      );
    }

    if (Array.isArray(lectureDetails)) {
      return (
        <div className="space-y-4">
          {lectureDetails.map((lecture: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-md transition-shadow">
                {typeof lecture === 'string' ? (
                  <p className="text-gray-900">{lecture}</p>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {Object.entries(lecture).map(([key, value]) => (
                      <div key={key} className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                          {React.createElement(getIconForKey(key), {
                            className: 'h-4 w-4 text-blue-700',
                          })}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-medium text-gray-500 capitalize">
                            {key.replace(/_/g, ' ')}
                          </h5>
                          <p className="text-sm font-semibold text-gray-900 break-words">
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
      <Card className="p-6 bg-gray-50">
        <p className="text-gray-700">{String(lectureDetails)}</p>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
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
