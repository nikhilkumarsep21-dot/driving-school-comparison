'use client';

import { Detail } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { FileText, CheckCircle2, AlertCircle } from 'lucide-react';
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
        <div className="grid gap-4 sm:grid-cols-2">
          {documents.map((doc: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="p-5 hover:shadow-md transition-shadow border-l-4 border-l-gold-500">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-gold-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {typeof doc === 'string' ? doc : doc.name || doc.title || 'Required Document'}
                    </p>
                    {typeof doc === 'object' && doc.description && (
                      <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                    )}
                    {typeof doc === 'object' && doc.notes && (
                      <p className="text-xs text-gray-500 mt-1 italic">{doc.notes}</p>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
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
              <div className="grid gap-4 sm:grid-cols-2">
                {Array.isArray(items) ? (
                  items.map((item: any, itemIndex: number) => (
                    <Card key={itemIndex} className="p-5 hover:shadow-md transition-shadow border-l-4 border-l-gold-500">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-gold-600 shrink-0 mt-0.5" />
                        <p className="font-medium text-gray-900">
                          {typeof item === 'string' ? item : item.name || item.title || 'Required Document'}
                        </p>
                      </div>
                    </Card>
                  ))
                ) : (
                  <Card className="p-5 hover:shadow-md transition-shadow border-l-4 border-l-gold-500">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-gold-600 shrink-0 mt-0.5" />
                      <p className="font-medium text-gray-900">{String(items)}</p>
                    </div>
                  </Card>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      );
    }

    return (
      <Card className="p-6 bg-gray-50">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-gray-500 shrink-0 mt-0.5" />
          <p className="text-gray-700">{String(documents)}</p>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
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
