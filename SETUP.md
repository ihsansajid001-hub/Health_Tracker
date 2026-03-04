# PeaceHub Lifestyle - Setup Guide

## 🚀 Quick Start (5 Minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to Project Settings > API
4. Copy your project URL and anon key

### 3. Set Up Groq AI (Free)

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up for free
3. Create an API key

### 4. Configure Environment Variables

Create `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Groq AI (Free)
GROQ_API_KEY=your_groq_api_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
JWT_SECRET=your_random_secret_key_here
```

### 5. Set Up Database

1. Go to your Supabase project
2. Click on "SQL Editor" in the left sidebar
3. Copy the entire content from `supabase/schema.sql`
4. Paste it into the SQL Editor
5. Click "Run" to execute

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

## 🎨 Features Included

✅ Beautiful landing page (PeaceHub style)
✅ User authentication (signup/login)
✅ Smart onboarding flow
✅ Life Performance Score (0-100)
✅ Sleep tracking
✅ Fitness tracking
✅ Nutrition tracking
✅ Mind & mood tracking
✅ Hydration tracking
✅ AI-powered insights (Groq/Llama 3.3)
✅ Weekly analytics
✅ Streak system
✅ Dark/Light mode
✅ Responsive design
✅ Progress celebrations

## 📦 Deployment to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables from `.env.local`
5. Deploy!

## 🔧 Troubleshooting

### Database Connection Issues
- Make sure you ran the SQL schema in Supabase
- Check that your Supabase URL and keys are correct
- Verify Row Level Security (RLS) policies are enabled

### AI Insights Not Working
- Verify your Groq API key is correct
- Check the Groq console for rate limits
- The app will fall back to rule-based insights if API fails

### Authentication Issues
- Clear browser cookies and try again
- Check Supabase Auth settings
- Verify email confirmation is disabled for development

## 📝 Next Steps

1. Customize the landing page content
2. Add your own branding/logo
3. Configure email templates in Supabase
4. Set up custom domain
5. Add more tracking features

## 🆘 Need Help?

- Check the README.md for more details
- Review the code comments
- Check Supabase documentation
- Check Next.js documentation

## 🎉 You're All Set!

Your wellness platform is ready to launch. Start tracking and optimizing your lifestyle!
