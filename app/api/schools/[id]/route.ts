import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: school, error } = await supabase
      .from('schools')
      .select(`
        *,
        branch_locations(*),
        course_levels(
          *,
          license_type:license_types(*),
          shifts(
            *,
            packages(*)
          )
        )
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching school:', error);
      return NextResponse.json(
        { error: 'Failed to fetch school' },
        { status: 500 }
      );
    }

    if (!school) {
      return NextResponse.json(
        { error: 'School not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      school
    });

  } catch (error) {
    console.error('Internal server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
