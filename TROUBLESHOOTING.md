# 🔧 Troubleshooting Guide

## Common Issues & Solutions

### 🚨 Installation Issues

#### "npm install" fails

**Problem:** Dependencies won't install

**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install

# If still fails, try with legacy peer deps
npm install --legacy-peer-deps
```

#### "Module not found" errors

**Problem:** Can't find installed packages

**Solutions:**
```bash
# Restart your terminal
# Then reinstall
npm install

# Make sure you're in the project root
pwd  # Should show your project directory
```

---

### 🔐 Authentication Issues

#### Can't sign up

**Problem:** Signup form doesn't work

**Solutions:**
1. Check browser console for errors
2. Verify Supabase credentials in `.env.local`
3. Check Supabase project is active
4. Verify email confirmation is disabled in Supabase:
   - Go to Authentication > Settings
   - Disable "Enable email confirmations"

#### Can't login

**Problem:** Login fails with correct credentials

**Solutions:**
1. Check if user exists in Supabase:
   - Go to Authentication > Users
2. Try password reset
3. Check browser console for errors
4. Verify Supabase URL is correct

#### Redirects to login after signup

**Problem:** Can't stay logged in

**Solutions:**
1. Check if cookies are enabled
2. Clear browser cookies
3. Try incognito mode
4. Check Supabase Auth settings

---

### 🗄️ Database Issues

#### "Profile not found" error

**Problem:** Can't load user profile

**Solutions:**
1. Check if onboarding was completed
2. Verify profile exists in Supabase:
   - Go to Table Editor > user_profiles
3. Check RLS policies are enabled
4. Try completing onboarding again

#### Can't save data

**Problem:** Forms submit but data doesn't save

**Solutions:**
1. Check browser console for errors
2. Verify Supabase credentials
3. Check RLS policies:
   ```sql
   -- Run in Supabase SQL Editor
   SELECT * FROM user_profiles WHERE user_id = auth.uid();
   ```
4. Check if tables exist in Supabase

#### "Row Level Security" errors

**Problem:** Can't access data

**Solutions:**
1. Verify you're logged in
2. Check RLS policies in Supabase
3. Re-run the schema.sql file
4. Check user_id matches auth.uid()

---

### 🤖 AI Issues

#### AI insights not showing

**Problem:** No insights on dashboard

**Solutions:**
1. **This is normal for new users!**
2. Log data for a few days first
3. Check Groq API key in `.env.local`
4. App uses rule-based fallback automatically
5. Check browser console for errors

#### "Groq API error"

**Problem:** AI requests failing

**Solutions:**
1. Verify Groq API key is correct
2. Check Groq console for rate limits
3. Wait a few minutes and try again
4. App will use rule-based fallback

---

### 📊 Dashboard Issues

#### Dashboard shows loading forever

**Problem:** Dashboard never loads

**Solutions:**
1. Check browser console for errors
2. Verify user is logged in
3. Check if profile exists
4. Try refreshing the page
5. Clear browser cache
6. Check Supabase connection

#### Life Score shows 0

**Problem:** Score is always zero

**Solutions:**
1. **This is normal for new users!**
2. Start logging daily activities
3. Scores update as you add data
4. Check if data is saving correctly

#### Charts not rendering

**Problem:** Charts are blank or broken

**Solutions:**
1. Check if data exists
2. Verify Recharts is installed:
   ```bash
   npm install recharts
   ```
3. Check browser console for errors
4. Try refreshing the page

---

### 🎨 UI/UX Issues

#### Dark mode not working

**Problem:** Theme toggle doesn't work

**Solutions:**
1. Check browser console for errors
2. Clear localStorage:
   ```javascript
   localStorage.clear()
   ```
3. Refresh the page
4. Check if JavaScript is enabled

#### Mobile menu not opening

**Problem:** Hamburger menu doesn't work

**Solutions:**
1. Check browser console for errors
2. Try on different browser
3. Check if JavaScript is enabled
4. Verify screen size is < 768px

#### Animations not smooth

**Problem:** Laggy or no animations

**Solutions:**
1. Check browser performance
2. Close other tabs
3. Update browser
4. Check if hardware acceleration is enabled

---

### 🚀 Deployment Issues

#### Vercel build fails

**Problem:** Deployment fails on Vercel

**Solutions:**
1. Check build logs in Vercel
2. Verify all environment variables are set
3. Test build locally:
   ```bash
   npm run build
   ```
4. Check for TypeScript errors
5. Verify all imports are correct

#### Environment variables not working

**Problem:** App can't access env vars on Vercel

**Solutions:**
1. Verify all 5 variables are set in Vercel
2. Check variable names match exactly
3. Redeploy after adding variables
4. Use `NEXT_PUBLIC_` prefix for client-side vars

#### "Module not found" on Vercel

**Problem:** Build fails with missing modules

**Solutions:**
1. Check package.json has all dependencies
2. Commit package-lock.json
3. Try redeploying
4. Check Node.js version in Vercel settings

---

### 🔒 Security Issues

#### "Unauthorized" errors

**Problem:** API routes return 401

**Solutions:**
1. Check if user is logged in
2. Verify auth token is valid
3. Check Supabase service role key
4. Try logging out and back in

#### Can see other users' data

**Problem:** RLS not working

**Solutions:**
1. **This is critical!** Re-run schema.sql
2. Verify RLS policies are enabled
3. Check policies in Supabase:
   - Go to Authentication > Policies
4. Test with different users

---

### 📱 Mobile Issues

#### Layout broken on mobile

**Problem:** UI doesn't fit on small screens

**Solutions:**
1. Check viewport meta tag in layout.tsx
2. Test on real device, not just browser
3. Check Tailwind responsive classes
4. Verify mobile menu works

#### Touch events not working

**Problem:** Can't interact on mobile

**Solutions:**
1. Check if touch events are enabled
2. Test on real device
3. Check for JavaScript errors
4. Verify buttons have proper touch targets

---

### 🐛 General Debugging

#### Check Browser Console

**Always check console first:**
1. Open DevTools (F12)
2. Go to Console tab
3. Look for red errors
4. Read error messages carefully

#### Check Network Tab

**For API issues:**
1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "Fetch/XHR"
4. Check failed requests
5. Look at response data

#### Check Supabase Logs

**For database issues:**
1. Go to Supabase Dashboard
2. Click "Logs" in sidebar
3. Check for errors
4. Look at recent queries

#### Check Vercel Logs

**For deployment issues:**
1. Go to Vercel Dashboard
2. Click on your project
3. Go to "Deployments"
4. Click on latest deployment
5. Check "Build Logs" and "Function Logs"

---

### 🆘 Still Stuck?

#### Quick Fixes to Try

1. **Restart everything:**
   ```bash
   # Stop dev server (Ctrl+C)
   # Clear cache
   rm -rf .next
   # Restart
   npm run dev
   ```

2. **Clear all caches:**
   ```bash
   # Clear npm cache
   npm cache clean --force
   
   # Clear browser cache
   # In browser: Ctrl+Shift+Delete
   
   # Clear localStorage
   # In console: localStorage.clear()
   ```

3. **Fresh install:**
   ```bash
   rm -rf node_modules package-lock.json .next
   npm install
   npm run dev
   ```

4. **Check versions:**
   ```bash
   node --version  # Should be 18+
   npm --version   # Should be 9+
   ```

#### Debug Checklist

- [ ] Checked browser console
- [ ] Checked network tab
- [ ] Checked Supabase logs
- [ ] Checked Vercel logs
- [ ] Tried in incognito mode
- [ ] Tried different browser
- [ ] Cleared all caches
- [ ] Restarted dev server
- [ ] Verified environment variables
- [ ] Checked database tables exist

---

### 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Groq Documentation](https://console.groq.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

### 💡 Pro Tips

1. **Always check console first** - 90% of issues show errors there
2. **Test locally before deploying** - Catch issues early
3. **Use incognito mode** - Eliminates cache issues
4. **Check one thing at a time** - Systematic debugging
5. **Read error messages carefully** - They usually tell you what's wrong

---

## 🎉 Most Issues Are Easy to Fix!

Don't panic! Most problems have simple solutions. Follow this guide step by step and you'll be back on track quickly.

**Remember:** The app is production-ready. If something breaks, it's usually a configuration issue, not a code issue.

Good luck! 🚀
