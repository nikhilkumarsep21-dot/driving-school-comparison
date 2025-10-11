import { cn } from '@/lib/utils';

interface PriceDisplayProps {
  price: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PriceDisplay({
  price,
  label = 'From',
  size = 'md',
  className
}: PriceDisplayProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const labelSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className={cn('flex items-baseline gap-1', className)}>
      <span className={cn('text-gray-600', labelSizes[size])}>{label}</span>
      <span className={cn('font-bold text-gray-900', sizeClasses[size])}>
        AED {price.toLocaleString()}
      </span>
    </div>
  );
}
