import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    
    try {
      // Exchange code for session
      await supabase.auth.exchangeCodeForSession(code);
      
      // Get the authenticated user
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Check if user has completed onboarding (has a profile)
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();

        // Redirect to onboarding if no profile exists, otherwise to dashboard
        const redirectTo = profile ? '/dashboard' : '/onboarding';
        return NextResponse.redirect(new URL(redirectTo, requestUrl.origin));
      }
    } catch (error) {
      console.error('OAuth callback error:', error);
      // Redirect to login with error message
      return NextResponse.redirect(
        new URL('/login?error=auth_callback_failed', requestUrl.origin)
      );
    }
  }

  // Fallback to home if no code
  return NextResponse.redirect(new URL('/', requestUrl.origin));
}
