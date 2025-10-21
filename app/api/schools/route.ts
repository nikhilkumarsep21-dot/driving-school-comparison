import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { BranchWithSchool } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const categories = searchParams.get('categories')?.split(',').filter(Boolean).map(Number);
    const locations = searchParams.get('locations')?.split(',').filter(Boolean);
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minRating = searchParams.get('minRating');
    const sortBy = searchParams.get('sortBy') || 'recommended';

    let query = supabase
      .from('branches')
      .select(`
        *,
        school:schools(*)
      `);

    if (search) {
      query = query.or(`name.ilike.%${search}%,address.ilike.%${search}%,city.ilike.%${search}%`);
    }

    if (locations && locations.length > 0) {
      query = query.in('city', locations);
    }

    switch (sortBy) {
      case 'rating':
        break;
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      default:
        query = query.order('id', { ascending: true });
    }

    const { data: branches, error } = await query;

    if (error) {
      console.error('Error fetching branches:', error);
      return NextResponse.json(
        { error: 'Failed to fetch branches' },
        { status: 500 }
      );
    }

    let filteredBranches = branches || [];

    if (categories && categories.length > 0) {
      const branchesWithCategories = await Promise.all(
        filteredBranches.map(async (branch: any) => {
          const { data: details } = await supabase
            .from('details')
            .select('category_id')
            .eq('school_id', branch.school_id)
            .in('category_id', categories);

          return {
            ...branch,
            hasCategories: details && details.length > 0
          };
        })
      );

      filteredBranches = branchesWithCategories.filter((b: any) => b.hasCategories);
    }

    if (minRating) {
      const minRatingNum = parseFloat(minRating);
      filteredBranches = filteredBranches.filter((branch: any) =>
        branch.school && branch.school.rating >= minRatingNum
      );
    }

    if (sortBy === 'rating') {
      filteredBranches.sort((a: any, b: any) => {
        const ratingA = a.school?.rating || 0;
        const ratingB = b.school?.rating || 0;
        return ratingB - ratingA;
      });
    }

    return NextResponse.json({
      schools: filteredBranches,
      count: filteredBranches.length
    });

  } catch (error) {
    console.error('Internal server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
