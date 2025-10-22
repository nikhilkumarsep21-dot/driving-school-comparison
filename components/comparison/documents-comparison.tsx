'use client';

import { BranchWithDetails, Detail } from '@/lib/types';
import { ComparisonRow, ComparisonEmptyCell } from './comparison-row';
import { FileText, Check } from 'lucide-react';

interface DocumentsComparisonProps {
  branches: BranchWithDetails[];
  categoryId: number;
}

export function DocumentsComparison({
  branches,
  categoryId,
}: DocumentsComparisonProps) {
  const getBranchDetail = (branch: BranchWithDetails): Detail | undefined => {
    return branch.details?.find((d) => d.category_id === categoryId);
  };

  const hasAnyDocuments = branches.some(
    (branch) => !!getBranchDetail(branch)?.documents_required
  );

  if (!hasAnyDocuments) {
    return null;
  }

  const renderDocuments = (branch: BranchWithDetails) => {
    const detail = getBranchDetail(branch);
    const documents = detail?.documents_required;

    if (!documents) {
      return <ComparisonEmptyCell message="Document requirements not available" />;
    }

    if (Array.isArray(documents)) {
      return (
        <div className="space-y-2">
          {documents.map((doc: any, index: number) => {
            if (typeof doc === 'string') {
              return (
                <div key={index} className="flex items-start gap-2 text-xs">
                  <Check className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-900">{doc}</span>
                </div>
              );
            }

            const docName =
              doc.name || doc.title || doc.document;
            return (
              <div
                key={index}
                className="bg-gray-50 rounded p-2 border border-gray-200 space-y-1"
              >
                <div className="flex items-start gap-2">
                  <FileText className="h-3 w-3 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    {docName && (
                      <p className="font-semibold text-gray-900 text-xs">{docName}</p>
                    )}
                    {doc.type && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {doc.type}
                      </span>
                    )}
                    {doc.description && (
                      <p className="text-xs text-gray-600 mt-1">{doc.description}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    if (typeof documents === 'object' && documents !== null) {
      return (
        <div className="space-y-3">
          {Object.entries(documents).map(([category, items]) => (
            <div key={category} className="space-y-2">
              <h5 className="text-xs font-bold text-gray-900 capitalize border-b border-gray-200 pb-1">
                {category.replace(/_/g, ' ')}
              </h5>
              {Array.isArray(items) ? (
                <div className="space-y-1 ml-2">
                  {items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <Check className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-900">
                        {typeof item === 'string' ? item : item.name || item.title}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-700 ml-2">{String(items)}</p>
              )}
            </div>
          ))}
        </div>
      );
    }

    return <p className="text-xs text-gray-700">{String(documents)}</p>;
  };

  return (
    <tbody>
      <ComparisonRow
        label="Required Documents"
        branches={branches}
        renderCell={renderDocuments}
      />
    </tbody>
  );
}
