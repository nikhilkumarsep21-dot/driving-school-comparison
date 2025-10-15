import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function getSupabaseClient() {
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        'x-my-custom-header': 'otp-verify',
      },
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();

    const { data: inquiry, error: fetchError } = await supabase
      .from('user_inquiries')
      .select('*')
      .eq('email', email)
      .eq('email_verified', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fetchError || !inquiry) {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    if (!inquiry.otp_code || !inquiry.otp_expires_at) {
      return NextResponse.json(
        { error: 'No OTP found for this email' },
        { status: 400 }
      );
    }

    const expiresAt = new Date(inquiry.otp_expires_at);
    const now = new Date();

    if (now > expiresAt) {
      return NextResponse.json(
        { error: 'OTP has expired' },
        { status: 400 }
      );
    }

    if (inquiry.otp_code !== otp) {
      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 400 }
      );
    }

    const { data: updateData, error: updateError } = await supabase
      .from('user_inquiries')
      .update({
        email_verified: true,
        otp_code: null,
        otp_expires_at: null,
      })
      .eq('id', inquiry.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating verification status:', {
        error: updateError,
        message: updateError.message,
        details: updateError.details,
        hint: updateError.hint,
        code: updateError.code,
        inquiryId: inquiry.id,
      });
      return NextResponse.json(
        {
          error: 'Failed to verify email',
          details: updateError.message
        },
        { status: 500 }
      );
    }

    console.log('Successfully updated inquiry:', updateData);

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully',
      inquiry: {
        name: inquiry.name,
        email: inquiry.email,
        phone: inquiry.phone,
        selected_category: inquiry.selected_category,
        location: inquiry.location,
      },
    });
  } catch (error) {
    console.error('Error in OTP verify:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
