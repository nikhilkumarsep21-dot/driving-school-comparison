export const LICENSE_TYPES: Record<string, { label: string; color: string; type: string }> = {
  'motorcycle': { label: 'Motorcycle', color: 'bg-orange-100 text-orange-700', type: 'motorcycle' },
  'light_motor_vehicle': { label: 'Light Motor Vehicle', color: 'bg-blue-100 text-blue-700', type: 'light_motor_vehicle' },
  'heavy_truck': { label: 'Heavy Truck', color: 'bg-emerald-100 text-emerald-700', type: 'heavy_truck' },
  'light_bus': { label: 'Light Bus', color: 'bg-amber-100 text-amber-700', type: 'light_bus' },
  'heavy_bus': { label: 'Heavy Bus', color: 'bg-red-100 text-red-700', type: 'heavy_bus' },
  'light_forklift': { label: 'Light Forklift', color: 'bg-slate-100 text-slate-700', type: 'light_forklift' },
  'heavy_forklift': { label: 'Heavy Forklift', color: 'bg-stone-100 text-stone-700', type: 'heavy_forklift' },
} as const;

export const CATEGORY_TYPES: Record<number, { label: string; color: string; type: string }> = {
  1: { label: 'Motorcycle', color: 'bg-orange-100 text-orange-700', type: 'motorcycle' },
  2: { label: 'Light Motor Vehicle', color: 'bg-blue-100 text-blue-700', type: 'light_motor_vehicle' },
  3: { label: 'Heavy Truck', color: 'bg-emerald-100 text-emerald-700', type: 'heavy_truck' },
  4: { label: 'Light Bus', color: 'bg-amber-100 text-amber-700', type: 'light_bus' },
  5: { label: 'Heavy Bus', color: 'bg-red-100 text-red-700', type: 'heavy_bus' },
  6: { label: 'Light Forklift', color: 'bg-slate-100 text-slate-700', type: 'light_forklift' },
  7: { label: 'Heavy Forklift', color: 'bg-stone-100 text-stone-700', type: 'heavy_forklift' },
} as const;

export const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
];

export const DUBAI_CITIES = [
  'Al Aweer',
  'Al Barsha',
  'Al Garhoud',
  'Al Karama',
  'Al Mamzar',
  'Al Nahda',
  'Al Quoz',
  'Al Qusais',
  'Al Satwa',
  'Al Twar',
  'Al Warqa',
  'Bur Dubai',
  'Business Bay',
  'Deira',
  'Downtown Dubai',
  'Dubai',
  'Dubai South',
  'Festival City',
  'Jebel Ali',
  'JLT',
  'Jumeirah',
  'Mirdif',
  'Motor City',
  'Muhaisnah',
  'Silicon Oasis',
] as const;
