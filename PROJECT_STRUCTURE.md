# 📁 Project Structure

## Overview

```
peacehub-lifestyle/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth pages group
│   │   ├── login/
│   │   └── signup/
│   ├── api/                      # API routes
│   │   ├── insights/
│   │   ├── score/
│   │   └── streak/
│   ├── dashboard/                # Protected dashboard
│   │   ├── sleep/
│   │   ├── fitness/
│   │   ├── nutrition/
│   │   ├── mind/
│   │   ├── hydration/
│   │   ├── analytics/
│   │   └── community/
│   ├── onboarding/
│   ├── layout.tsx
│   ├── page.tsx                  # Landing page
│   └── globals.css
├── components/
│   ├── landing/                  # Landing page components
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Testimonials.tsx
│   │   ├── Community.tsx
│   │   ├── CTA.tsx
│   │   └── Footer.tsx
│   ├── dashboard/                # Dashboard components
│   │   ├── DashboardLayout.tsx
│   │   ├── LifeScoreCard.tsx
│   │   ├── StreakCard.tsx
│   │   ├── QuickActions.tsx
│   │   └── RecentInsights.tsx
│   ├── charts/                   # Chart components
│   │   ├── RadarChart.tsx
│   │   └── TrendChart.tsx
│   └── providers/
│       └── ThemeProvider.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Client-side Supabase
│   │   └── server.ts             # Server-side Supabase
│   └── utils/
│       ├── calculations.ts       # BMI, BMR, etc.
│       └── auth.ts               # Auth helpers
├── services/
│   ├── lifeScoreEngine.ts        # Scoring algorithm
│   └── aiInsightsService.ts      # AI insights (Groq)
├── types/
│   └── index.ts                  # TypeScript types
├── supabase/
│   └── schema.sql                # Database schema
├── public/                       # Static assets
├── .env.local.example            # Environment template
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
├── README.md
├── SETUP.md
└── LAUNCH_CHECKLIST.md
```

## Key Files Explained

### Core Services

**`services/lifeScoreEngine.ts`**
- Calculates Life Performance Score (0-100)
- Weighted scoring algorithm
- Separate scores for each category
- Pure logic, no UI dependencies

**`services/aiInsightsService.ts`**
- Generates AI-powered insights using Groq
- Falls back to rule-based system
- Weekly recommendations
- No medical advice

### API Routes

**`app/api/score/current/route.ts`**
- Returns current Life Score
- Fetches weekly data
- Calculates scores in real-time

**`app/api/insights/recent/route.ts`**
- Generates AI insights
- Uses Groq API (Llama 3.3)
- Returns personalized recommendations

**`app/api/streak/route.ts`**
- Calculates current streak
- Tracks longest streak
- Checks last 90 days

**`app/api/score/trend/route.ts`**
- Returns 7-day score trend
- Used for trend chart
- Daily score calculations

### Database

**`supabase/schema.sql`**
- Complete database schema
- Row Level Security (RLS) policies
- Indexes for performance
- All necessary tables

### Components

**Landing Page**
- Navbar with theme toggle
- Hero section with CTA
- Features grid
- How It Works steps
- Testimonials carousel
- Community section
- Final CTA
- Footer

**Dashboard**
- Sidebar navigation
- Life Score card with circular progress
- Radar chart for balance
- Trend line chart
- Quick action buttons
- AI insights panel
- Streak tracker

## Architecture Decisions

### Why This Structure?

1. **Separation of Concerns**
   - Services handle business logic
   - Components handle UI
   - API routes handle data fetching

2. **Scalability**
   - Easy to add new tracking modules
   - Modular component structure
   - Reusable services

3. **Performance**
   - Server-side rendering where possible
   - Client-side for interactivity
   - Optimized database queries

4. **Security**
   - Row Level Security in Supabase
   - Protected API routes
   - Secure authentication

## Adding New Features

### To Add a New Tracking Module:

1. Create page in `app/dashboard/[module]/`
2. Add API route in `app/api/[module]/`
3. Update scoring engine in `services/lifeScoreEngine.ts`
4. Add navigation link in `DashboardLayout.tsx`
5. Create database table in Supabase

### To Modify Scoring:

1. Edit `services/lifeScoreEngine.ts`
2. Adjust weights in `WEIGHTS` constant
3. Modify calculation methods
4. Test with sample data

### To Customize UI:

1. Edit components in `components/`
2. Modify Tailwind classes
3. Update theme in `tailwind.config.ts`
4. Test dark/light modes

## Best Practices

- Keep services pure (no side effects)
- Use TypeScript types from `types/index.ts`
- Follow Next.js App Router conventions
- Use Supabase RLS for security
- Test all user flows before deployment

## Need Help?

Check the inline code comments for detailed explanations of complex logic.
