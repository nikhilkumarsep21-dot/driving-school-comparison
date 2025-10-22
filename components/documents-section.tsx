'use client';

import { Detail } from '@/lib/types';
import { FileText } from 'lucide-react';
import { motion } from 'framer-motion';

interface DocumentsSectionProps {
  detail: Detail;
}

export function DocumentsSection({ detail }: DocumentsSectionProps) {
  const documents = detail.documents_required;

  if (!documents) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No document requirements available at this time.</p>
        <p className="text-sm text-gray-400 mt-2">Please contact the branch directly for document requirements.</p>
      </div>
    );
  }

  const renderDocuments = () => {
    if (Array.isArray(documents)) {
      return (
        <ul className="space-y-3 ml-6 list-disc marker:text-gold-600">
          {documents.map((doc: any, index: number) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="text-gray-900"
            >
              <div>
                <h4 className="font-bold text-gray-900 inline">
                  {typeof doc === 'string' ? doc : doc.name || doc.title || 'Required Document'}
                </h4>
                {typeof doc === 'object' && doc.type && (
                  <p className="text-sm font-semibold text-gray-600 mt-1">{doc.type}</p>
                )}
                {typeof doc === 'object' && doc.description && (
                  <p className="text-sm text-gray-700 mt-1">{doc.description}</p>
                )}
                {typeof doc === 'object' && doc.notes && (
                  <p className="text-sm text-gray-400 mt-1">{doc.notes}</p>
                )}
              </div>
            </motion.li>
          ))}
        </ul>
      );
    }

    if (typeof documents === 'object') {
      return (
        <div className="space-y-6">
          {Object.entries(documents).map(([category, items], catIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: catIndex * 0.1 }}
              className="space-y-3"
            >
              <h4 className="text-lg font-semibold text-gray-900 capitalize border-b border-gray-200 pb-2">
                {category.replace(/_/g, ' ')}
              </h4>
              <ul className="space-y-3 ml-6 list-disc marker:text-gold-600">
                {Array.isArray(items) ? (
                  items.map((item: any, itemIndex: number) => (
                    <li key={itemIndex} className="text-gray-900">
                      <div>
                        <h5 className="font-bold text-gray-900 inline">
                          {typeof item === 'string' ? item : item.name || item.title || 'Required Document'}
                        </h5>
                        {typeof item === 'object' && item.type && (
                          <p className="text-sm font-semibold text-gray-600 mt-1">{item.type}</p>
                        )}
                        {typeof item === 'object' && item.description && (
                          <p className="text-sm text-gray-700 mt-1">{item.description}</p>
                        )}
                        {typeof item === 'object' && item.notes && (
                          <p className="text-sm text-gray-400 mt-1">{item.notes}</p>
                        )}
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-900">
                    <span className="font-bold">{String(items)}</span>
                  </li>
                )}
              </ul>
            </motion.div>
          ))}
        </div>
      );
    }

    return (
      <p className="text-gray-700 ml-6">{String(documents)}</p>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="h-6 w-6 text-blue-700" />
          <h3 className="text-2xl font-bold text-gray-900">Required Documents</h3>
        </div>
        <p className="text-gray-600">Please ensure you have all the following documents before enrollment.</p>
      </div>

      {renderDocuments()}
    </div>
  );
}
