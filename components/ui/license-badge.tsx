import { LicenseType } from '@/lib/types';
import { LICENSE_TYPES } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface LicenseBadgeProps {
  type: LicenseType;
  className?: string;
}

export function LicenseBadge({ type, className }: LicenseBadgeProps) {
  const config = LICENSE_TYPES[type];

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
