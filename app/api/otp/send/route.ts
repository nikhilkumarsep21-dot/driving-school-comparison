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
        'x-my-custom-header': 'otp-send',
      },
    },
  });
}

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, phone, selected_category, location } = body;

    if (!email || !name || !phone || !selected_category || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();
    const otp = generateOTP();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    const { error: insertError } = await supabase
      .from('user_inquiries')
      .insert({
        name,
        email,
        phone,
        selected_category,
        location,
        otp_code: otp,
        otp_expires_at: expiresAt.toISOString(),
        email_verified: false,
      });

    if (insertError) {
      console.error('Error creating inquiry:', insertError);
      return NextResponse.json(
        { error: 'Failed to create inquiry' },
        { status: 500 }
      );
    }

    console.log(`
      ============================================
      OTP CODE FOR ${email}: ${otp}
      Expires at: ${expiresAt.toISOString()}
      ============================================
    `);

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error('Error in OTP send:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
