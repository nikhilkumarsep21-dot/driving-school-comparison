import { Skeleton } from './skeleton';

export function LoadingCard() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-soft">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="space-y-4 p-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </div>
  );
}
