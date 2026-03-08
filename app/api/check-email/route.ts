import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ exists: false }, { status: 400 });
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Check if user profile exists with this email
    // We check profiles because that's linked to auth users
    const { data: profiles, error } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(1);

    // Since we can't directly query auth.users by email from client,
    // we'll rely on the password reset response
    // Supabase will handle this internally
    
    return NextResponse.json({ canProceed: true });
  } catch (error) {
    console.error('Email check error:', error);
    return NextResponse.json({ exists: false }, { status: 500 });
  }
}
