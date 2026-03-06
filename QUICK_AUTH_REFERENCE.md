# Quick Authentication Reference

## 🎯 TL;DR

Your authentication is now **fully functional** with:
- ✅ Email/password login & signup
- ✅ Google OAuth (needs configuration)
- ✅ Protected routes (middleware)
- ✅ Global auth state (AuthProvider)
- ✅ Secure API endpoints
- ✅ Row Level Security (RLS)

## 🚀 Quick Start

### 1. Test Email/Password (Works Now)
```bash
npm run dev
# Go to http://localhost:3000/signup
# Create account → Complete onboarding → Access dashboard
```

### 2. Enable Google Sign-In (5 min setup)
1. Get credentials from [Google Cloud Console](https://console.cloud.google.com/)
2. Add to Supabase Dashboard → Auth → Providers → Google
3. Done! See `GOOGLE_AUTH_SETUP.md` for details

## 💻 Code Snippets

### Get Current User
```typescript
import { useAuth } from '@/components/providers/AuthProvider';

const { user, loading } = useAuth();
```

### Sign Out
```typescript
const { signOut } = useAuth();
await signOut(); // Redirects to home
```

### Protected API Call
```typescript
import { fetchWithAuth } from '@/lib/utils/auth';

const response = await fetchWithAuth('/api/score/current');
```

## 🔐 What's Protected

### Routes (Automatic)
- `/dashboard/*` - Requires login
- `/onboarding/*` - Requires login
- `/login`, `/signup` - Redirects if already logged in

### API Endpoints (All Protected)
- `/api/score/current`
- `/api/score/trend`
- `/api/insights/recent`
- `/api/streak`

### Database (RLS Enabled)
All tables - users can only access their own data

## 📁 Key Files

| File | Purpose |
|------|---------|
| `middleware.ts` | Route protection |
| `components/providers/AuthProvider.tsx` | Auth context |
| `app/(auth)/login/page.tsx` | Login page |
| `app/(auth)/signup/page.tsx` | Signup page |
| `app/auth/callback/route.ts` | OAuth callback |
| `lib/utils/auth.ts` | Auth utilities |

## 🐛 Common Issues

### "Unauthorized" Error
- Check `.env.local` has Supabase credentials
- Verify user is logged in

### Can't Access Dashboard
- Make sure you're logged in
- Check browser console for errors

### Google OAuth Not Working
- Follow `GOOGLE_AUTH_SETUP.md`
- Verify redirect URIs match exactly

## 📚 Full Documentation

- `AUTH_IMPLEMENTATION.md` - Complete guide
- `GOOGLE_AUTH_SETUP.md` - Google OAuth setup
- `AUTH_FIXES_SUMMARY.md` - What was changed

## ✅ What Works Out of the Box

1. Email/password authentication
2. Automatic password hashing (bcrypt)
3. JWT token management
4. Session persistence
5. Route protection
6. API protection
7. Row Level Security
8. Sign out functionality

## 🔧 What Needs Configuration

1. Google OAuth (optional) - 5 min setup
2. Email verification (optional) - Enable in Supabase
3. Password reset (optional) - Implement custom flow

## 🎉 You're Done!

Your authentication is production-ready. Just configure Google OAuth if you want it, otherwise you're good to go!
