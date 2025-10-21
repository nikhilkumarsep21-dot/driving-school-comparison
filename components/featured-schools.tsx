'use client';

import { useEffect, useState } from 'react';
import { SchoolCard } from './school-card';
import { LoadingCard } from './ui/loading-card';
import { BranchWithSchool } from '@/lib/types';

export function FeaturedSchools() {
  const [schools, setSchools] = useState<BranchWithSchool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedSchools = async () => {
      try {
        const response = await fetch('/api/schools?sortBy=rating');
        const data = await response.json();
        setSchools(data.schools?.slice(0, 4) || []);
      } catch (error) {
        console.error('Failed to fetch featured schools:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedSchools();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <LoadingCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {schools.map((school, index) => (
        <SchoolCard key={school.id} school={school} index={index} />
      ))}
    </div>
  );
}
