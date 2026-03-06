# Google OAuth Setup Guide

This guide will help you enable Google Sign-In for your LifeScore application.

## Prerequisites
- A Supabase project
- A Google Cloud Console account

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Configure the OAuth consent screen if prompted:
   - User Type: External
   - App name: LifeScore
   - User support email: Your email
   - Developer contact: Your email
6. Select **Web application** as the application type
7. Add authorized redirect URIs:
   ```
   https://YOUR_SUPABASE_PROJECT_REF.supabase.co/auth/v1/callback
   ```
   Replace `YOUR_SUPABASE_PROJECT_REF` with your actual Supabase project reference
8. Click **Create**
9. Copy the **Client ID** and **Client Secret**

## Step 2: Configure Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Navigate to **Authentication** > **Providers**
4. Find **Google** in the list and enable it
5. Paste your Google **Client ID** and **Client Secret**
6. Click **Save**

## Step 3: Update Your Application URLs

### For Development (localhost):
1. In Google Cloud Console, add to authorized redirect URIs:
   ```
   http://localhost:3000/auth/callback
   ```

### For Production:
1. Update your `.env.local` file:
   ```
   NEXT_PUBLIC_APP_URL=https://your-production-domain.com
   ```
2. In Google Cloud Console, add to authorized redirect URIs:
   ```
   https://your-production-domain.com/auth/callback
   ```

## Step 4: Test Google Sign-In

1. Start your development server:
   ```bash
   npm run dev
   ```
2. Navigate to `/login` or `/signup`
3. Click the "Sign in with Google" button
4. You should be redirected to Google's OAuth consent screen
5. After authorization, you'll be redirected back to your app

## Troubleshooting

### "Redirect URI mismatch" error
- Ensure the redirect URI in Google Cloud Console exactly matches your Supabase callback URL
- Check for trailing slashes or http vs https

### "Access blocked" error
- Make sure your OAuth consent screen is properly configured
- Add your test email to the test users list if the app is not published

### Users not redirecting to onboarding
- Check that the callback route at `/app/auth/callback/route.ts` is working
- Verify the middleware is not blocking the callback route

## Security Notes

- Never commit your Google Client Secret to version control
- Use environment variables for all sensitive credentials
- Enable email verification in Supabase for production
- Consider adding additional OAuth providers (GitHub, Apple, etc.)

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
