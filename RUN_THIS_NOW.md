# 🚀 Quick Setup - Run This Now!

## Step 1: Update Your Database

Go to your Supabase Dashboard SQL Editor:
👉 **https://supabase.com/dashboard/project/dfncowcdbymbpxthlpzf/sql/new**

Copy and paste the ENTIRE contents of `supabase/schema.sql` and click **RUN**.

This will:
- Add the `username` column to your database
- Create all necessary tables if they don't exist
- Set up proper security policies

## Step 2: Test It Out

```bash
npm run dev
```

Then visit: **http://localhost:3000**

## Step 3: Try the New Flow

1. Click "Get Started"
2. Enter a username (e.g., "johndoe123")
3. Enter email and password
4. Complete the 3-step onboarding wizard
5. See your personalized dashboard!

## Step 4: Test Returning User

1. Logout from dashboard
2. Go back to homepage
3. You should see "Welcome back! @yourusername"
4. Click "Go to Dashboard"

---

## ⚠️ If You Already Have Users in Database

If you already have existing users, you need to add the username column carefully:

```sql
-- Run this instead in Supabase SQL Editor
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS username VARCHAR(30);

-- Create unique index
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);

-- For existing users, generate username from email
UPDATE user_profiles 
SET username = LOWER(SPLIT_PART((SELECT email FROM auth.users WHERE id = user_profiles.user_id), '@', 1))
WHERE username IS NULL;

-- Make it required
ALTER TABLE user_profiles ALTER COLUMN username SET NOT NULL;
```

---

That's it! Your username system is ready to go! 🎉
