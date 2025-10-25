export function formatCurrency(value: number | string): string {
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, '')) : value;
  return `AED ${numValue.toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatFieldLabel(fieldName: string): string {
  return fieldName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function sortFieldsByPriority(fields: string[]): string[] {
  return fields.sort();
}

export function detectFeePattern(fee: any): string {
  return 'unknown';
}
