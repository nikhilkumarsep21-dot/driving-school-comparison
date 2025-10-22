import { formatCurrency, formatFieldLabel } from '@/lib/fee-utils';

interface DynamicFieldRendererProps {
  fieldKey: string;
  value: any;
  className?: string;
}

export function DynamicFieldRenderer({ fieldKey, value, className = '' }: DynamicFieldRendererProps) {
  if (value === null || value === undefined) {
    return null;
  }

  const shouldSkip = ['notes', 'category', 'regular_course_fees', 'sunday_night_shift_fees', 'rta_fees', 'training_rates'].includes(fieldKey);
  if (shouldSkip) {
    return null;
  }

  const renderValue = () => {
    if (typeof value === 'string') {
      return <span className="text-gray-700">{value}</span>;
    }

    if (typeof value === 'number') {
      return <span className="font-medium text-gray-900">{value}</span>;
    }

    if (Array.isArray(value)) {
      return (
        <div className="flex flex-wrap gap-2">
          {value.map((item, idx) => (
            <span key={idx} className="inline-flex items-center px-2 py-1 bg-gray-100 rounded text-sm text-gray-700">
              {typeof item === 'object' ? JSON.stringify(item) : String(item)}
            </span>
          ))}
        </div>
      );
    }

    if (typeof value === 'object') {
      return (
        <div className="space-y-1 text-sm">
          {Object.entries(value).map(([key, val]) => (
            <div key={key} className="flex justify-between">
              <span className="text-gray-600">{formatFieldLabel(key)}:</span>
              <span className="font-medium text-gray-900">{String(val)}</span>
            </div>
          ))}
        </div>
      );
    }

    return <span className="text-gray-700">{String(value)}</span>;
  };

  return (
    <div className={`flex items-start gap-2 ${className}`}>
      <span className="text-sm font-medium text-gray-600 min-w-[140px]">{formatFieldLabel(fieldKey)}:</span>
      <div className="flex-1">{renderValue()}</div>
    </div>
  );
}
