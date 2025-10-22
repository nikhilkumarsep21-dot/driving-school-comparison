import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const branchId = parseInt(id, 10);

    if (isNaN(branchId)) {
      return NextResponse.json(
        { error: 'Invalid branch ID' },
        { status: 400 }
      );
    }

    const { data: branch, error } = await supabase
      .from('branches')
      .select(`
        *,
        school:schools(*)
      `)
      .eq('id', branchId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching branch:', error);
      return NextResponse.json(
        { error: 'Failed to fetch branch' },
        { status: 500 }
      );
    }

    if (!branch) {
      return NextResponse.json(
        { error: 'Branch not found' },
        { status: 404 }
      );
    }

    const { data: details, error: detailsError } = await supabase
      .from('details')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('school_id', branch.school_id);

    if (detailsError) {
      console.error('Error fetching details:', detailsError);
    }

    return NextResponse.json({
      school: {
        ...branch,
        details: details || [],
        categories: details?.map((d: any) => d.category).filter(Boolean) || []
      }
    });

  } catch (error) {
    console.error('Internal server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
