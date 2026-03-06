import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isOnboardingPage = req.nextUrl.pathname === '/onboarding';
  const isDashboardRoute = req.nextUrl.pathname.startsWith('/dashboard');

  // Not logged in trying to access dashboard? → Login
  if (!session && isDashboardRoute) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Logged in trying to access dashboard? Check if onboarding is complete
  if (session && isDashboardRoute) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_id', session.user.id)
      .single();

    // No profile? Must complete onboarding first
    if (!profile) {
      return NextResponse.redirect(new URL('/onboarding', req.url));
    }
  }

  // Logged in on onboarding page with existing profile? → Dashboard
  if (session && isOnboardingPage) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_id', session.user.id)
      .single();

    // Profile exists? Onboarding already done, go to dashboard
    if (profile) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/onboarding'],
};
