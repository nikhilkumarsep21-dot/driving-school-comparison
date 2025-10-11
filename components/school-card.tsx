'use client';

import React from 'react';
import { School } from '@/lib/types';
import { StarRating } from './ui/star-rating';
import { LicenseBadge } from './ui/license-badge';
import { PriceDisplay } from './ui/price-display';
import { MapPin, Users, GitCompare, Check, GraduationCap } from 'lucide-react';
import { Button } from './ui/button';
import { useComparisonStore } from '@/store/comparison-store';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface SchoolCardProps {
  school: School;
  index?: number;
}

export function SchoolCard({ school, index = 0 }: SchoolCardProps) {
  const { addSchool, removeSchool, isInComparison, canAddMore } = useComparisonStore();
  const inComparison = isInComparison(school.id);
  const [imageError, setImageError] = React.useState(false);

  const minPrice = school.license_categories && school.license_categories.length > 0
    ? Math.min(...school.license_categories.map(cat => cat.price))
    : 0;

  const uniqueTypes = school.license_categories
    ? Array.from(new Set(school.license_categories.map(cat => cat.type)))
    : [];

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (inComparison) {
      removeSchool(school.id);
      toast.info(`${school.name} removed from comparison`);
    } else {
      const success = addSchool(school);
      if (!success) {
        if (!canAddMore()) {
          toast.error('You can only compare up to 3 schools');
        }
      } else {
        toast.success(`${school.name} added to comparison`);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-2xl bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg"
    >
      <Link href={`/school/${school.slug}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gold-100 to-sand-100">
          {!imageError ? (
            <Image
              src={school.image_url}
              alt={`${school.name} - Driving School in ${school.location_area}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <GraduationCap className="h-24 w-24 text-gold-300" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      </Link>

      <div className="absolute right-3 top-3 z-10">
        <Button
          size="sm"
          onClick={handleCompareClick}
          className={
            inComparison
              ? 'bg-gold-600 text-white hover:bg-gold-700 shadow-lg'
              : 'bg-white/90 text-gray-700 hover:bg-white shadow-soft backdrop-blur-sm'
          }
        >
          {inComparison ? (
            <>
              <Check className="mr-1.5 h-4 w-4" />
              Added
            </>
          ) : (
            <>
              <GitCompare className="mr-1.5 h-4 w-4" />
              Compare
            </>
          )}
        </Button>
      </div>

      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <Link href={`/school/${school.slug}`}>
            <h3 className="text-lg font-bold text-gray-900 transition-colors hover:text-gold-600">
              {school.name}
            </h3>
          </Link>

          <div className="flex items-center gap-4">
            <StarRating rating={school.rating} size="sm" />
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Users className="h-3 w-3" />
              {school.review_count} reviews
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-gold-500" />
            {school.location_area}
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {uniqueTypes.slice(0, 3).map((type) => (
            <LicenseBadge key={type} type={type} />
          ))}
          {uniqueTypes.length > 3 && (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
              +{uniqueTypes.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          {minPrice > 0 && <PriceDisplay price={minPrice} size="sm" />}
          <Link href={`/school/${school.slug}`}>
            <Button
              variant="outline"
              size="sm"
              className="border-gold-200 text-gold-700 transition-all hover:bg-gold-50 hover:border-gold-300"
            >
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
