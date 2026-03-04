# ⚡ QUICK START - Get Running in 5 Minutes!

## 🎯 Fastest Way to Launch

### Step 1: Install Dependencies (1 minute)
```bash
npm install
```

### Step 2: Set Up Supabase (2 minutes)

1. Go to https://supabase.com/dashboard
2. Click "New project"
3. Fill in:
   - Name: peacehub-lifestyle
   - Database Password: (create a strong one)
   - Region: (choose closest)
4. Wait for project to be ready
5. Go to Settings > API
6. Copy these values:
   - Project URL
   - anon public key
   - service_role key

### Step 3: Set Up Groq (1 minute)

1. Go to https://console.groq.com
2. Sign up (free)
3. Click "API Keys"
4. Create new key
5. Copy the key

### Step 4: Create .env.local (30 seconds)

Create `.env.local` file in root:

```env
NEXT_PUBLIC_SUPABASE_URL=paste_your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste_your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=paste_your_service_role_key_here
GROQ_API_KEY=paste_your_groq_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
JWT_SECRET=any_random_long_string_here_like_this_one_12345
```

### Step 5: Set Up Database (30 seconds)

1. In Supabase, click "SQL Editor"
2. Click "New query"
3. Open `supabase/schema.sql` from this project
4. Copy ALL the content
5. Paste in Supabase SQL Editor
6. Click "Run"
7. Should see "Success. No rows returned"

### Step 6: Run the App! (10 seconds)

```bash
npm run dev
```

Open http://localhost:3000 🎉

## ✅ Test It Works

1. Click "Get Started"
2. Sign up with email
3. Complete onboarding
4. See your dashboard!

## 🚀 Deploy to Vercel (Optional - 3 minutes)

```bash
# Push to GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main

# Then:
# 1. Go to vercel.com
# 2. Import your repo
# 3. Add the same environment variables
# 4. Deploy!
```

## 🎊 That's It!

You now have a fully functional AI-powered wellness platform running!

## 🆘 Troubleshooting

### "Module not found" error
```bash
rm -rf node_modules package-lock.json
npm install
```

### Database errors
- Make sure you ran the SQL schema in Supabase
- Check your Supabase URL and keys are correct

### Can't sign up
- Check browser console for errors
- Verify Supabase project is active
- Check environment variables are set

### AI insights not showing
- This is normal for new users
- Log some data first
- App uses rule-based fallback automatically

## 📚 Next Steps

- Read SETUP.md for detailed setup
- Read DEPLOYMENT_GUIDE.md for deployment
- Read PROJECT_STRUCTURE.md to understand the code
- Start customizing!

## 🎯 You're Ready to Launch!

Everything works. Just follow the steps above and you're live! 🚀
