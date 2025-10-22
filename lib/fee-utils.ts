import { CourseFee, SimpleCourseFee, NestedCourseFee, RTAStyleCourseFee } from './types';

export type FeePatternType = 'simple' | 'nested' | 'rta' | 'unknown';

export function detectFeePattern(courseFee: CourseFee): FeePatternType {
  if (!courseFee || typeof courseFee !== 'object') {
    return 'unknown';
  }

  if ('rta_fees' in courseFee || 'training_rates' in courseFee) {
    return 'rta';
  }

  if ('regular_course_fees' in courseFee || 'sunday_night_shift_fees' in courseFee) {
    return 'nested';
  }

  if ('normal_fee' in courseFee || 'sunday_fee' in courseFee) {
    return 'simple';
  }

  return 'unknown';
}

export function isSimpleCourseFee(courseFee: CourseFee): courseFee is SimpleCourseFee {
  return detectFeePattern(courseFee) === 'simple';
}

export function isNestedCourseFee(courseFee: CourseFee): courseFee is NestedCourseFee {
  return detectFeePattern(courseFee) === 'nested';
}

export function isRTAStyleCourseFee(courseFee: CourseFee): courseFee is RTAStyleCourseFee {
  return detectFeePattern(courseFee) === 'rta';
}

export function formatCurrency(value: number | string): string {
  if (typeof value === 'string') {
    return value;
  }

  return `AED ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function parseNumericValue(value: string | number): number | null {
  if (typeof value === 'number') {
    return value;
  }

  const match = value.match(/[\d,]+\.?\d*/);
  if (match) {
    return parseFloat(match[0].replace(/,/g, ''));
  }

  return null;
}

export function formatFieldLabel(fieldKey: string): string {
  return fieldKey
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getFieldPriority(fieldKey: string): number {
  const priorities: Record<string, number> = {
    'category': 100,
    'hours': 90,
    'duration': 85,
    'eligibility': 80,
    'min_age': 80,
    'road_training': 75,
    'internal_training': 75,
    'total_hours': 70,
    'normal_fee': 60,
    'sunday_fee': 55,
    'shift_fee': 55,
    'regular_course_fees': 60,
    'sunday_night_shift_fees': 55,
    'rta_fees': 65,
    'training_rates': 60,
    'notes': 10
  };

  return priorities[fieldKey] || 50;
}

export function sortFieldsByPriority(fields: string[]): string[] {
  return [...fields].sort((a, b) => getFieldPriority(b) - getFieldPriority(a));
}
