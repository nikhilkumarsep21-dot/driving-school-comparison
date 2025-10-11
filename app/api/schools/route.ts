import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { School, LicenseCategory } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const categories = searchParams.get('categories')?.split(',').filter(Boolean);
    const locations = searchParams.get('locations')?.split(',').filter(Boolean);
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minRating = searchParams.get('minRating');
    const sortBy = searchParams.get('sortBy') || 'recommended';

    let query = supabase
      .from('schools')
      .select(`
        *,
        license_categories (*)
      `);

    if (search) {
      query = query.or(`name.ilike.%${search}%,location_area.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (locations && locations.length > 0) {
      query = query.in('location_area', locations);
    }

    if (minRating) {
      query = query.gte('rating', parseFloat(minRating));
    }

    switch (sortBy) {
      case 'rating':
        query = query.order('rating', { ascending: false });
        break;
      case 'price_low':
        query = query.order('name');
        break;
      case 'price_high':
        query = query.order('name');
        break;
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      default:
        query = query.order('review_count', { ascending: false });
    }

    const { data: schools, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch schools' },
        { status: 500 }
      );
    }

    let filteredSchools = schools || [];

    if (categories && categories.length > 0) {
      filteredSchools = filteredSchools.filter((school: any) => {
        const schoolCategories = school.license_categories || [];
        return schoolCategories.some((cat: LicenseCategory) =>
          categories.includes(cat.type)
        );
      });
    }

    if (minPrice || maxPrice) {
      const min = minPrice ? parseFloat(minPrice) : 0;
      const max = maxPrice ? parseFloat(maxPrice) : Infinity;

      filteredSchools = filteredSchools.filter((school: any) => {
        const prices = (school.license_categories || []).map((cat: LicenseCategory) => cat.price);
        if (prices.length === 0) return false;
        const minSchoolPrice = Math.min(...prices);
        const maxSchoolPrice = Math.max(...prices);
        return maxSchoolPrice >= min && minSchoolPrice <= max;
      });
    }

    if (sortBy === 'price_low') {
      filteredSchools.sort((a: any, b: any) => {
        const getPrices = (school: any) => (school.license_categories || []).map((cat: LicenseCategory) => cat.price);
        const minA = Math.min(...getPrices(a), Infinity);
        const minB = Math.min(...getPrices(b), Infinity);
        return minA - minB;
      });
    } else if (sortBy === 'price_high') {
      filteredSchools.sort((a: any, b: any) => {
        const getPrices = (school: any) => (school.license_categories || []).map((cat: LicenseCategory) => cat.price);
        const maxA = Math.max(...getPrices(a), 0);
        const maxB = Math.max(...getPrices(b), 0);
        return maxB - maxA;
      });
    }

    return NextResponse.json({
      schools: filteredSchools,
      count: filteredSchools.length
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
