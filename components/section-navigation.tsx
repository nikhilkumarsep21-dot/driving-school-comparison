'use client';

import { cn } from '@/lib/utils';
import { FileText, BookOpen, Calendar, DollarSign } from 'lucide-react';

export type CourseSection = 'details' | 'documents' | 'lectures' | 'fees';

interface SectionNavigationProps {
  selectedSection: CourseSection;
  onSelectSection: (section: CourseSection) => void;
  availableSections?: {
    details: boolean;
    documents: boolean;
    lectures: boolean;
    fees: boolean;
  };
}

const sections = [
  { id: 'details' as CourseSection, label: 'Course Details', icon: BookOpen },
  { id: 'documents' as CourseSection, label: 'Documents Required', icon: FileText },
  { id: 'lectures' as CourseSection, label: 'Lecture Details', icon: Calendar },
  { id: 'fees' as CourseSection, label: 'Fees', icon: DollarSign },
];

export function SectionNavigation({
  selectedSection,
  onSelectSection,
  availableSections = { details: true, documents: true, lectures: true, fees: true },
}: SectionNavigationProps) {
  return (
    <div className="bg-gray-50 border-b border-gray-200 sticky top-0 z-20">
      <div className="flex overflow-x-auto scrollbar-hide">
        <div className="flex w-full">
          {sections.map((section) => {
            const isSelected = section.id === selectedSection;
            const isAvailable = availableSections[section.id];
            const Icon = section.icon;

            return (
              <button
                key={section.id}
                onClick={() => onSelectSection(section.id)}
                disabled={!isAvailable}
                className={cn(
                  'flex-1 min-w-fit whitespace-nowrap px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2',
                  isSelected
                    ? 'border-gold-500 text-gold-700 bg-white'
                    : isAvailable
                    ? 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    : 'border-transparent text-gray-400 cursor-not-allowed'
                )}
              >
                <div className="flex items-center justify-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span>{section.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
