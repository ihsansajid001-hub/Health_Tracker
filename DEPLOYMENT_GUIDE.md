# 🚀 Deployment Guide - Launch Tonight!

## Pre-Deployment Checklist

### ✅ Step 1: Supabase Setup (5 minutes)

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new organization (if needed)
4. Create a new project:
   - Name: `peacehub-lifestyle`
   - Database Password: (save this!)
   - Region: Choose closest to you
   - Wait 2-3 minutes for setup

5. Get your credentials:
   - Go to Settings > API
   - Copy `Project URL`
   - Copy `anon public` key
   - Copy `service_role` key (click "Reveal")

6. Set up database:
   - Click "SQL Editor" in sidebar
   - Click "New query"
   - Copy entire content from `supabase/schema.sql`
   - Paste and click "Run"
   - Should see "Success. No rows returned"

### ✅ Step 2: Groq API Setup (2 minutes)

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up with Google/GitHub
3. Click "API Keys" in sidebar
4. Click "Create API Key"
5. Name it "PeaceHub"
6. Copy the key (save it!)

### ✅ Step 3: Local Environment Setup

Create `.env.local` file in project root:

```env
# Supabase (from Step 1)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Groq AI (from Step 2)
GROQ_API_KEY=your_groq_api_key_here

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
JWT_SECRET=your_random_secret_here_use_any_long_string
```

### ✅ Step 4: Install & Test Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open http://localhost:3000 and test:
- [ ] Landing page loads
- [ ] Can sign up
- [ ] Onboarding works
- [ ] Dashboard loads
- [ ] Can log sleep/fitness/etc
- [ ] Dark mode toggle works

### ✅ Step 5: Deploy to Vercel (5 minutes)

1. Push to GitHub:
```bash
git init
git add .
git commit -m "Initial commit - PeaceHub Lifestyle"
git branch -M main
git remote add origin your-github-repo-url
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Click "Add New" > "Project"
4. Import your GitHub repository
5. Configure:
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next

6. Add Environment Variables (click "Environment Variables"):
   - Copy all from your `.env.local`
   - Add each one (Name and Value)
   - Make sure to add all 5 variables!

7. Click "Deploy"
8. Wait 2-3 minutes
9. Your site is live! 🎉

### ✅ Step 6: Post-Deployment Testing

Test your live site:
- [ ] Visit your Vercel URL
- [ ] Sign up with a new account
- [ ] Complete onboarding
- [ ] Log some data
- [ ] Check if scores update
- [ ] Test on mobile
- [ ] Share with friends!

## 🔧 Troubleshooting

### Issue: "Failed to fetch" errors

**Solution:** Check environment variables in Vercel
- Go to Project Settings > Environment Variables
- Verify all 5 variables are set
- Redeploy if you added/changed variables

### Issue: Database errors

**Solution:** Verify Supabase setup
- Check if SQL schema ran successfully
- Go to Supabase > Table Editor
- Should see 8 tables: user_profiles, sleep_logs, workout_logs, etc.

### Issue: AI insights not showing

**Solution:** This is normal!
- Groq API needs data to generate insights
- Log data for a few days first
- App uses rule-based fallback automatically

### Issue: Scores showing 0

**Solution:** This is expected!
- New users start at 0
- Start logging daily activities
- Scores will increase as you track

## 📱 Custom Domain (Optional)

1. In Vercel, go to Project Settings > Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_APP_URL` in environment variables

## 🎨 Customization Ideas

### Change Brand Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  primary: {
    500: '#your-color',
    // ...
  }
}
```

### Update Logo
Replace the "P" in components with your logo image

### Modify Landing Page
Edit files in `components/landing/`

## 📊 Monitoring

### Check Supabase Usage
- Go to Supabase Dashboard
- Check "Database" for storage
- Check "Auth" for user count
- Free tier: 500MB database, 50,000 monthly active users

### Check Groq Usage
- Go to Groq Console
- Check API usage
- Free tier: Very generous limits

### Check Vercel Usage
- Go to Vercel Dashboard
- Check bandwidth and function invocations
- Free tier: 100GB bandwidth, 100GB-hours compute

## 🚀 Launch Announcement Template

```
🎉 Excited to launch PeaceHub Lifestyle!

A free AI-powered wellness platform to optimize your:
😴 Sleep
💪 Fitness  
🥗 Nutrition
🧘 Mental Health
💧 Hydration

✨ Features:
- Life Performance Score (0-100)
- AI-powered insights
- Beautiful dark/light mode
- Progress tracking & streaks
- 100% FREE forever!

Try it: [your-vercel-url]

Built with Next.js, Supabase, and Groq AI 🚀
```

## 🎯 Next Steps After Launch

1. **Gather Feedback**
   - Share with friends/family
   - Ask for honest feedback
   - Note feature requests

2. **Monitor Performance**
   - Check Vercel analytics
   - Monitor error logs
   - Watch Supabase usage

3. **Iterate**
   - Fix bugs quickly
   - Add requested features
   - Improve UX based on feedback

4. **Marketing**
   - Share on social media
   - Post on Product Hunt
   - Write a blog post
   - Make a demo video

## 🆘 Need Help?

- Check browser console for errors
- Check Vercel deployment logs
- Check Supabase logs
- Review code comments
- Test locally first

## 🎉 You're Ready to Launch!

Everything is set up. Just follow the steps above and you'll be live tonight!

Good luck! 🚀
