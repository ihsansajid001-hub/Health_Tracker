# Test Google Authentication

## ✅ Pre-Test Checklist

Before testing, make sure:
- [ ] Google OAuth is enabled in Supabase (see `CLICK_HERE_TO_ENABLE_GOOGLE.md`)
- [ ] Development server is running (`npm run dev`)
- [ ] Browser allows popups for localhost:3000

---

## 🧪 Test 1: Login Page Google Button

### Steps:
1. Open: http://localhost:3000/login
2. Look for "Sign in with Google" button
3. Click the button
4. Google login popup should appear

### Expected Result:
```
✅ Google login popup opens
✅ Can select Google account
✅ After login, redirected to /auth/callback
✅ Then redirected to /onboarding (new user) or /dashboard (existing user)
```

### If It Fails:
- Check browser console (F12) for errors
- Verify Google is enabled in Supabase
- Check error message on page

---

## 🧪 Test 2: Signup Page Google Button

### Steps:
1. Open: http://localhost:3000/signup
2. Look for "Sign up with Google" button
3. Click the button
4. Google login popup should appear

### Expected Result:
```
✅ Google login popup opens
✅ Can select Google account
✅ After login, redirected to /auth/callback
✅ Then redirected to /onboarding
```

---

## 🧪 Test 3: New User Flow (Complete Journey)

### Steps:
1. Use a Google account that hasn't signed up before
2. Go to http://localhost:3000/signup
3. Click "Sign up with Google"
4. Complete Google authentication
5. Should land on /onboarding page
6. Fill out the onboarding form:
   - Age: 25
   - Gender: male
   - Height: 175 cm
   - Weight: 70 kg
   - Activity Level: moderate
   - Sleep Hours: 7
   - Stress Level: 5
   - Primary Goal: general_wellness
7. Submit the form

### Expected Result:
```
✅ Redirected to /onboarding after Google login
✅ Onboarding form appears
✅ Can fill out all fields
✅ Form submits successfully
✅ Redirected to /dashboard
✅ Dashboard shows user data
```

### Verify in Database:
1. Open: https://app.supabase.com/project/dfncowcdbymbpxthlpzf/auth/users
2. Check: New user exists with Google email
3. Open: https://app.supabase.com/project/dfncowcdbymbpxthlpzf/editor
4. Click "user_profiles" table
5. Check: Profile exists with correct data
6. Verify: `user_id` matches the auth.users id

---

## 🧪 Test 4: Existing User Flow

### Steps:
1. Log out from dashboard
2. Go to http://localhost:3000/login
3. Click "Sign in with Google"
4. Use the same Google account from Test 3

### Expected Result:
```
✅ Google login popup opens
✅ After login, redirected to /auth/callback
✅ Then redirected DIRECTLY to /dashboard (skips onboarding)
✅ Dashboard shows existing user data
```

---

## 🧪 Test 5: Database Verification

### Check Auth Users:
1. Open: https://app.supabase.com/project/dfncowcdbymbpxthlpzf/auth/users
2. Find your Google user
3. Verify fields:
   ```
   ✅ email: your-google-email@gmail.com
   ✅ provider: google
   ✅ confirmed_at: has timestamp
   ✅ last_sign_in_at: has timestamp
   ```

### Check User Profiles:
1. Open: https://app.supabase.com/project/dfncowcdbymbpxthlpzf/editor
2. Click "user_profiles" table
3. Find your profile
4. Verify fields:
   ```
   ✅ user_id: matches auth.users id
   ✅ age: 25
   ✅ gender: male
   ✅ height: 175
   ✅ weight: 70
   ✅ activity_level: moderate
   ✅ sleep_hours_avg: 7
   ✅ stress_level: 5
   ✅ primary_goal: general_wellness
   ✅ bmi: calculated automatically
   ✅ bmr: calculated automatically
   ✅ maintenance_calories: calculated automatically
   ```

---

## 🧪 Test 6: Route Protection

### Test Protected Routes:
1. Log out
2. Try to access: http://localhost:3000/dashboard
3. Should redirect to: http://localhost:3000/login

### Test Auth Routes:
1. Log in with Google
2. Try to access: http://localhost:3000/login
3. Should redirect to: http://localhost:3000/dashboard

### Expected Result:
```
✅ Cannot access dashboard when logged out
✅ Redirected to login page
✅ Cannot access login page when logged in
✅ Redirected to dashboard
```

---

## 🧪 Test 7: API Endpoints

### Test with Authentication:
1. Log in with Google
2. Open browser console (F12)
3. Run this code:
```javascript
// Get auth token
const { data: { session } } = await supabase.auth.getSession();
const token = session?.access_token;

// Test API call
const response = await fetch('/api/score/current', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
console.log('Score:', data);
```

### Expected Result:
```
✅ API call succeeds
✅ Returns life score data
✅ No "Unauthorized" error
```

---

## 🧪 Test 8: Sign Out

### Steps:
1. While logged in, go to dashboard
2. Find and click "Sign Out" button
3. Should redirect to home page

### Expected Result:
```
✅ Successfully signed out
✅ Redirected to home page
✅ Cannot access dashboard anymore
✅ Can log in again
```

---

## 📊 Test Results Summary

| Test | Status | Notes |
|------|--------|-------|
| Login Page Button | ⬜ | |
| Signup Page Button | ⬜ | |
| New User Flow | ⬜ | |
| Existing User Flow | ⬜ | |
| Database Verification | ⬜ | |
| Route Protection | ⬜ | |
| API Endpoints | ⬜ | |
| Sign Out | ⬜ | |

---

## 🐛 Common Issues & Solutions

### Issue: "Provider not enabled"
**Solution:** Enable Google in Supabase Dashboard
- Link: https://app.supabase.com/project/dfncowcdbymbpxthlpzf/auth/providers
- Toggle Google ON
- Click Save

### Issue: Popup blocked
**Solution:** Allow popups for localhost:3000 in browser settings

### Issue: "Redirect URI mismatch"
**Solution:** Check redirect URL in Supabase:
- Should be: `http://localhost:3000/auth/callback`
- No trailing slash
- Must be http (not https)

### Issue: User created but no profile
**Solution:** This is normal!
- Google creates user in auth.users
- Profile created when user completes onboarding
- Check that onboarding form works

### Issue: Stuck on callback page
**Solution:** Check browser console for errors
- Verify `/app/auth/callback/route.ts` exists
- Check middleware isn't blocking callback

---

## ✅ All Tests Passed?

If all tests pass, your Google authentication is working perfectly:
- ✅ Login page works
- ✅ Signup page works
- ✅ Users saved to database
- ✅ Profiles created properly
- ✅ Routes protected
- ✅ APIs secured
- ✅ Sign out works

**You're ready for production!** 🎉
