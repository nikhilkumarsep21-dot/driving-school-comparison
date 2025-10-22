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
        <div className="space-y-3">
          {documents.map((doc: any, index: number) => {
            if (typeof doc === 'string') {
              return (
                <div key={index} className="flex items-start gap-2 text-xs">
                  <Check className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-900">{doc}</span>
                </div>
              );
            }

            const docType = doc.type || doc.category;
            const docList = doc.documents || [];
            const docNotes = doc.notes || doc.additional_info || doc.remarks;

            return (
              <div
                key={index}
                className="bg-gray-50 rounded p-2 border border-gray-200 space-y-2"
              >
                {docType && (
                  <div className="flex items-center gap-2">
                    <FileText className="h-3 w-3 text-blue-600 flex-shrink-0" />
                    <p className="font-semibold text-gray-900 text-xs">{docType}</p>
                  </div>
                )}
                {Array.isArray(docList) && docList.length > 0 && (
                  <ul className="space-y-1 ml-5">
                    {docList.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-1.5 text-xs text-gray-700">
                        <span className="text-blue-600 mt-0.5 flex-shrink-0">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {docNotes && (
                  <div className="mt-2 p-1.5 bg-amber-50 border border-amber-200 rounded">
                    <p className="text-xs text-amber-900">{docNotes}</p>
                  </div>
                )}
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
