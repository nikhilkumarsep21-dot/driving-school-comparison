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

  const renderDocuments = () => {
    if (Array.isArray(documents)) {
      return (
        <div className="space-y-6">
          {documents.map((doc: any, index: number) => {
            if (typeof doc === 'string') {
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <FileText className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-900">{doc}</p>
                </motion.div>
              );
            }

            const docType = doc.type || doc.category;
            const docNotes = doc.notes || doc.additional_info || doc.remarks;
            const docList = doc.documents || [];

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-lg border border-gray-200 p-5 space-y-3 hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  {docType && (
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <h4 className="text-lg font-bold text-gray-900">{docType}</h4>
                    </div>
                  )}

                  {Array.isArray(docList) && docList.length > 0 && (
                    <ul className="space-y-2 ml-7">
                      {docList.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-700 leading-relaxed">
                          <span className="text-blue-600 mt-1.5 flex-shrink-0">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {docNotes && (
                    <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg ml-7">
                      <p className="text-sm text-amber-900 leading-relaxed">{docNotes}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      );
    }

    if (typeof documents === 'object' && documents !== null) {
      return (
        <div className="space-y-6">
          {Object.entries(documents).map(([category, items], catIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: catIndex * 0.1 }}
              className="space-y-4"
            >
              <h4 className="text-xl font-bold text-gray-900 capitalize border-b-2 border-blue-200 pb-2">
                {category.replace(/_/g, ' ')}
              </h4>

              {Array.isArray(items) ? (
                <div className="space-y-4">
                  {items.map((item: any, itemIndex: number) => {
                    if (typeof item === 'string') {
                      return (
                        <div key={itemIndex} className="flex items-start gap-3 ml-4">
                          <FileText className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-900">{item}</p>
                        </div>
                      );
                    }

                    const itemName = item.name || item.title || item.document;
                    const itemType = item.type || item.category;
                    const itemDescription = item.description || item.details;
                    const itemNotes = item.notes || item.additional_info || item.remarks;

                    return (
                      <div key={itemIndex} className="bg-white rounded-lg border border-gray-200 p-4 space-y-2">
                        <div className="flex items-start gap-3">
                          <FileText className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 space-y-2">
                            {itemName && (
                              <h5 className="font-bold text-gray-900">{itemName}</h5>
                            )}

                            {itemType && (
                              <div className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                {itemType}
                              </div>
                            )}

                            {itemDescription && (
                              <p className="text-sm text-gray-700 leading-relaxed">{itemDescription}</p>
                            )}

                            {typeof item === 'object' && Object.keys(item).length > 0 && (
                              <div className="space-y-1 mt-2">
                                {Object.entries(item)
                                  .filter(([key]) =>
                                    !['name', 'title', 'document', 'type', 'category', 'description', 'details', 'notes', 'additional_info', 'remarks'].includes(key)
                                  )
                                  .map(([key, value]) => (
                                    <div key={key} className="flex gap-2">
                                      <span className="text-xs font-medium text-gray-600 capitalize">
                                        {key.replace(/_/g, ' ')}:
                                      </span>
                                      <span className="text-xs text-gray-700">{renderValue(value)}</span>
                                    </div>
                                  ))
                                }
                              </div>
                            )}

                            {itemNotes && (
                              <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded">
                                <p className="text-xs text-amber-900 leading-relaxed">{itemNotes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : typeof items === 'object' && items !== null ? (
                <div className="ml-4 space-y-2">
                  {Object.entries(items).map(([key, value]) => (
                    <div key={key} className="flex gap-2">
                      <span className="font-medium text-gray-900 capitalize">{key.replace(/_/g, ' ')}:</span>
                      <span className="text-gray-700">{renderValue(value)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-start gap-3 ml-4">
                  <FileText className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-900">{String(items)}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      );
    }

    return (
      <p className="text-gray-700">{String(documents)}</p>
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
