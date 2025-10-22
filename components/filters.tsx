'use client';

import { Search, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { CATEGORY_TYPES, SORT_OPTIONS } from '@/lib/constants';
import { FilterOptions } from '@/lib/types';

interface FiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export function Filters({ filters, onFiltersChange }: FiltersProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleCategoryToggle = (categoryId: number) => {
    const current = filters.categories || [];
    const updated = current.includes(categoryId)
      ? current.filter(c => c !== categoryId)
      : [...current, categoryId];
    onFiltersChange({ ...filters, categories: updated });
  };

  const handleLocationToggle = (location: string) => {
    const current = filters.locations || [];
    const updated = current.includes(location)
      ? current.filter(l => l !== location)
      : [...current, location];
    onFiltersChange({ ...filters, locations: updated });
  };

  const handlePriceChange = (values: number[]) => {
    onFiltersChange({
      ...filters,
      minPrice: values[0],
      maxPrice: values[1]
    });
  };

  const handleRatingChange = (value: string) => {
    onFiltersChange({ ...filters, minRating: parseFloat(value) });
  };

  const handleSortChange = (value: string) => {
    onFiltersChange({
      ...filters,
      sortBy: value as FilterOptions['sortBy']
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      categories: [],
      locations: [],
      minPrice: 0,
      maxPrice: 15000,
      minRating: 0,
      sortBy: 'recommended'
    });
  };

  const activeFilterCount = [
    filters.search,
    (filters.categories?.length || 0) > 0,
    (filters.locations?.length || 0) > 0,
    filters.minPrice && filters.minPrice > 0,
    filters.maxPrice && filters.maxPrice < 15000,
    filters.minRating && filters.minRating > 0
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {activeFilterCount > 0 && (
        <div className="rounded-2xl bg-gold-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">Active Filters</span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold-600 text-xs font-bold text-white">
              {activeFilterCount}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.categories?.map((categoryId) => (
              <Button
                key={categoryId}
                variant="secondary"
                size="sm"
                onClick={() => handleCategoryToggle(categoryId)}
                className="h-7 text-xs"
              >
                {CATEGORY_TYPES[categoryId]?.label || `Category ${categoryId}`}
                <X className="ml-1 h-3 w-3" />
              </Button>
            ))}
            {filters.locations?.map((location) => (
              <Button
                key={location}
                variant="secondary"
                size="sm"
                onClick={() => handleLocationToggle(location)}
                className="h-7 text-xs"
              >
                {location}
                <X className="ml-1 h-3 w-3" />
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl bg-white p-6 shadow-soft">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Filters</h2>
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 text-xs text-gold-600 hover:text-gold-700"
            >
              Clear all
            </Button>
          )}
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-gray-700">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search schools..."
                value={filters.search || ''}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold text-gray-700">Sort By</Label>
            <Select value={filters.sortBy || 'recommended'} onValueChange={handleSortChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700">License Type</Label>
              <div className="space-y-2.5">
                {Object.keys(CATEGORY_TYPES).map((categoryId) => {
                  const id = parseInt(categoryId, 10);
                  return (
                    <div key={id} className="flex items-center space-x-2.5">
                      <Checkbox
                        id={`sidebar-${id}`}
                        checked={filters.categories?.includes(id)}
                        onCheckedChange={() => handleCategoryToggle(id)}
                      />
                      <Label
                        htmlFor={`sidebar-${id}`}
                        className="cursor-pointer text-sm font-normal text-gray-700"
                      >
                        {CATEGORY_TYPES[id].label}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700">Location (City)</Label>
              <div className="text-sm text-gray-600">
                <p>Location filtering available after branches are loaded</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-gray-700">Price Range</Label>
                <span className="text-xs text-gray-600">
                  AED {filters.minPrice || 0} - {filters.maxPrice || 15000}
                </span>
              </div>
              <Slider
                min={0}
                max={15000}
                step={500}
                value={[filters.minPrice || 0, filters.maxPrice || 15000]}
                onValueChange={handlePriceChange}
                className="py-4"
              />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700">Minimum Rating</Label>
              <Select
                value={filters.minRating?.toString() || '0'}
                onValueChange={handleRatingChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Any rating</SelectItem>
                  <SelectItem value="3">3+ stars</SelectItem>
                  <SelectItem value="4">4+ stars</SelectItem>
                  <SelectItem value="4.5">4.5+ stars</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
