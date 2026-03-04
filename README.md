# 🌟 PeaceHub Lifestyle - AI-Powered Wellness Platform

> Transform your lifestyle with AI-powered insights for sleep, fitness, nutrition, and mental wellness.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=flat-square&logo=supabase)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

A production-ready, full-stack wellness platform that helps users optimize their lifestyle through comprehensive tracking and AI-powered personalized recommendations.

## ✨ Features

### 🎯 Core Tracking
- **Life Performance Score** - Holistic 0-100 score based on all wellness metrics
- **Sleep Tracking** - Monitor sleep hours, quality, and patterns
- **Fitness Logging** - Track workouts, duration, and intensity
- **Nutrition Tracking** - Log calories, macros, and meals
- **Mind & Mood** - Monitor mental wellness and stress levels
- **Hydration** - Track daily water intake with quick-add buttons

### 📊 Analytics & Insights
- **AI-Powered Recommendations** - Personalized insights using Groq/Llama 3.3
- **Weekly Trend Charts** - Visualize your progress over time
- **Radar Charts** - See your wellness balance at a glance
- **Streak System** - Gamification with current and longest streaks
- **Progress Celebrations** - Animated achievements and milestones

### 🎨 Design & UX
- **Beautiful UI** - PeaceHub-inspired calming aesthetic
- **Dark/Light Mode** - Seamless theme switching
- **Fully Responsive** - Perfect on mobile, tablet, and desktop
- **Smooth Animations** - Delightful micro-interactions
- **Accessible** - WCAG-compliant design patterns

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- A Supabase account (free)
- A Groq account (free)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/peacehub-lifestyle.git
cd peacehub-lifestyle

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your credentials

# 4. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app! 🎉

### Detailed Setup

For step-by-step instructions, see:
- **[QUICK_START.md](QUICK_START.md)** - Get running in 5 minutes
- **[SETUP.md](SETUP.md)** - Detailed setup guide
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Deploy to production

## 🏗️ Tech Stack

### Frontend
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[Recharts](https://recharts.org/)** - Beautiful charts
- **[Lucide Icons](https://lucide.dev/)** - Clean, consistent icons
- **[Framer Motion](https://www.framer.com/motion/)** - Smooth animations

### Backend & Database
- **[Supabase](https://supabase.com/)** - PostgreSQL database + Auth
- **[Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)** - Secure data access
- **Next.js API Routes** - Serverless backend

### AI & Analytics
- **[Groq](https://groq.com/)** - Ultra-fast AI inference
- **[Llama 3.3 70B](https://www.llama.com/)** - Advanced language model
- **Custom Scoring Engine** - Proprietary wellness algorithm

### Deployment
- **[Vercel](https://vercel.com/)** - Zero-config deployment
- **Edge Functions** - Global low-latency
- **Automatic HTTPS** - Secure by default

## 📂 Project Structure

```
peacehub-lifestyle/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication pages
│   ├── api/                 # API routes
│   ├── dashboard/           # Protected dashboard
│   └── onboarding/          # User onboarding
├── components/              # React components
│   ├── landing/            # Landing page sections
│   ├── dashboard/          # Dashboard components
│   ├── charts/             # Chart components
│   └── providers/          # Context providers
├── lib/                     # Utilities
│   ├── supabase/           # Supabase clients
│   └── utils/              # Helper functions
├── services/                # Business logic
│   ├── lifeScoreEngine.ts  # Scoring algorithm
│   └── aiInsightsService.ts # AI insights
├── types/                   # TypeScript types
└── supabase/               # Database schema
```

See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for detailed architecture.

## 🎯 Key Features Explained

### Life Score Algorithm

The Life Performance Score is calculated using a weighted algorithm:

- **Sleep**: 25% - Quality and duration
- **Fitness**: 20% - Frequency and intensity
- **Nutrition**: 20% - Calorie and macro targets
- **Mind**: 15% - Mood and stress levels
- **Hydration**: 10% - Daily water intake
- **Consistency**: 10% - Tracking regularity

### AI Insights

Powered by Groq's Llama 3.3 70B model:
- Analyzes weekly wellness data
- Generates personalized recommendations
- Identifies strengths and improvement areas
- Falls back to rule-based system if API unavailable

## 🔒 Security

- ✅ Row Level Security (RLS) in Supabase
- ✅ JWT-based authentication
- ✅ Secure password hashing
- ✅ Protected API routes
- ✅ Input validation with Zod
- ✅ No exposed secrets

## 🌍 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/peacehub-lifestyle)

1. Click the button above
2. Add environment variables
3. Deploy!

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

## 📊 Free Tier Limits

All services used are FREE:

- **Supabase**: 500MB database, 50K MAU
- **Groq**: Generous rate limits, no credit card
- **Vercel**: 100GB bandwidth, unlimited sites

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 📝 Environment Variables

Required environment variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Groq AI
GROQ_API_KEY=your_groq_api_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Design inspired by [PeaceHub](https://peacehub.framer.website/)
- Built with amazing open-source tools
- Powered by Groq's lightning-fast AI inference

## 📚 Documentation

- [Quick Start Guide](QUICK_START.md)
- [Setup Instructions](SETUP.md)
- [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [Project Structure](PROJECT_STRUCTURE.md)
- [Launch Checklist](LAUNCH_CHECKLIST.md)

## 🆘 Support

Need help? Check out:
- [Setup Guide](SETUP.md) for installation issues
- [Deployment Guide](DEPLOYMENT_GUIDE.md) for deployment issues
- Browser console for runtime errors
- Vercel logs for deployment errors

## 🎉 Ready to Launch!

Everything is set up and ready to go. Follow the [QUICK_START.md](QUICK_START.md) guide and you'll be live in minutes!

---

Made with ❤️ for your wellness journey
