export const LICENSE_TYPES = {
  motorcycle: { label: 'Motorcycle', color: 'bg-orange-100 text-orange-800 border border-orange-200' },
  light_vehicle: { label: 'Light Vehicle', color: 'bg-amber-100 text-amber-800 border border-amber-200' },
  heavy_truck: { label: 'Heavy Truck', color: 'bg-emerald-100 text-emerald-800 border border-emerald-200' },
  bus: { label: 'Bus', color: 'bg-rose-100 text-rose-800 border border-rose-200' },
  taxi: { label: 'Taxi', color: 'bg-yellow-100 text-yellow-800 border border-yellow-200' },
} as const;

export const DUBAI_AREAS = [
  'Dubai Marina',
  'Downtown Dubai',
  'Jumeirah',
  'Deira',
  'Al Barsha',
  'Al Qusais',
  'Al Garhoud',
  'Al Quoz',
  'Motor City',
  'Dubai Silicon Oasis',
  'Business Bay',
  'Nad Al Hamar',
  'Al Awir',
];

export const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
];
