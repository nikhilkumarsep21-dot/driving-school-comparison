export const LICENSE_TYPES = {
  motorcycle: { label: 'Motorcycle', color: 'bg-orange-100 text-orange-700' },
  light_motor_vehicle: { label: 'Light Motor Vehicle', color: 'bg-blue-100 text-blue-700' },
  heavy_truck: { label: 'Heavy Truck', color: 'bg-emerald-100 text-emerald-700' },
  light_bus: { label: 'Light Bus', color: 'bg-amber-100 text-amber-700' },
  heavy_bus: { label: 'Heavy Bus', color: 'bg-red-100 text-red-700' },
  light_forklift: { label: 'Light Forklift', color: 'bg-slate-100 text-slate-700' },
  heavy_forklift: { label: 'Heavy Forklift', color: 'bg-stone-100 text-stone-700' },
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
