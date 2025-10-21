import { CATEGORY_TYPES } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface LicenseBadgeProps {
  type: number | string;
  className?: string;
}

export function LicenseBadge({ type, className }: LicenseBadgeProps) {
  const categoryId = typeof type === 'string' ? parseInt(type, 10) : type;
  const config = CATEGORY_TYPES[categoryId];

  if (!config) return null;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
}
