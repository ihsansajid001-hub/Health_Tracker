# Username Feature Setup Guide

## What's New

Your LifeScore app now includes a complete username system:

1. **Unique Username Registration** - Users choose a username during signup
2. **Username Display** - Shows username on landing page when logged in
3. **Onboarding Flow** - First-time users complete a 3-step wizard after signup
4. **Personalized Experience** - Landing page greets returning users by username

## Database Changes

### New Column Added
- `username` field in `user_profiles` table (VARCHAR(30), UNIQUE, NOT NULL)

### Setup Instructions

#### For New Databases
Run the main schema file:
```sql
-- Run this in Supabase SQL Editor
-- File: supabase/schema.sql
```

#### For Existing Databases
Run the migration file:
```sql
-- Run this in Supabase SQL Editor
-- File: supabase/add_username_migration.sql
```

This will:
- Add the username column
- Create a unique index
- Populate existing users with usernames from their email
- Set the column as NOT NULL

## User Flow

### New User Journey
1. **Landing Page** → Shows "Get Started" button
2. **Signup Page** → User enters:
   - Username (unique, 3-30 chars, letters/numbers/underscores only)
   - Email
   - Password
   - Confirm Password
3. **Email Verification** → User verifies email (if enabled)
4. **Onboarding Wizard** → 3-step process:
   - Step 1: Personal Info (age, gender, height, weight)
   - Step 2: Activity & Goals (activity level, sleep hours, stress level, primary goal)
   - Step 3: Review & Confirm
5. **Dashboard** → User lands on personalized dashboard

### Returning User Journey
1. **Landing Page** → Shows "Welcome back! @username"
2. **Login** → User enters email & password
3. **Dashboard** → Direct access to dashboard

## Features

### Username Validation
- Minimum 3 characters
- Maximum 30 characters
- Only letters, numbers, and underscores
- Case-insensitive (stored as lowercase)
- Unique across all users
- Real-time availability check

### Onboarding Calculations
The wizard automatically calculates:
- **BMI** (Body Mass Index)
- **BMR** (Basal Metabolic Rate)
- **TDEE** (Total Daily Energy Expenditure / Maintenance Calories)

### UI/UX Enhancements
- Smooth animations between steps
- Progress bar showing completion
- Form validation with helpful error messages
- Responsive design for all devices
- Loading states for async operations

## Testing

### Test the Complete Flow
1. Start the development server:
   ```bash
   npm run dev
   ```

2. Visit `http://localhost:3000`

3. Test new user signup:
   - Click "Get Started"
   - Enter a unique username
   - Complete signup form
   - Go through onboarding wizard
   - Verify dashboard access

4. Test returning user:
   - Logout from dashboard
   - Visit homepage
   - Verify username is displayed
   - Click "Go to Dashboard"

## Troubleshooting

### Username Already Taken
- Error message: "Username already taken"
- Solution: Choose a different username

### Database Error on Signup
- Check if migration was run successfully
- Verify username column exists in user_profiles table
- Check Supabase logs for detailed errors

### Username Not Showing on Landing Page
- Verify user has completed onboarding
- Check browser console for errors
- Ensure user_profiles table has the username

## Code Changes Summary

### Modified Files
1. `app/(auth)/signup/page.tsx` - Added username field
2. `app/onboarding/page.tsx` - Save username to profile
3. `components/landing/Hero.tsx` - Display username for logged-in users
4. `components/landing/Navbar.tsx` - Show username in navigation
5. `supabase/schema.sql` - Added username column

### New Files
1. `supabase/add_username_migration.sql` - Migration for existing databases
2. `USERNAME_SETUP_GUIDE.md` - This guide

## Next Steps

1. Run the appropriate SQL file in Supabase
2. Test the complete user flow
3. Customize the onboarding questions if needed
4. Add more personalization features using the username

## Support

If you encounter any issues:
1. Check Supabase logs
2. Verify all migrations ran successfully
3. Check browser console for client-side errors
4. Ensure environment variables are set correctly
