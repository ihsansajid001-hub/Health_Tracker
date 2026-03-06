# Enable Google Authentication - Step by Step

## ⚠️ Current Issue
You're getting: `"Unsupported provider: provider is not enabled"`

This means Google OAuth is not enabled in your Supabase project yet.

## 🔧 Fix It Now (5 Minutes)

### Step 1: Enable Google in Supabase (2 minutes)

1. **Go to Supabase Dashboard**
   - Open: https://app.supabase.com/project/dfncowcdbymbpxthlpzf/auth/providers
   - (This is your project's auth providers page)

2. **Find Google Provider**
   - Scroll down to find "Google" in the providers list
   - Click on it to expand

3. **Enable Google**
   - Toggle "Enable Sign in with Google" to ON
   - You'll see two options:
     - **Option A**: Use Supabase's OAuth (Quick - Recommended for testing)
     - **Option B**: Use your own Google OAuth credentials (Production)

### Step 2A: Quick Setup (Use Supabase OAuth) - RECOMMENDED FOR NOW

1. **Select "Use Supabase OAuth"**
   - This is the easiest option
   - Supabase provides the OAuth credentials
   - Perfect for development and testing

2. **Add Redirect URL**
   - In the "Redirect URLs" section, make sure this is listed:
     ```
     http://localhost:3000/auth/callback
     ```

3. **Click "Save"**

4. **Test It**
   - Go to http://localhost:3000/login
   - Click "Sign in with Google"
   - It should work now!

### Step 2B: Production Setup (Use Your Own Google OAuth)

Only do this if you want to use your own Google OAuth credentials:

1. **Create Google OAuth Credentials**
   - Go to: https://console.cloud.google.com/
   - Create a new project or select existing
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Application type: "Web application"
   - Name: "LifeScore"

2. **Add Authorized Redirect URIs**
   ```
   https://dfncowcdbymbpxthlpzf.supabase.co/auth/v1/callback
   http://localhost:3000/auth/callback
   ```

3. **Copy Credentials**
   - Copy the "Client ID"
   - Copy the "Client Secret"

4. **Add to Supabase**
   - Go back to Supabase Auth Providers
   - Select "Use your own OAuth credentials"
   - Paste Client ID
   - Paste Client Secret
   - Click "Save"

## ✅ Verify It's Working

### Test Login Page
1. Go to: http://localhost:3000/login
2. Click "Sign in with Google"
3. You should see Google's login screen
4. After login, you should be redirected to dashboard or onboarding

### Test Signup Page
1. Go to: http://localhost:3000/signup
2. Click "Sign up with Google"
3. Same flow as login

### Check Database
After Google login, check your Supabase database:
1. Go to: https://app.supabase.com/project/dfncowcdbymbpxthlpzf/editor
2. Open "auth.users" table
3. You should see your Google account listed
4. The user will have:
   - `email` from Google
   - `provider` = "google"
   - `user_metadata` with Google profile info

## 🎯 What Happens After Google Login

1. **New User (First Time)**
   ```
   Google Login → Callback → Check Profile → No Profile Found → Redirect to /onboarding
   ```

2. **Existing User**
   ```
   Google Login → Callback → Check Profile → Profile Found → Redirect to /dashboard
   ```

3. **Profile Creation**
   - User completes onboarding form
   - Profile saved to `user_profiles` table
   - Linked to `auth.users` via `user_id`

## 🐛 Troubleshooting

### Still Getting "Provider Not Enabled"?
- Clear browser cache
- Make sure you clicked "Save" in Supabase
- Wait 30 seconds for changes to propagate
- Try in incognito mode

### "Redirect URI Mismatch"?
- Check the redirect URL in Supabase matches exactly:
  ```
  http://localhost:3000/auth/callback
  ```
- No trailing slash
- Must be http (not https) for localhost

### Google Login Works But No Redirect?
- Check browser console for errors
- Verify `/app/auth/callback/route.ts` exists
- Check middleware isn't blocking the callback

### User Created But No Profile?
- This is normal for Google OAuth
- User will be redirected to onboarding
- They'll create their profile there

## 📊 Quick Reference

| What | Where |
|------|-------|
| Enable Google | https://app.supabase.com/project/dfncowcdbymbpxthlpzf/auth/providers |
| View Users | https://app.supabase.com/project/dfncowcdbymbpxthlpzf/auth/users |
| View Profiles | https://app.supabase.com/project/dfncowcdbymbpxthlpzf/editor (user_profiles table) |
| Test Login | http://localhost:3000/login |
| Test Signup | http://localhost:3000/signup |

## 🚀 After Enabling

Once you enable Google OAuth in Supabase:
1. ✅ Login page Google button will work
2. ✅ Signup page Google button will work
3. ✅ Users will be saved to auth.users automatically
4. ✅ Callback will redirect to onboarding or dashboard
5. ✅ Profile will be created when user completes onboarding

## ⏱️ Time Required

- **Quick Setup (Supabase OAuth)**: 2 minutes
- **Production Setup (Own OAuth)**: 10 minutes

Start with Quick Setup for testing!
