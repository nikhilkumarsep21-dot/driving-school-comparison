import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabaseClient();
    const { id } = await params;

    const { data: school, error } = await supabase
      .from('schools')
      .select(`
        *,
        license_categories (*)
      `)
      .eq('slug', id)
      .maybeSingle();

    if (error) {
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

    return NextResponse.json({ school });

  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
