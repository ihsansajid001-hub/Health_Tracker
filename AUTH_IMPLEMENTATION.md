# Authentication Implementation Summary

## Overview
LifeScore uses **Supabase Authentication** for secure user management with email/password and Google OAuth support.

## ✅ What's Implemented

### 1. Email/Password Authentication
- **Signup**: `/app/(auth)/signup/page.tsx`
  - Email validation
  - Password strength requirements (min 6 characters)
  - Password confirmation
  - Automatic redirect to onboarding after signup
  
- **Login**: `/app/(auth)/login/page.tsx`
  - Email/password authentication
  - "Keep me signed in" option
  - Forgot password link (placeholder)
  - Automatic redirect to dashboard after login

### 2. Google OAuth
- **Google Sign-In** button on both login and signup pages
- OAuth callback handler at `/app/auth/callback/route.ts`
- Automatic profile detection (redirects to onboarding if no profile exists)
- See `GOOGLE_AUTH_SETUP.md` for configuration instructions

### 3. Session Management
- **AuthProvider**: Global auth context at `/components/providers/AuthProvider.tsx`
  - Provides `user`, `session`, `loading`, and `signOut` to all components
  - Listens for auth state changes
  - Automatic session persistence

### 4. Route Protection
- **Middleware**: `/middleware.ts`
  - Protects `/dashboard/*` and `/onboarding/*` routes
  - Redirects unauthenticated users to `/login`
  - Redirects authenticated users away from `/login` and `/signup`
  - Preserves intended destination with redirect parameter

### 5. Row Level Security (RLS)
All database tables have RLS enabled with policies:
- `user_profiles` - Users can only view/edit their own profile
- `sleep_logs` - Users can only CRUD their own logs
- `workout_logs` - Users can only CRUD their own logs
- `nutrition_logs` - Users can only CRUD their own logs
- `mood_logs` - Users can only CRUD their own logs
- `hydration_logs` - Users can only CRUD their own logs
- `weekly_reports` - Users can only view/insert their own reports
- `achievements` - Users can only view/insert their own achievements

### 6. API Route Protection
All API routes verify authentication:
- Check for `Authorization: Bearer <token>` header
- Validate token with Supabase
- Return 401 if unauthorized
- Examples:
  - `/app/api/score/current/route.ts`
  - `/app/api/insights/recent/route.ts`
  - `/app/api/streak/route.ts`

### 7. Password Security
- Supabase handles password hashing automatically (bcrypt)
- Passwords never stored in plain text
- Secure password reset flow (via Supabase)

## 🔧 How It Works

### Authentication Flow

1. **User Signs Up**
   ```
   User → Signup Page → Supabase Auth → Onboarding → Dashboard
   ```

2. **User Logs In**
   ```
   User → Login Page → Supabase Auth → Dashboard
   ```

3. **Google OAuth**
   ```
   User → Click Google Button → Google OAuth → Callback Handler → Onboarding/Dashboard
   ```

4. **Protected Route Access**
   ```
   User → Protected Route → Middleware → Check Session → Allow/Redirect
   ```

5. **API Request**
   ```
   Client → API Route → Verify Token → Process Request → Return Data
   ```

## 📦 Dependencies

### Required Packages
- `@supabase/supabase-js` - Supabase client
- `@supabase/auth-helpers-nextjs` - Next.js auth helpers

### Removed (No Longer Needed)
- ~~`bcryptjs`~~ - Supabase handles password hashing
- ~~`jsonwebtoken`~~ - Supabase handles JWT tokens
- ~~`JWT_SECRET`~~ - Not needed with Supabase

## 🔐 Security Features

1. **JWT Tokens**: Supabase-managed, secure tokens
2. **Password Hashing**: Automatic bcrypt hashing
3. **Row Level Security**: Database-level access control
4. **HTTPS Only**: OAuth requires HTTPS in production
5. **Token Validation**: All API routes validate tokens
6. **Session Expiry**: Automatic session management
7. **CSRF Protection**: Built into Supabase auth

## 🚀 Setup Instructions

### 1. Environment Variables
Create `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GROQ_API_KEY=your_groq_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Database Setup
Run the SQL schema in Supabase:
```bash
# Copy contents of supabase/schema.sql
# Paste into Supabase SQL Editor
# Execute
```

### 3. Google OAuth (Optional)
Follow instructions in `GOOGLE_AUTH_SETUP.md`

### 4. Install Dependencies
```bash
npm install
```

### 5. Run Development Server
```bash
npm run dev
```

## 🧪 Testing Authentication

### Test Email/Password
1. Go to `http://localhost:3000/signup`
2. Create an account with email/password
3. Complete onboarding
4. Verify you're redirected to dashboard
5. Log out and log back in

### Test Google OAuth
1. Configure Google OAuth (see `GOOGLE_AUTH_SETUP.md`)
2. Go to `http://localhost:3000/login`
3. Click "Sign in with Google"
4. Authorize with Google
5. Verify redirect to onboarding or dashboard

### Test Route Protection
1. Log out
2. Try to access `http://localhost:3000/dashboard`
3. Verify redirect to login page
4. Log in
5. Try to access `http://localhost:3000/login`
6. Verify redirect to dashboard

### Test API Protection
```bash
# Without token (should fail)
curl http://localhost:3000/api/score/current

# With token (should succeed)
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/score/current
```

## 📝 Usage in Components

### Get Current User
```typescript
import { useAuth } from '@/components/providers/AuthProvider';

function MyComponent() {
  const { user, session, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not authenticated</div>;
  
  return <div>Hello {user.email}</div>;
}
```

### Sign Out
```typescript
import { useAuth } from '@/components/providers/AuthProvider';

function MyComponent() {
  const { signOut } = useAuth();
  
  return <button onClick={signOut}>Sign Out</button>;
}
```

### Make Authenticated API Calls
```typescript
import { fetchWithAuth } from '@/lib/utils/auth';

async function getScore() {
  const response = await fetchWithAuth('/api/score/current');
  const data = await response.json();
  return data;
}
```

## 🐛 Troubleshooting

### "Unauthorized" errors
- Check that `.env.local` has correct Supabase credentials
- Verify user is logged in
- Check browser console for auth errors

### Redirect loops
- Clear browser cookies
- Check middleware configuration
- Verify callback route is working

### Google OAuth not working
- Verify redirect URIs in Google Cloud Console
- Check Supabase provider configuration
- Ensure HTTPS in production

### RLS blocking queries
- Verify user is authenticated
- Check RLS policies in Supabase
- Use service role key for admin operations

## 🎯 Next Steps

### Recommended Enhancements
1. **Email Verification**: Enable in Supabase settings
2. **Password Reset**: Implement forgot password flow
3. **Multi-Factor Auth**: Add 2FA support
4. **Social Providers**: Add GitHub, Apple, etc.
5. **Session Timeout**: Configure custom session duration
6. **Audit Logging**: Track auth events
7. **Rate Limiting**: Prevent brute force attacks

## 📚 Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Next.js Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Google OAuth Setup](./GOOGLE_AUTH_SETUP.md)
