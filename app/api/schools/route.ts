import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { SchoolWithLocations } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const licenseTypes = searchParams.get('licenseTypes')?.split(',').filter(Boolean);
    const locations = searchParams.get('locations')?.split(',').filter(Boolean);
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minRating = searchParams.get('minRating');
    const sortBy = searchParams.get('sortBy') || 'recommended';

    let query = supabase
      .from('schools')
      .select(`
        *,
        branch_locations(*)
      `);

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    if (minRating) {
      const minRatingNum = parseFloat(minRating);
      query = query.gte('rating', minRatingNum);
    }

    switch (sortBy) {
      case 'rating':
        query = query.order('rating', { ascending: false });
        break;
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      default:
        query = query.order('name', { ascending: true });
    }

    const { data: schools, error } = await query;

    if (error) {
      console.error('Error fetching schools:', error);
      return NextResponse.json(
        { error: 'Failed to fetch schools' },
        { status: 500 }
      );
    }

    let filteredSchools = schools || [];

    if (locations && locations.length > 0) {
      filteredSchools = filteredSchools.filter((school: any) =>
        school.branch_locations?.some((branch: any) =>
          locations.includes(branch.city)
        )
      );
    }

    if (licenseTypes && licenseTypes.length > 0) {
      const schoolsWithCourses = await Promise.all(
        filteredSchools.map(async (school: any) => {
          const { data: courseLevels } = await supabase
            .from('course_levels')
            .select('id, license_type_id')
            .eq('school_id', school.id)
            .in('license_type_id', licenseTypes);

          return {
            ...school,
            hasCourses: courseLevels && courseLevels.length > 0
          };
        })
      );

      filteredSchools = schoolsWithCourses.filter((s: any) => s.hasCourses);
    }

    if (minPrice || maxPrice) {
      const schoolsWithPricing = await Promise.all(
        filteredSchools.map(async (school: any) => {
          const { data: courseLevels } = await supabase
            .from('course_levels')
            .select(`
              id,
              shifts(
                id,
                packages(fee_aed)
              )
            `)
            .eq('school_id', school.id);

          const allFees: number[] = [];
          courseLevels?.forEach((course: any) => {
            course.shifts?.forEach((shift: any) => {
              shift.packages?.forEach((pkg: any) => {
                if (pkg.fee_aed) allFees.push(Number(pkg.fee_aed));
              });
            });
          });

          const minFee = allFees.length > 0 ? Math.min(...allFees) : null;
          const maxFee = allFees.length > 0 ? Math.max(...allFees) : null;

          const meetsMinPrice = !minPrice || (minFee !== null && minFee >= parseFloat(minPrice));
          const meetsMaxPrice = !maxPrice || (maxFee !== null && maxFee <= parseFloat(maxPrice));

          return {
            ...school,
            meetsPriceFilter: meetsMinPrice && meetsMaxPrice
          };
        })
      );

      filteredSchools = schoolsWithPricing.filter((s: any) => s.meetsPriceFilter);
    }

    return NextResponse.json({
      schools: filteredSchools,
      count: filteredSchools.length
    });

  } catch (error) {
    console.error('Internal server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
