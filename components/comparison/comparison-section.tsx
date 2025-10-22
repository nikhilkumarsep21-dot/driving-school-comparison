'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, LucideIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ComparisonSectionProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  colorClass?: string;
  bgClass?: string;
}

export function ComparisonSection({
  title,
  icon: Icon,
  children,
  defaultExpanded = false,
  colorClass = 'text-blue-600',
  bgClass = 'bg-blue-50',
}: ComparisonSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="border-t border-gray-200">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full flex items-center justify-between p-4 hover:${bgClass} transition-colors`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 ${bgClass} rounded-lg`}>
            <Icon className={`h-5 w-5 ${colorClass}`} />
          </div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-gray-50">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
